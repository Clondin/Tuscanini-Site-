import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import NewsletterSignup from "./NewsletterSignup";

describe("NewsletterSignup", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("does not present a fake subscription form without an endpoint", () => {
    render(<NewsletterSignup />);

    expect(screen.queryByRole("textbox", { name: /email address/i })).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Email signup is not available yet");
    expect(screen.getByRole("link", { name: /Tuscanini on Instagram/i })).toHaveAttribute(
      "href",
      "https://www.instagram.com/tuscaninifoods/",
    );
  });

  it("submits an email and announces success when an endpoint is configured", async () => {
    vi.stubEnv("VITE_NEWSLETTER_ENDPOINT", "https://newsletter.example/subscribe");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));
    const user = userEvent.setup();

    render(<NewsletterSignup />);
    await user.type(screen.getByRole("textbox", { name: /email address/i }), "reader@example.com");
    await user.click(screen.getByRole("button", { name: /subscribe/i }));

    expect(await screen.findByText(/Welcome to the Italian table/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://newsletter.example/subscribe",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "reader@example.com" }),
      }),
    );
  });
});
