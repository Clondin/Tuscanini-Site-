import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import RouteMetadata from "./RouteMetadata";
import { categories, setCatalogCategories } from '../data/products';

afterEach(() => {
  cleanup();
  document.getElementById("route-structured-data")?.remove();
});

describe("RouteMetadata", () => {
  it("recognizes the new catalog route and canonicalizes filtered URLs", async () => {
    render(
      <MemoryRouter initialEntries={["/products?q=olive&format=frozen"]}>
        <RouteMetadata contentVersion={0} />
      </MemoryRouter>,
    );
    await waitFor(() =>
      expect(document.title).toContain("Explore Our Products"),
    );
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, follow",
    );
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://tuscanini-site.vercel.app/products",
    );
    expect(
      document.getElementById("route-structured-data")?.textContent,
    ).toContain('"@type":"CollectionPage"');
  });

  it("writes unique product metadata and structured data", async () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={["/product/moscato-grape-juice"]}>
        <RouteMetadata contentVersion={0} />
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(document.title).toContain("Moscato Sparkling Grape Juice"),
    );
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      expect.stringContaining("Moscato"),
    );
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://tuscanini-site.vercel.app/product/moscato-grape-juice",
    );
    const structuredData =
      document.getElementById("route-structured-data")?.textContent ?? "";
    expect(structuredData).toContain('"@type":"Product"');

    document.title = "Stale metadata";
    rerender(
      <MemoryRouter initialEntries={["/product/moscato-grape-juice"]}>
        <RouteMetadata contentVersion={1} />
      </MemoryRouter>,
    );
    await waitFor(() =>
      expect(document.title).toContain("Moscato Sparkling Grape Juice"),
    );
  });

  it("marks unknown routes as noindex", async () => {
    render(
      <MemoryRouter initialEntries={["/not-a-route"]}>
        <RouteMetadata contentVersion={0} />
      </MemoryRouter>,
    );

    await waitFor(() => expect(document.title).toContain("Page Not Found"));
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
  });

  it.each([
    ["solid-light-tuna-olive-oil-chili-peppers-can", "Can"],
    ["solid-light-tuna-olive-oil-chili-peppers-three-pack", "3 Pack"],
  ])("keeps %s metadata concise without losing the full product name", async (id, packageName) => {
    render(
      <MemoryRouter initialEntries={[`/product/${id}`]}>
        <RouteMetadata contentVersion={0} />
      </MemoryRouter>,
    );

    await waitFor(() => expect(document.title).toContain(packageName));
    expect(document.title.length).toBeLessThanOrEqual(60);
    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute("content", document.title);
    expect(document.querySelector('meta[name="twitter:title"]')).toHaveAttribute("content", document.title);
    expect(document.getElementById("route-structured-data")?.textContent).toContain(
      "Solid Light Tuna in Olive Oil with Chili Peppers",
    );
  });

  it.each([
    ["all-purpose-flour-1kg", "all-purpose-flour-2-2lb"],
    ["high-gluten-flour-2-27kg", "high-gluten-flour-5lb"],
    ["spelt-white-flour-2-27kg", "spelt-white-flour-5lb"],
  ])("uses the surviving product URL for the former %s listing", async (alias, canonicalId) => {
    render(
      <MemoryRouter initialEntries={[`/product/${alias}`]}>
        <RouteMetadata contentVersion={0} />
      </MemoryRouter>,
    );

    const canonicalUrl = `https://tuscanini-site.vercel.app/product/${canonicalId}`;
    await waitFor(() => expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", canonicalUrl));
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute("content", canonicalUrl);
    expect(document.getElementById("route-structured-data")?.textContent).toContain(canonicalUrl);
  });

  it("does not advertise an unavailable pack shot as a product image", async () => {
    const original = categories;
    setCatalogCategories(categories.map(category => ({ ...category, products: category.products.map(product => product.id === 'fries-gondola' ? { ...product, image: '/assets/placeholders/pack-shot-pending.svg' } : product) })));
    render(
      <MemoryRouter initialEntries={["/product/fries-gondola"]}>
        <RouteMetadata contentVersion={0} />
      </MemoryRouter>,
    );

    await waitFor(() => expect(document.title).toContain("Gondola Fries"));
    const socialImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? "";
    expect(socialImage).not.toContain("pack-shot-pending");
    const structuredData = JSON.parse(document.getElementById("route-structured-data")?.textContent ?? "[]");
    expect(structuredData.find((entry: { "@type": string }) => entry["@type"] === "Product").image).toBeUndefined();
    setCatalogCategories(original);
  });
});
