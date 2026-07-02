import { useState } from "react";
import { generateDotVariations } from "../utils";

interface GmailTricksProps {
  baseEmail: string;
  onCopy: (email: string) => void;
}

/** Panel that generates Gmail trick variations (dots, plus tags, googlemail, combos) for the base email. */
export default function GmailTricks({ baseEmail, onCopy }: GmailTricksProps) {
  const [selectedTrick, setSelectedTrick] = useState<
    "dot" | "googlemail" | "nodots" | "combo" | "plus" | "dotplus"
  >("dot");
  const [tricksCount, setTricksCount] = useState(10);
  const [generatedTricks, setGeneratedTricks] = useState<string[]>([]);
  const [randomizeDots, setRandomizeDots] = useState(false);

  /** Returns dot variations, falling back to the original username when dots are impossible. */
  const getDotUsernames = (username: string, count: number): string[] => {
    const dotUsernames = generateDotVariations(username, count, randomizeDots);
    return dotUsernames.length > 0 ? dotUsernames : [username];
  };

  /** Combines dot variations with common plus tags, capped at `count` results. */
  const generateCombinations = (count = 10): string[] => {
    if (!baseEmail.includes("@")) return [];

    const [username, domain] = baseEmail.split("@");
    const normalizedDomain = domain.toLowerCase();
    const isGmail =
      normalizedDomain === "gmail.com" || normalizedDomain === "googlemail.com";
    if (!isGmail) return [];

    const combinations: string[] = [];
    const dotVariations = getDotUsernames(username, count);

    // Dot + common tags
    const commonTags = [
      "newsletter",
      "shop",
      "spam",
      "work",
      "personal",
      "test",
      "promo",
      "social",
      "finance",
      "travel",
    ];
    dotVariations.forEach((dotUser) => {
      commonTags.forEach((tag) => {
        combinations.push(`${dotUser}+${tag}@${domain}`);
      });
    });

    return combinations.slice(0, count);
  };

  /** Generates plus-tag aliases from a list of common tags, capped at `count` results. */
  const generatePlusVariations = (count = 10): string[] => {
    if (!baseEmail.includes("@")) return [];

    const [username, domain] = baseEmail.split("@");
    const tags = [
      "newsletter",
      "shop",
      "spam",
      "work",
      "personal",
      "test",
      "promo",
      "social",
      "finance",
      "travel",
      "amazon",
      "ebay",
      "facebook",
      "twitter",
      "linkedin",
      "github",
      "google",
      "microsoft",
      "apple",
      "samsung",
      "newsletter1",
      "newsletter2",
      "deals",
      "offers",
      "alerts",
      "updates",
      "notifications",
      "receipts",
      "invoices",
      "subscriptions",
    ];

    return tags.slice(0, count).map((tag) => `${username}+${tag}@${domain}`);
  };

  /** Combines dot variations with plus tags, capped at `count` results. */
  const generateDotPlusVariations = (count = 10): string[] => {
    if (!baseEmail.includes("@")) return [];

    const [username, domain] = baseEmail.split("@");
    const dotVars = getDotUsernames(
      username,
      Math.ceil(count / 3),
    );
    const tags = [
      "shop",
      "work",
      "test",
      "spam",
      "newsletter",
      "promo",
      "social",
      "finance",
    ];
    const results: string[] = [];

    dotVars.forEach((dotUser) => {
      tags.forEach((tag) => {
        results.push(`${dotUser}+${tag}@${domain}`);
      });
    });

    return results.slice(0, count);
  };

  /** Generates variations for the currently selected trick and copies the first result. */
  const generateTricksVariations = () => {
    if (!baseEmail.includes("@")) return;

    // Clear previous results first to force re-render
    setGeneratedTricks([]);

    const [username, domain] = baseEmail.split("@");
    let results: string[] = [];

    switch (selectedTrick) {
      case "dot":
        results = getDotUsernames(username, tricksCount).map(
          (u) => `${u}@${domain}`,
        );
        break;
      case "googlemail": {
        const altDomain =
          domain.toLowerCase() === "gmail.com" ? "googlemail.com" : "gmail.com";
        results = getDotUsernames(username, tricksCount).map(
          (u) => `${u}@${altDomain}`,
        );
        break;
      }
      case "nodots": {
        const noDots = username.replace(/\./g, "");
        const noDotResults = [
          `${noDots}@${domain}`,
          `${noDots}@${domain === "gmail.com" ? "googlemail.com" : "gmail.com"}`,
        ];
        // Generate with plus tags too
        const tags = [
          "work",
          "shop",
          "test",
          "spam",
          "newsletter",
          "promo",
          "social",
          "finance",
        ];
        tags.forEach((tag) => {
          noDotResults.push(`${noDots}+${tag}@${domain}`);
        });
        results = noDotResults.slice(0, tricksCount);
        break;
      }
      case "plus":
        results = generatePlusVariations(tricksCount);
        break;
      case "dotplus":
        results = generateDotPlusVariations(tricksCount);
        break;
      case "combo":
        results = generateCombinations(tricksCount);
        break;
      default:
        break;
    }

    // Use setTimeout to ensure state update triggers re-render
    setTimeout(() => {
      setGeneratedTricks(results);
      if (results.length > 0) {
        onCopy(results[0]);
      }
    }, 0);
  };

  // skipcq: JS-0415
  return (
    // skipcq: JS-0415
    <div>
      {/* Trick Type Selector */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <button
          onClick={() => setSelectedTrick("dot")}
          className={`p-2.5 rounded-lg border-2 transition-all text-xs font-medium ${
            selectedTrick === "dot"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"
              : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700"
          }`}
        >
          Dot Trick
        </button>
        <button
          onClick={() => setSelectedTrick("plus")}
          className={`p-2.5 rounded-lg border-2 transition-all text-xs font-medium ${
            selectedTrick === "plus"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"
              : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700"
          }`}
        >
          Plus (+) Tags
        </button>
        <button
          onClick={() => setSelectedTrick("googlemail")}
          className={`p-2.5 rounded-lg border-2 transition-all text-xs font-medium ${
            selectedTrick === "googlemail"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"
              : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700"
          }`}
        >
          Googlemail
        </button>
        <button
          onClick={() => setSelectedTrick("nodots")}
          className={`p-2.5 rounded-lg border-2 transition-all text-xs font-medium ${
            selectedTrick === "nodots"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"
              : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700"
          }`}
        >
          Remove Dots
        </button>
        <button
          onClick={() => setSelectedTrick("dotplus")}
          className={`p-2.5 rounded-lg border-2 transition-all text-xs font-medium ${
            selectedTrick === "dotplus"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"
              : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700"
          }`}
        >
          Dot + Plus
        </button>
        <button
          onClick={() => setSelectedTrick("combo")}
          className={`p-2.5 rounded-lg border-2 transition-all text-xs font-medium ${
            selectedTrick === "combo"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"
              : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700"
          }`}
        >
          All Combos
        </button>
      </div>

      {/* Options */}
      <div className="mb-3 space-y-2">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Number of variations
          </label>
          <input
            type="number"
            min="1"
            value={tricksCount}
            onChange={(e) =>
              setTricksCount(Math.max(1, parseInt(e.target.value) || 10))
            }
            className="w-20 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Random Dots Toggle - only show for dot-related tricks */}
        {(selectedTrick === "dot" ||
          selectedTrick === "googlemail" ||
          selectedTrick === "dotplus" ||
          selectedTrick === "combo") && (
          <div className="flex items-center gap-2 p-2.5 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-900/60">
            <input
              type="checkbox"
              id="randomizeDots"
              checked={randomizeDots}
              onChange={(e) => setRandomizeDots(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="randomizeDots"
              className="text-sm font-medium text-blue-700 dark:text-blue-400 cursor-pointer"
            >
              🎲 Randomize dot positions
            </label>
            <span className="ml-auto text-xs text-blue-600 dark:text-blue-400">
              {randomizeDots ? "Random" : "Sequential"}
            </span>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <button
        onClick={generateTricksVariations}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors mb-3"
      >
        <div className="flex items-center justify-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Generate Tricks
        </div>
      </button>

      {/* Generated Tricks List */}
      {generatedTricks.length > 0 && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-900 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Generated Variations
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {generatedTricks.length} total
              </span>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {generatedTricks.map((email) => (
              <div
                key={email}
                className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex-1 font-mono text-xs text-gray-900 dark:text-gray-100 truncate">
                  {email}
                </div>
                <button
                  onClick={() => onCopy(email)}
                  className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors flex-shrink-0"
                  title="Copy"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg">
        <div className="flex gap-2">
          <svg
            className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-[10px] text-blue-800 dark:text-blue-300">
            <strong>Gmail trick:</strong> Dots are ignored & everything after +
            goes to same inbox
          </p>
        </div>
      </div>
    </div>
  );
}
