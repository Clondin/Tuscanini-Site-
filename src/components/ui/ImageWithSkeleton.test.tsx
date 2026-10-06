import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ImageWithSkeleton from "./ImageWithSkeleton";
import { getOptimizedImageUrl } from "../../lib/productImage";

afterEach(cleanup);

describe("ImageWithSkeleton", () => {
  it("shows a truthful visible state for an unavailable CMS pack shot", () => {
    render(<ImageWithSkeleton src="https://example.com/media/123-pack-shot-pending.svg" alt="Gondola Fries" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("Gondola Fries")).toBeVisible();
    expect(screen.getByText("Product image unavailable")).toBeVisible();
  });

  it("preserves an editor's external image URL", () => {
    const src = "https://example.com/media/published-product.webp";
    render(<ImageWithSkeleton src={src} alt="Published product" />);
    const image = screen.getByRole("img", { name: "Published product" });
    expect(image).toHaveAttribute("src", src);
    expect(image).not.toHaveAttribute("srcset");
  });

  it("recovers from a failed optimized variant, then shows an unavailable state if the original fails", () => {
    const source = "/assets/Truffles/730585.png";
    render(<ImageWithSkeleton src={source} alt="Sliced Black Truffle" />);
    const image = screen.getByRole("img", { name: "Sliced Black Truffle" });
    expect(image).toHaveAttribute("src", getOptimizedImageUrl(source));
    expect(image).toHaveAttribute("srcset");
    fireEvent.error(image);
    expect(image).toHaveAttribute("src", source);
    expect(image).not.toHaveAttribute("srcset");
    fireEvent.error(image);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("Product image unavailable")).toBeVisible();
  });
});
