import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import RouteMetadata from "./RouteMetadata";

afterEach(() => {
  cleanup();
  document.getElementById("route-structured-data")?.remove();
});

describe("RouteMetadata", () => {
  it("writes unique product metadata and structured data", async () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={["/product/moscato-grape-juice"]}>
        <RouteMetadata contentVersion={0} />
      </MemoryRouter>,
    );

    await waitFor(() => expect(document.title).toContain("Moscato Sparkling Grape Juice"));
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      expect.stringContaining("Moscato"),
    );
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://tuscanini-site.vercel.app/product/moscato-grape-juice",
    );
    const structuredData = document.getElementById("route-structured-data")?.textContent ?? "";
    expect(structuredData).toContain('"@type":"Product"');

    document.title = "Stale metadata";
    rerender(
      <MemoryRouter initialEntries={["/product/moscato-grape-juice"]}>
        <RouteMetadata contentVersion={1} />
      </MemoryRouter>,
    );
    await waitFor(() => expect(document.title).toContain("Moscato Sparkling Grape Juice"));
  });

  it("marks unknown routes as noindex", async () => {
    render(
      <MemoryRouter initialEntries={["/not-a-route"]}>
        <RouteMetadata contentVersion={0} />
      </MemoryRouter>,
    );

    await waitFor(() => expect(document.title).toContain("Page Not Found"));
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  });
});
