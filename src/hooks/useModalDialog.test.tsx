import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useModalDialog } from "./useModalDialog";

function ModalHarness({ initialFocus = true }: { initialFocus?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useModalDialog<HTMLDivElement>({
    isOpen,
    onClose: () => setIsOpen(false),
    initialFocusRef: initialFocus ? inputRef : undefined,
    inertAppRoot: true,
  });

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>Open dialog</button>
      {isOpen && createPortal(
        <div ref={dialogRef} role="dialog" aria-label="Test dialog" tabIndex={-1}>
          {initialFocus && <input ref={inputRef} aria-label="Modal query" />}
          <button type="button" onClick={() => setIsOpen(false)}>Close dialog</button>
        </div>,
        document.body,
      )}
    </>
  );
}

describe("useModalDialog", () => {
  afterEach(() => {
    cleanup();
    document.getElementById("root")?.remove();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it.each([
    { initialFocus: true, name: "the preferred field" },
    { initialFocus: false, name: "the first control" },
  ])("focuses $name before hiding the background and restores focus on Escape", ({ initialFocus }) => {
    vi.useFakeTimers();
    const root = document.createElement("div");
    root.id = "root";
    root.inert = false;
    root.setAttribute("aria-hidden", "false");
    document.body.append(root);
    const previousOverflow = document.body.style.overflow;
    const focusWhenHidden: Element[] = [];
    const setAttribute = root.setAttribute.bind(root);
    vi.spyOn(root, "setAttribute").mockImplementation((name, value) => {
      if (name === "aria-hidden" && value === "true" && document.activeElement) {
        focusWhenHidden.push(document.activeElement);
      }
      setAttribute(name, value);
    });

    render(<ModalHarness initialFocus={initialFocus} />, { container: root });
    const trigger = screen.getByRole("button", { name: "Open dialog" });
    trigger.focus();
    fireEvent.click(trigger);
    const initialTarget = initialFocus
      ? screen.getByRole("textbox", { name: "Modal query" })
      : screen.getByRole("button", { name: "Close dialog" });
    act(() => vi.runAllTimers());

    expect(initialTarget).toHaveFocus();
    expect(focusWhenHidden).toEqual([initialTarget]);
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root.inert).toBe(true);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(trigger).toHaveFocus();
    expect(root).toHaveAttribute("aria-hidden", "false");
    expect(root.inert).toBe(false);
    expect(document.body.style.overflow).toBe(previousOverflow);
  });
});
