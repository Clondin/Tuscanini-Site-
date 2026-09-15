import { describe, expect, it } from "vitest";
import {
  evaluateRobotsPath,
  findFirstDisallowedRobotsPath,
  getApplicableRobotsRules,
  isRobotsPathAllowed,
  parseRobotsTxt,
} from "./robots";

describe("Kayco robots policy", () => {
  it("parses consecutive product tokens as one group without letting ignored fields split it", () => {
    const policy = parseRobotsTxt(`
      User-agent: OtherBot
      Sitemap: https://example.test/sitemap.xml
      User-agent: TuscaniniSiteImageAudit
      Disallow: /private # explanation

      User-agent: FinalBot
    `);

    expect(policy.groups).toEqual([
      {
        userAgents: ["OtherBot", "TuscaniniSiteImageAudit"],
        rules: [{ directive: "disallow", pattern: "/private" }],
      },
      { userAgents: ["FinalBot"], rules: [] },
    ]);
  });

  it("matches the product token exactly and case-insensitively, then merges repeated groups", () => {
    const policy = parseRobotsTxt(`
      User-agent: TuscaniniSiteImage
      Disallow: /partial-token-must-not-apply
      User-agent: TUSCANINISITEIMAGEAUDIT
      Disallow: /first
      User-agent: *
      Disallow: /wildcard-fallback-must-not-apply
      User-agent: TuscaniniSiteImageAudit
      Disallow: /second
    `);

    expect(getApplicableRobotsRules(policy)).toEqual([
      { directive: "disallow", pattern: "/first" },
      { directive: "disallow", pattern: "/second" },
    ]);
  });

  it("uses all wildcard groups only when no exact product-token group exists", () => {
    const policy = parseRobotsTxt(`
      User-agent: *
      Disallow: /one
      User-agent: OtherBot
      Disallow: /
      User-agent: *
      Disallow: /two
    `);

    expect(getApplicableRobotsRules(policy, "UnlistedBot")).toEqual([
      { directive: "disallow", pattern: "/one" },
      { directive: "disallow", pattern: "/two" },
    ]);
  });

  it("uses the longest matching rule and lets Allow win an equal-specificity conflict", () => {
    const policy = `
      User-agent: TuscaniniSiteImageAudit
      Disallow: /
      Allow: /wp-json/wp/v2/product
      Disallow: /wp-json/wp/v2/product/private
      Allow: /same
      Disallow: /same
    `;

    expect(isRobotsPathAllowed(policy, "/wp-json/wp/v2/product?brand=12")).toBe(true);
    expect(isRobotsPathAllowed(policy, "/wp-json/wp/v2/product/private/7")).toBe(false);
    expect(evaluateRobotsPath(policy, "/same").matchedRule).toEqual({
      directive: "allow",
      pattern: "/same",
    });
  });

  it("supports wildcard and end-anchor precedence", () => {
    const htmlPolicy = `
      User-agent: TuscaniniSiteImageAudit
      Allow: /page
      Disallow: /*.htm
    `;
    const equalPolicy = `
      User-agent: TuscaniniSiteImageAudit
      Allow: /page
      Disallow: /*.ph
    `;
    const anchoredPolicy = `
      User-agent: TuscaniniSiteImageAudit
      Disallow: /*.jpg$
    `;

    expect(isRobotsPathAllowed(htmlPolicy, "/page.htm")).toBe(false);
    expect(isRobotsPathAllowed(equalPolicy, "/page.php5")).toBe(true);
    expect(isRobotsPathAllowed(anchoredPolicy, "/uploads/product.jpg")).toBe(false);
    expect(isRobotsPathAllowed(anchoredPolicy, "/uploads/product.jpg?size=full")).toBe(true);
  });

  it("ignores empty rules and preserves case-sensitive path matching", () => {
    const policy = `
      User-agent: TuscaniniSiteImageAudit
      Disallow:
      Disallow: /Private
    `;

    expect(isRobotsPathAllowed(policy, "/anything")).toBe(true);
    expect(isRobotsPathAllowed(policy, "/Private/image.png")).toBe(false);
    expect(isRobotsPathAllowed(policy, "/private/image.png")).toBe(true);
  });

  it("reports the exact first denied discovered path and its winning rule", () => {
    const decision = findFirstDisallowedRobotsPath(
      `
        User-agent: TuscaniniSiteImageAudit
        Disallow: /wp-content/uploads/private/
      `,
      [
        "/wp-json/wp/v2/product/491?context=view",
        "https://www.kayco.com/wp-content/uploads/private/package.png?ver=2#preview",
      ],
    );

    expect(decision).toEqual({
      allowed: false,
      path: "/wp-content/uploads/private/package.png?ver=2",
      matchedRule: {
        directive: "disallow",
        pattern: "/wp-content/uploads/private/",
      },
    });
  });

  it("normalizes percent-encoded unreserved octets and literal wildcard characters", () => {
    const policy = `
      User-agent: TuscaniniSiteImageAudit
      Disallow: /products/olive-oil
      Disallow: /uploads/file-%2A.png$
    `;

    expect(isRobotsPathAllowed(policy, "/products/olive-%6Fil")).toBe(false);
    expect(isRobotsPathAllowed(policy, "/uploads/file-*.png")).toBe(false);
    expect(isRobotsPathAllowed(policy, "/uploads/file-other.png")).toBe(true);
  });
});
