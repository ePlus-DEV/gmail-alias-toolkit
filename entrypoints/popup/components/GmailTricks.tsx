import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { Checkbox } from "src/components/motion/checkbox";
import { Tooltip } from "src/components/motion/tooltip";
import { Copy, Dices, Info, Zap } from "lucide-react";
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

  const trickButtonClass = (active: boolean) =>
    `h-10 min-w-0 rounded-xl border px-2 text-xs font-medium transition-colors ${
      active
        ? "border-primary/35 bg-primary/10 text-foreground"
        : "border-border bg-background text-muted-foreground hover:bg-muted/70 hover:text-foreground"
    }`;

  // skipcq: JS-0415
  return (
    // skipcq: JS-0415
    <div>
      {/* Trick Type Selector */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <Button
          onClick={() => setSelectedTrick("dot")}
          variant="outline"
          className={trickButtonClass(selectedTrick === "dot")}
        >
          Dot Trick
        </Button>
        <Button
          onClick={() => setSelectedTrick("plus")}
          variant="outline"
          className={trickButtonClass(selectedTrick === "plus")}
        >
          Plus (+) Tags
        </Button>
        <Button
          onClick={() => setSelectedTrick("googlemail")}
          variant="outline"
          className={trickButtonClass(selectedTrick === "googlemail")}
        >
          Googlemail
        </Button>
        <Button
          onClick={() => setSelectedTrick("nodots")}
          variant="outline"
          className={trickButtonClass(selectedTrick === "nodots")}
        >
          Remove Dots
        </Button>
        <Button
          onClick={() => setSelectedTrick("dotplus")}
          variant="outline"
          className={trickButtonClass(selectedTrick === "dotplus")}
        >
          Dot + Plus
        </Button>
        <Button
          onClick={() => setSelectedTrick("combo")}
          variant="outline"
          className={trickButtonClass(selectedTrick === "combo")}
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
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background p-2.5">
            <Checkbox
              id="randomizeDots"
              checked={randomizeDots}
              onCheckedChange={setRandomizeDots}
            />
            <label
              htmlFor="randomizeDots"
              className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-foreground"
            >
              <Dices className="h-3.5 w-3.5 text-muted-foreground" />
              Randomize dot positions
            </label>
            <span className="ml-auto rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {randomizeDots ? "Random" : "Sequential"}
            </span>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <Button
        onClick={generateTricksVariations}
        ripple
        className="mb-3 h-10 w-full rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <div className="flex items-center justify-center gap-2">
          <Zap className="h-4 w-4" />
          Generate Tricks
        </div>
      </Button>

      {/* Generated Tricks List */}
      {generatedTricks.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border bg-background">
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
                <Tooltip content="Copy">
                  <Button
                    onClick={() => onCopy(email)}
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 flex-shrink-0 rounded-lg p-0 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                    aria-label="Copy"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </Tooltip>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-3 rounded-xl border border-border bg-muted/55 p-2.5">
        <div className="flex gap-2">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
          <p className="text-[10px] leading-4 text-muted-foreground">
            <strong className="text-foreground">Gmail trick:</strong> Dots are ignored & everything after +
            goes to same inbox
          </p>
        </div>
      </div>
    </div>
  );
}






