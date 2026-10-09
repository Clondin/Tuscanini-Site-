import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { categories } from "../../data/products";
import { sourcingRegions } from "../../data/sourcing-regions";
import RegionPanel from "./RegionPanel";

const campania = sourcingRegions.find((region) => region.id === "campania")!;

function renderPanel(selectedId: string | null, overrides = {}) {
  const props = {
    regions: sourcingRegions,
    selected: sourcingRegions.find((region) => region.id === selectedId) ?? null,
    hoveredId: null,
    touring: false,
    onSelect: vi.fn(),
    onHover: vi.fn(),
    onReset: vi.fn(),
    onToggleTour: vi.fn(),
    ...overrides,
  };
  render(
    <MemoryRouter>
      <RegionPanel {...props} />
    </MemoryRouter>,
  );
  return props;
}

describe("RegionPanel", () => {
  afterEach(cleanup);

  it("lists every region and reports hover and selection", async () => {
    const user = userEvent.setup();
    const props = renderPanel(null);
    for (const region of sourcingRegions)
      expect(screen.getByRole("button", { name: new RegExp(region.name) })).toBeInTheDocument();
    const button = screen.getByRole("button", { name: /Campania/ });
    await user.hover(button);
    expect(props.onHover).toHaveBeenCalledWith("campania");
    await user.click(button);
    expect(props.onSelect).toHaveBeenCalledWith(campania);
  });

  it("shows related catalog products and shop links for each related collection", () => {
    renderPanel("campania");
    const productLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.startsWith("/product/"));
    expect(productLinks.length).toBeGreaterThan(0);
    expect(productLinks.length).toBeLessThanOrEqual(4);
    for (const slug of campania.related) {
      const category = categories.find((entry) => entry.slug === slug);
      if (!category) continue;
      expect(
        screen.getByRole("link", { name: `Shop ${category.name}` }),
      ).toHaveAttribute("href", `/category/${slug}`);
    }
  });

  it("offers neighbouring regions and the tour toggle", async () => {
    const user = userEvent.setup();
    const props = renderPanel("campania", { touring: true });
    await user.click(screen.getByRole("button", { name: "Puglia" }));
    expect(props.onSelect).toHaveBeenCalledWith(
      sourcingRegions.find((region) => region.id === "puglia"),
    );
    const tour = screen.getByRole("button", { name: "Pause tour" });
    expect(tour).toHaveAttribute("aria-pressed", "true");
    await user.click(tour);
    expect(props.onToggleTour).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "All regions" }));
    expect(props.onReset).toHaveBeenCalled();
  });
});
