import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { recipes, setRecipes } from "../../data/recipes";
import RecipeSuggestions from "./RecipeSuggestions";

const originals = [...recipes];
afterEach(() => {
  cleanup();
  setRecipes(originals);
  vi.restoreAllMocks();
});
describe("recipe completeness", () => {
  it("shows every ingredient and a method when published directions exist", async () => {
    setRecipes([
      {
        id: "example",
        name: "Weeknight pasta",
        description: "A simple dinner.",
        ingredients: ["Pasta", "Water", "Salt", "Tomato", "Basil", "Oil"],
        instructions: ["Bring water to a boil.", "Cook pasta and combine."],
        products: ["spaghetti"],
        prepTime: "5 min",
        cookTime: "10 min",
        servings: 2,
      },
    ]);
    render(
      <MemoryRouter>
        <RecipeSuggestions productId="spaghetti" />
      </MemoryRouter>,
    );
    await userEvent.click(screen.getByText("Ingredients & method"));
    expect(screen.getByText("Oil")).toBeVisible();
    expect(screen.getByText("Cook pasta and combine.")).toBeVisible();
    expect(screen.getByText("Recipe", { exact: true })).toBeInTheDocument();
  });
  it("labels incomplete recipes as serving ideas without invented directions", () => {
    render(
      <MemoryRouter>
        <RecipeSuggestions productId="penne" />
      </MemoryRouter>,
    );
    expect(screen.getByText("Serving idea")).toBeInTheDocument();
    expect(screen.queryByText("Method")).not.toBeInTheDocument();
    expect(screen.queryByText(/\+\d+ more/)).not.toBeInTheDocument();
  });
});
