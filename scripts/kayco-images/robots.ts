export const ROBOTS_PRODUCT_TOKEN = "TuscaniniSiteImageAudit";

export type RobotsDirective = "allow" | "disallow";

export interface RobotsRule {
  directive: RobotsDirective;
  pattern: string;
}

export interface RobotsGroup {
  userAgents: string[];
  rules: RobotsRule[];
}

export interface RobotsPolicy {
  groups: RobotsGroup[];
}

export interface RobotsPathDecision {
  allowed: boolean;
  path: string;
  matchedRule: RobotsRule | null;
}

type RobotsSource = RobotsPolicy | string;

const productTokenPattern = /^[A-Za-z_-]+$/;
const percentEncodedOctetPattern = /^%[0-9A-Fa-f]{2}/;
const regexSpecialPattern = /[\\^$.*+?()[\]{}|]/g;

function stripComment(line: string): string {
  const commentStart = line.indexOf("#");
  return (commentStart < 0 ? line : line.slice(0, commentStart)).trim();
}

function isProductToken(value: string): boolean {
  return value === "*" || productTokenPattern.test(value);
}

/** Parse the REP groups and rules that affect path access. Unsupported fields are ignored. */
export function parseRobotsTxt(text: string): RobotsPolicy {
  const groups: RobotsGroup[] = [];
  let currentGroup: RobotsGroup | null = null;
  let rulesStarted = false;

  const finishGroup = () => {
    if (currentGroup) groups.push(currentGroup);
    currentGroup = null;
    rulesStarted = false;
  };

  for (const rawLine of text.replace(/^\uFEFF/, "").split(/\r\n|\n|\r/)) {
    const line = stripComment(rawLine);
    if (!line) continue;

    const separator = line.indexOf(":");
    if (separator < 0) continue;

    const field = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();

    if (field === "user-agent") {
      if (!isProductToken(value)) continue;
      if (currentGroup && rulesStarted) finishGroup();
      currentGroup ??= { userAgents: [], rules: [] };
      currentGroup.userAgents.push(value);
      continue;
    }

    if (field !== "allow" && field !== "disallow") continue;
    if (!currentGroup) continue;

    // An empty rule has no access effect, but it still ends the user-agent
    // header portion of this group.
    rulesStarted = true;
    if (!value) continue;
    currentGroup.rules.push({ directive: field, pattern: value });
  }

  finishGroup();
  return { groups };
}

function validateProductToken(productToken: string): string {
  const token = productToken.trim();
  if (!productTokenPattern.test(token)) {
    throw new TypeError(`Invalid robots product token: ${productToken}`);
  }
  return token.toLowerCase();
}

/** Select and merge exact, case-insensitive product-token groups, or `*` as fallback. */
export function getApplicableRobotsRules(
  policy: RobotsPolicy,
  productToken = ROBOTS_PRODUCT_TOKEN,
): RobotsRule[] {
  const normalizedToken = validateProductToken(productToken);
  const exactGroups = policy.groups.filter(({ userAgents }) =>
    userAgents.some((userAgent) => userAgent.toLowerCase() === normalizedToken)
  );
  const applicableGroups = exactGroups.length > 0
    ? exactGroups
    : policy.groups.filter(({ userAgents }) => userAgents.includes("*"));

  return applicableGroups.flatMap(({ rules }) => rules);
}

function toExactPath(pathOrUrl: string): string {
  if (/^[A-Za-z][A-Za-z\d+.-]*:\/\//.test(pathOrUrl)) {
    const url = new URL(pathOrUrl);
    return `${url.pathname}${url.search}`;
  }

  if (!pathOrUrl.startsWith("/")) {
    throw new TypeError(`Robots path must start with "/": ${pathOrUrl}`);
  }

  const fragmentStart = pathOrUrl.indexOf("#");
  return fragmentStart < 0 ? pathOrUrl : pathOrUrl.slice(0, fragmentStart);
}

