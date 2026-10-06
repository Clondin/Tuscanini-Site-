import { afterEach, describe, expect, it, vi } from "vitest";
import { categories as fallbackCategories } from "../src/data/products";
import { loadBuildCatalog, mapBuildCatalog } from "./load-build-catalog";

const category = {
  slug: "olive-oil",
  title: "Olive Oil",
  description: "Italian olive oil",
  data: { hero_image: "/olive-oil.webp" },
};
const product = {
  slug: "bottle",
  title: "Olive Oil Bottle",
  description: "Extra virgin olive oil",
  data: { source_id: " bottle ", category_slug: "olive-oil", image: "/bottle.webp" },
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("build catalog", () => {
  it("includes only routeable products attached to a published category", () => {
    const catalog = mapBuildCatalog([category, { ...category, slug: "../unpublished" }], [
      product,
      { ...product, slug: "orphan", data: { source_id: "orphan", category_slug: "not-published" } },
      { ...product, slug: "invalid", data: { source_id: "../invalid", category_slug: "olive-oil" } },
    ]);

    expect(catalog.map((item) => item.slug)).toEqual(["olive-oil"]);
    expect(catalog[0].products.map((item) => item.id)).toEqual(["bottle"]);
  });

  it("uses the slug when a published source ID is blank", () => {
    const catalog = mapBuildCatalog([category], [{ ...product, data: { ...product.data, source_id: " " } }]);
    expect(catalog[0].products[0].id).toBe("bottle");
  });

  it("keeps one canonical flour route even when both former names are published", () => {
    const canonical = { ...product, title: "Canonical Flour", data: { ...product.data, source_id: "all-purpose-flour-2-2lb" } };
    const alias = { ...product, title: "Former Flour Listing", data: { ...product.data, source_id: "all-purpose-flour-1kg" } };
    const catalog = mapBuildCatalog([category], [alias, canonical]);
    expect(catalog[0].products).toHaveLength(1);
    expect(catalog[0].products[0]).toMatchObject({ id: "all-purpose-flour-2-2lb", name: "Canonical Flour" });

    const oldOnlyCatalog = mapBuildCatalog([category], [alias]);
    expect(oldOnlyCatalog[0].products[0].id).toBe("all-purpose-flour-2-2lb");
  });

  it("loads every page before selecting the published catalog", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      const request = new URL(url);
      const items = request.pathname.endsWith("category") ? [category] : request.searchParams.has("cursor") ? [product] : [];
      const nextCursor = request.pathname.endsWith("product") && !request.searchParams.has("cursor") ? "next" : null;
      return new Response(JSON.stringify({ data: items, meta: { nextCursor } }), { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const catalog = await loadBuildCatalog();
    expect(catalog[0].products.map((item) => item.id)).toEqual(["bottle"]);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("keeps the complete bundled catalog when the CMS has no usable categories", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ data: [], meta: { nextCursor: null } }))));

    expect(await loadBuildCatalog()).toBe(fallbackCategories);
  });

  it("keeps the complete bundled catalog when one catalog request fails", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn(async (url: string) => new Response(
      JSON.stringify({ data: [category], meta: { nextCursor: null } }),
      { status: url.includes("/product?") ? 503 : 200 },
    )));

    expect(await loadBuildCatalog()).toBe(fallbackCategories);
  });
});
