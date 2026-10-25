/**
 * First-party click counter for Amazon links. One delegated listener records every
 * click on an amazon.com link with navigator.sendBeacon (fire-and-forget), so the
 * link itself navigates exactly as before: nothing is awaited and nothing is prevented.
 * Links describe themselves with data-aff-placement / data-aff-kind / data-aff-slug.
 */
const ENDPOINT = "/api/click";

function isAmazonHost(href: string): boolean {
  try {
    const host = new URL(href, window.location.href).hostname;
    return host === "amazon.com" || host.endsWith(".amazon.com");
  } catch {
    return false;
  }
}

function inferKind(href: string): string {
  if (href.includes("/dp/")) return "dp";
  if (href.includes("/s?")) return "search";
  if (href.includes("/cart/add")) return "cart";
  if (href.includes("/stores/")) return "store";
  return "other";
}

function send(payload: string) {
  try {
    if (navigator.sendBeacon?.(ENDPOINT, new Blob([payload], { type: "application/json" }))) return;
  } catch {
    // fall through to fetch
  }
  try {
    void fetch(ENDPOINT, {
      method: "POST",
      body: payload,
      keepalive: true,
      headers: { "content-type": "application/json" },
    }).catch(() => undefined);
  } catch {
    // Counting is best effort; the visitor's click always wins.
  }
}

function onClick(event: MouseEvent) {
  if (event.type === "auxclick" && event.button !== 1) return;
  const target = event.target;
  if (!(target instanceof Element)) return;
  const link = target.closest("a[href]");
  if (!(link instanceof HTMLAnchorElement) || !isAmazonHost(link.href)) return;
  send(
    JSON.stringify({
      placement: link.dataset.affPlacement || "other",
      kind: link.dataset.affKind || inferKind(link.href),
      slug: link.dataset.affSlug || "",
      path: window.location.pathname,
      ts: new Date().toISOString(),
    }),
  );
}

let installed = false;

export function installAffiliateClickTracking(): void {
  if (installed || typeof document === "undefined") return;
  installed = true;
  document.addEventListener("click", onClick, { capture: true, passive: true });
  document.addEventListener("auxclick", onClick, { capture: true, passive: true });
}
