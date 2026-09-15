import { describe, expect, it } from "vitest";
import {
  buildImageAuditReport,
  renderImageAuditCsv,
  renderImageAuditHtml,
  type NormalizedImageAudit,
} from "./report";

const audit: NormalizedImageAudit = {
  generatedAt: "2026-08-11T18:00:00.000Z",
  records: [{
    cms: {
      id: "olive-oil",
      slug: "olive-oil",
      title: "Olive Oil",
      sku: "730400",
      image: { url: "https://cms.example/current.png?token=secret", width: 800, height: 1200 },
    },
    candidate: {
      id: "1",
      title: "Olive Oil 750ml",
      sku: "730400",
      pageUrl: "https://www.kayco.com/product/olive-oil/",
      image: { url: "https://www.kayco.com/wp-content/uploads/730400.png", width: 800, height: 1200 },
    },
    alternatives: [{
      id: "2",
      title: "Olive Oil 1L",
      sku: "730401",
      pageUrl: "https://www.kayco.com/product/olive-oil-1l/?token=secret",
      image: { url: "https://www.kayco.com/wp-content/uploads/730401.png", width: 900, height: 1300 },
    }],
    match: {
      status: "ambiguous",
      method: "sku",
      confidence: 1,
      warnings: ["Conflicting package variants"],
    },
  }],
};

describe("Kayco image audit report", () => {
  it("retains sanitized alternatives for manual review", () => {
    const report = buildImageAuditReport(audit);
    expect(report.records[0].alternatives).toHaveLength(1);
    expect(report.records[0].alternatives?.[0].pageUrl).toBe(
      "https://www.kayco.com/product/olive-oil-1l/",
    );
    expect(report.records[0].cms.image.url).toBe("https://cms.example/current.png");
  });

  it("includes alternative candidates in CSV and HTML outputs", () => {
    expect(renderImageAuditCsv(audit)).toContain('"alternative_count","alternatives"');
    expect(renderImageAuditCsv(audit)).toContain("Olive Oil 1L");
    const html = renderImageAuditHtml(audit);
    expect(html).toContain("Other candidates");
    expect(html).toContain("Olive Oil 1L");
    expect(html).not.toContain("token=secret");
  });
});
