/** Builds a collision-free, case-insensitive storage key for account-scoped data. */
export function getAccountStorageKey(email: string, suffix: string): string {
  const normalized = encodeURIComponent(email.trim().toLowerCase());
  return `${suffix}_${normalized}`;
}

/** Pre-fix (lossy, non-injective) key format kept only for one-time migration. */
export function getLegacyAccountStorageKey(
  email: string,
  suffix: string,
): string {
  const sanitized = email.replace(/[^a-zA-Z0-9]/g, "_");
  return `${suffix}_${sanitized}`;
}

/** Creates a plus-addressed alias (user+tag@domain), or null if the base email is malformed. */
export function generateAlias(baseEmail: string, tag: string): string | null {
  const parts = baseEmail.trim().split("@");
  if (parts.length !== 2) return null;

  const [username, domain] = parts;
  if (!username || !domain) return null;
  return `${username}+${tag}@${domain}`;
}

export type RandomFormat =
  | "private-mail"
  | "alphanumeric"
  | "words"
  | "timestamp";

/** Generates a random alias tag in the given format; `index` de-duplicates timestamp batches. */
export function generateRandomString(format: RandomFormat, index = 0): string {
  if (format === "private-mail") {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `private-mail-${result}`;
  }

  if (format === "timestamp") {
    return (Date.now() + index).toString(36);
  }

  if (format === "words") {
    const adjectives = [
      "happy",
      "sunny",
      "calm",
      "bright",
      "swift",
      "brave",
      "cool",
      "smart",
      "quick",
      "zen",
      "wild",
      "free",
      "bold",
      "wise",
      "pure",
      "kind",
      "fair",
      "true",
      "rare",
      "fine",
    ];
    const nouns = [
      "fox",
      "bird",
      "bear",
      "wolf",
      "deer",
      "lion",
      "hawk",
      "eagle",
      "tiger",
      "panda",
      "seal",
      "otter",
      "raven",
      "crane",
      "swan",
      "lynx",
      "coral",
      "pearl",
      "jade",
      "ruby",
    ];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 999);
    return `${adj}-${noun}-${num}`;
  }

  // alphanumeric
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

type ValidationResult = {
  isValid: boolean;
  error?: string;
  warning?: string;
};

/** Validates an email address; non-Gmail domains pass with a warning. */
export function validateEmail(value: string): ValidationResult {
  const email = value.trim();
  if (!email) return { isValid: false, error: "Email is required" };
  if (!email.includes("@"))
    return { isValid: false, error: "Please enter a valid email address" };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return { isValid: false, error: "Invalid email format" };

  const [username, domain] = email.split("@");
  if (username.length < 1)
    return { isValid: false, error: "Username cannot be empty" };
  if (!domain.includes("."))
    return {
      isValid: false,
      error: "Domain must include a dot (e.g., gmail.com)",
    };

  const normalizedDomain = domain.toLowerCase();
  const isGmail =
    normalizedDomain === "gmail.com" || normalizedDomain === "googlemail.com";

  if (!isGmail) {
    return { isValid: true, warning: "⚠️ Works best with Gmail addresses" };
  }

  return { isValid: true };
}

/** Generates Gmail dot-placement variations of a username, exhaustive or randomized. */
export function generateDotVariations(
  username: string,
  count = 10,
  randomize = false,
): string[] {
  if (username.length < 2) return [];

  const variations: string[] = [];

  if (randomize) {
    for (let i = 0; i < count; i++) {
      const chars = username.split("");
      const maxDots = Math.min(3, chars.length - 1);
      const numDots = Math.floor(Math.random() * maxDots) + 1;
      const positions = new Set<number>();

      while (positions.size < numDots) {
        const pos = Math.floor(Math.random() * (chars.length - 1)) + 1;
        positions.add(pos);
      }

      const sortedPositions = Array.from(positions).sort((a, b) => a - b);
      let result = "";
      let lastPos = 0;
      sortedPositions.forEach((pos) => {
        result += `${chars.slice(lastPos, pos).join("")}.`;
        lastPos = pos;
      });
      result += chars.slice(lastPos).join("");
      variations.push(result);
    }
  } else {
    const len = username.length;
    for (let i = 1; i < len; i++) {
      variations.push(`${username.slice(0, i)}.${username.slice(i)}`);
    }

    if (username.length >= 4) {
      for (let i = 1; i < len - 1; i++) {
        for (let j = i + 1; j < len; j++) {
          variations.push(
            `${username.slice(0, i)}.${username.slice(i, j)}.${username.slice(j)}`,
          );
        }
      }
    }
  }

  return [...new Set(variations)].slice(0, count);
}

/** Returns dot variations, or the original username when dots cannot be inserted. */
export function getDotVariationCandidates(
  username: string,
  count = 10,
  randomize = false,
): string[] {
  const variations = generateDotVariations(username, count, randomize);
  return variations.length > 0 ? variations : [username];
}

/** Filters and sorts aliases by view mode, search query, tag, and sort order. */
export function filterAliases(
  aliases: Array<{ email: string; timestamp: number }>,
  opts: {
    viewMode: "all" | "favorites";
    favorites: string[];
    searchQuery: string;
    filterTag: string;
    sortBy: "recent" | "alphabetical";
  },
): Array<{ email: string; timestamp: number }> {
  return aliases
    .filter((alias) => {
      if (
        opts.viewMode === "favorites" &&
        !opts.favorites.includes(alias.email)
      )
        return false;
      if (
        opts.searchQuery &&
        !alias.email
          .toLowerCase()
          .includes(opts.searchQuery.trim().toLowerCase())
      )
        return false;
      if (opts.filterTag !== "all") {
        const tagMatch = alias.email.match(/\+([^@]+)@/);
        const emailTag = tagMatch ? tagMatch[1] : null;
        if (emailTag !== opts.filterTag) return false;
      }
      return true;
    })
    .sort((a, b) =>
      opts.sortBy === "recent"
        ? b.timestamp - a.timestamp
        : a.email.localeCompare(b.email),
    );
}

/** Extracts the unique plus-addressing tags used by a history collection. */
export function getAliasTags(
  aliases: Array<{ email: string }>,
): string[] {
  return [
    ...new Set(
      aliases
        .map((alias) => alias.email.match(/\+([^@]+)@/)?.[1])
        .filter((tag): tag is string => Boolean(tag)),
    ),
  ];
}

/** Returns a safe page slice and its normalized pagination metadata. */
export function paginateItems<T>(
  items: T[],
  requestedPage: number,
  itemsPerPage: number,
) {
  const safeItemsPerPage = Math.max(1, itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(items.length / safeItemsPerPage));
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
  const startIndex = (currentPage - 1) * safeItemsPerPage;
  const endIndex = startIndex + safeItemsPerPage;

  return {
    items: items.slice(startIndex, endIndex),
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalItems: items.length,
  };
}
