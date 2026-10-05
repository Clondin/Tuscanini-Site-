import { describe, expect, it } from "vitest";
import { formatProductSize } from "./formatProductSize";

describe("formatProductSize", () => {
  it.each([
    ["5 LB", "5 lb"],
    ["2.27 KG (5 LB)", "2.27 kg (5 lb)"],
    ["250ml", "250 mL"],
    ["16.9 oz (500ml)", "16.9 oz (500 mL)"],
    ["16.9 fl oz (0.5L)", "16.9 fl oz (0.5 L)"],
    ["1 pt", "1 pt"],
    ["3 x 2.82 oz", "3 × 2.82 oz"],
    ["Available in 9.3 fl oz and 25.3 fl oz", "9.3 fl oz / 25.3 fl oz"],
  ])("formats %s without changing the stated amounts", (input, expected) => {
    expect(formatProductSize(input)).toBe(expected);
  });

  it("retains unknown catalogue descriptions and does not invent missing sizes", () => {
    expect(formatProductSize("Available in jars and gift boxes")).toBe("Available in jars and gift boxes");
    expect(formatProductSize("Family pack")).toBe("Family pack");
    expect(formatProductSize(undefined)).toBe("");
  });
});
