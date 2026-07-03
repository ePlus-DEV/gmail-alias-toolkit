import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { Checkbox } from "src/components/motion/checkbox";
import { getDotVariationCandidates } from "../utils";

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

  /** Combines dot variations with common plus tags, capped at `count` results. */
  const generateCombinations = (count = 10): string[] => {
    if (!baseEmail.includes("@")) return [];

    const [username, domain] = baseEmail.split("@");
    const normalizedDomain = domain.toLowerCase();
    const isGmail =
      normalizedDomain === "gmail.com" || normalizedDomain === "googlemail.com";
    if (!isGmail) return [];

    const combinations: string[] = [];
    const dotVariations = getDotVariationCandidates(
      username,
      count,
      randomizeDots,
    );

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
    const dotVars = getDotVariationCandidates(
      username,
      Math.ceil(count / 3),
      randomizeDots,
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
        results = getDotVariationCandidates(
          username,
          tricksCount,
          randomizeDots,
        ).map((u) => `${u}@${domain}`);
        break;
      case "googlemail": {
        const altDomain =
          domain.toLowerCase() === "gmail.com" ? "googlemail.com" : "gmail.com";
        results = getDotVariationCandidates(
          username,
          tricksCount,
          randomizeDots,
        ).map((u) => `${u}@${altDomain}`);
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
        <Button
          onClick={() => setSelectedTrick("dot")}
          variant="outline"
          className={`p-2.5 rounded-lg border-2 transition-all text-xs font-medium ${
            selectedTrick === "dot"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-primary/50"
          }`}
        >
          Dot Trick
        </Button>
        <Button
          onClick={() => setSelectedTrick("plus")}
          variant="outline"
          className={`p-2.5 rounded-lg border-2 transition-all text-xs font-medium ${
            selectedTrick === "plus"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-primary/50"
          }`}
        >
          Plus (+) Tags
        </Button>
        <Button
          onClick={() => setSelectedTrick("googlemail")}
          variant="outline"
          className={`p-2.5 rounded-lg border-2 transition-all text-xs font-medium ${
            selectedTrick === "googlemail"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-primary/50"
          }`}
        >
          Googlemail
        </Button>
        <Button
          onClick={() => setSelectedTrick("nodots")}
          variant="outline"
          className={`p-2.5 rounded-lg border-2 transition-all text-xs font-medium ${
            selectedTrick === "nodots"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-primary/50"
          }`}
        >
          Remove Dots
        </Button>
        <Button
          onClick={() => setSelectedTrick("dotplus")}
          variant="outline"
          className={`p-2.5 rounded-lg border-2 transition-all text-xs font-medium ${
            selectedTrick === "dotplus"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-primary/50"
          }`}
        >
          Dot + Plus
        </Button>
        <Button
          onClick={() => setSelectedTrick("combo")}
          variant="outline"
          className={`p-2.5 rounded-lg border-2 transition-all text-xs font-medium ${
            selectedTrick === "combo"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-primary/50"
          }`}
        >
          All Combos
        </Button>
      </div>

      {/* Options */}
      <div className="mb-3 space-y-2">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-foreground">
            Number of variations
          </label>
          <Input
            type="number"
            min="1"
            value={String(tricksCount)}
            onChange={(value) =>
              setTricksCount(Math.max(1, parseInt(value) || 10))
            }
            className="w-20"
          />
        </div>

        {/* Random Dots Toggle - only show for dot-related tricks */}
        {(selectedTrick === "dot" ||
          selectedTrick === "googlemail" ||
          selectedTrick === "dotplus" ||
          selectedTrick === "combo") && (
          <div className="flex items-center gap-2 p-2.5 bg-primary/10 rounded-lg border border-primary/30">
            <Checkbox
              id="randomizeDots"
              checked={randomizeDots}
              onCheckedChange={setRandomizeDots}
            />
            <label
              htmlFor="randomizeDots"
              className="text-sm font-medium text-primary cursor-pointer"
            >
              🎲 Randomize dot positions
            </label>
            <span className="ml-auto text-xs text-primary">
              {randomizeDots ? "Random" : "Sequential"}
            </span>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <Button
        onClick={generateTricksVariations}
        ripple
        className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-colors mb-3"
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
      </Button>

      {/* Generated Tricks List */}
      {generatedTricks.length > 0 && (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/40 px-3 py-2 border-b border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                Generated Variations
              </span>
              <span className="text-xs text-muted-foreground">
                {generatedTricks.length} total
              </span>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {generatedTricks.map((email) => (
              <div
                key={email}
                className="flex items-center gap-2 px-3 py-2.5 border-b border-border dark:border-border last:border-b-0 hover:bg-muted/40 dark:hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 font-mono text-xs text-foreground truncate">
                  {email}
                </div>
                <Button
                  onClick={() => onCopy(email)}
                  variant="ghost"
                  size="icon"
                  className="p-1.5 text-primary hover:bg-primary/15 rounded transition-colors flex-shrink-0"
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
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-3 p-2 bg-primary/10 rounded-lg">
        <div className="flex gap-2">
          <svg
            className="w-4 h-4 text-primary flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-[10px] text-primary">
            <strong>Gmail trick:</strong> Dots are ignored & everything after +
            goes to same inbox
          </p>
        </div>
      </div>
    </div>
  );
}