function canonicalizeLiteral(value: string, encodeRobotsSyntax: boolean): string {
  let canonical = "";

  for (let index = 0; index < value.length;) {
    const percentEncodedOctet = value.slice(index).match(percentEncodedOctetPattern)?.[0];
    if (percentEncodedOctet) {
      const octet = Number.parseInt(percentEncodedOctet.slice(1), 16);
      const character = String.fromCharCode(octet);
      canonical += /[A-Za-z\d._~-]/.test(character)
        ? character
        : percentEncodedOctet.toUpperCase();
      index += percentEncodedOctet.length;
      continue;
    }

    const codePoint = value.codePointAt(index);
    if (codePoint === undefined) break;
    const character = String.fromCodePoint(codePoint);
    if (encodeRobotsSyntax && character === "*") canonical += "%2A";
    else if (encodeRobotsSyntax && character === "$") canonical += "%24";
    else if (codePoint > 0x7f) {
      canonical += Array.from(new TextEncoder().encode(character), (octet) =>
        `%${octet.toString(16).toUpperCase().padStart(2, "0")}`
      ).join("");
    } else canonical += character;
    index += character.length;
  }

  return canonical;
}

function escapeRegex(value: string): string {
  return value.replace(regexSpecialPattern, "\\$&");
}

function compileRulePattern(pattern: string): RegExp {
  const anchored = pattern.endsWith("$");
  const body = anchored ? pattern.slice(0, -1) : pattern;
  const source = body
    .split(/\*+/)
    .map((part) => escapeRegex(canonicalizeLiteral(part, true)))
    .join(".*");
  return new RegExp(`^${source}${anchored ? "$" : ""}`);
}

function ruleSpecificity(pattern: string): number {
  const canonical = canonicalizeLiteral(pattern, false);
  let octets = 0;
  for (let index = 0; index < canonical.length;) {
    const percentEncodedOctet = canonical.slice(index).match(percentEncodedOctetPattern)?.[0];
    index += percentEncodedOctet?.length ?? 1;
    octets += 1;
  }
  return octets;
}

function asPolicy(source: RobotsSource): RobotsPolicy {
  return typeof source === "string" ? parseRobotsTxt(source) : source;
}

/** Evaluate one exact discovered path (including its query string, when present). */
export function evaluateRobotsPath(
  source: RobotsSource,
  pathOrUrl: string,
  productToken = ROBOTS_PRODUCT_TOKEN,
): RobotsPathDecision {
  const path = toExactPath(pathOrUrl);
  const canonicalPath = canonicalizeLiteral(path, true);
  let matchedRule: RobotsRule | null = null;
  let matchedSpecificity = -1;

  for (const rule of getApplicableRobotsRules(asPolicy(source), productToken)) {
    if (!compileRulePattern(rule.pattern).test(canonicalPath)) continue;
    const specificity = ruleSpecificity(rule.pattern);
    if (
      specificity > matchedSpecificity ||
      (specificity === matchedSpecificity && rule.directive === "allow")
    ) {
      matchedRule = rule;
      matchedSpecificity = specificity;
    }
  }

  return {
    allowed: matchedRule?.directive !== "disallow",
    path,
    matchedRule,
  };
}

export function isRobotsPathAllowed(
  source: RobotsSource,
  pathOrUrl: string,
  productToken = ROBOTS_PRODUCT_TOKEN,
): boolean {
  return evaluateRobotsPath(source, pathOrUrl, productToken).allowed;
}

/** Return the first denied exact path so callers can report the real blocked resource. */
export function findFirstDisallowedRobotsPath(
  source: RobotsSource,
  pathsOrUrls: readonly string[],
  productToken = ROBOTS_PRODUCT_TOKEN,
): RobotsPathDecision | null {
  const policy = asPolicy(source);
  for (const pathOrUrl of pathsOrUrls) {
    const decision = evaluateRobotsPath(policy, pathOrUrl, productToken);
    if (!decision.allowed) return decision;
  }
  return null;
}
