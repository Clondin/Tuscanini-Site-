// Amazon link click counter (fed by navigator.sendBeacon from src/lib/affiliateClicks.ts).
// Each click is forwarded to the click store and answered 204 at once; read the totals at
// https://tuscanini-clicks.sites.tab.bot/stats?key=<private key>.
const SINK = "https://tuscanini-clicks.sites.tab.bot/hit";

function clip(value: unknown, max: number): string {
  return typeof value === "string" ? value.slice(0, max) : "";
}

export async function POST(request: Request): Promise<Response> {
  let body: Record<string, unknown> = {};
  try {
    const text = await request.text();
    if (text.length <= 2048) body = JSON.parse(text) as Record<string, unknown>;
  } catch {
    body = {};
  }
  if (body && typeof body === "object" && body.placement) {
    const userAgent = request.headers.get("user-agent") || "";
    const record = {
      placement: clip(body.placement, 32),
      kind: clip(body.kind, 16),
      slug: clip(body.slug, 120),
      path: clip(body.path, 200),
      ts: clip(body.ts, 40),
      country: clip(request.headers.get("x-vercel-ip-country"), 8),
      host: clip(request.headers.get("host"), 80),
      bot: /bot|crawl|spider|headless|preview|lighthouse/i.test(userAgent) ? 1 : 0,
    };
    try {
      await fetch(SINK, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(record),
        signal: AbortSignal.timeout(4000),
      });
    } catch {
      // A missed count never affects the visitor.
    }
  }
  return new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
}
