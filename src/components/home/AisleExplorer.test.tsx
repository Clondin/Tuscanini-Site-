import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { categories } from "../../data/products";
import { collectionGroups } from "../../data/collection-groups";
import AisleExplorer from "./AisleExplorer";

const groups = collectionGroups(categories);

describe("AisleExplorer", () => {
  afterEach(cleanup);

  it("shows the first aisle and switches panels by click and arrow key", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AisleExplorer />
      </MemoryRouter>,
    );
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    const panel = screen.getByRole("tabpanel");
    expect(within(panel).getByRole("heading", { name: groups[0].label })).toBeInTheDocument();

    await user.click(tabs[1]);
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    const pantry = screen.getByRole("tabpanel");
    for (const category of groups[1].items.slice(0, 3))
      expect(within(pantry).getByRole("link", { name: category.name })).toHaveAttribute(
        "href",
        `/category/${category.slug}`,
      );

    await user.keyboard("{ArrowRight}");
    expect(tabs[2]).toHaveAttribute("aria-selected", "true");
    expect(tabs[2]).toHaveFocus();
    await user.keyboard("{Home}");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });
});
