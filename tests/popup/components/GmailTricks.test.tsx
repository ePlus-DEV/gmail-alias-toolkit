import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import GmailTricks from "../../../entrypoints/popup/components/GmailTricks";

describe("GmailTricks", () => {
  beforeEach(() => {
    const messages: Record<string, string> = {
      allCombos: "All Combos",
      copy: "Copy",
      dotPlus: "Dot + Plus",
      dotTrick: "Dot Trick",
      generateTricks: "Generate Tricks",
      generatedVariations: "Generated Variations",
      gmailTrickInfo:
        "Dots are ignored and everything after + goes to the same inbox",
      gmailTrickInfoLabel: "Gmail trick:",
      googlemail: "Googlemail",
      numberOfVariations: "Number of variations",
      plusTags: "Plus (+) Tags",
      random: "Random",
      randomizeDotPositions: "Randomize dot positions",
      removeDots: "Remove Dots",
      sequential: "Sequential",
      totalCount: "$1 total",
    };

    vi.stubGlobal("browser", {
      i18n: {
        getMessage: vi.fn((key: string, substitutions?: string | string[]) => {
          const message = messages[key] ?? key;
          const first = Array.isArray(substitutions)
            ? substitutions[0]
            : substitutions;
          return first ? message.replace("$1", first) : message;
        }),
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("generates a fallback dot result for a one-character username", async () => {
    const onCopy = vi.fn();
    render(<GmailTricks baseEmail="a@gmail.com" onCopy={onCopy} />);

    fireEvent.click(screen.getByRole("button", { name: /generate tricks/i }));

    await waitFor(() => {
      expect(screen.getByText("a@gmail.com")).toBeInTheDocument();
    });
    expect(onCopy).toHaveBeenCalledWith("a@gmail.com");
  });

  it("generates googlemail variation for a one-character username", async () => {
    const onCopy = vi.fn();
    render(<GmailTricks baseEmail="a@gmail.com" onCopy={onCopy} />);

    fireEvent.click(screen.getByRole("button", { name: /googlemail/i }));
    fireEvent.click(screen.getByRole("button", { name: /generate tricks/i }));

    await waitFor(() => {
      expect(screen.getByText("a@googlemail.com")).toBeInTheDocument();
    });
    expect(onCopy).toHaveBeenCalledWith("a@googlemail.com");
  });

  it("generates plus tags for a one-character username", async () => {
    const onCopy = vi.fn();
    render(<GmailTricks baseEmail="a@gmail.com" onCopy={onCopy} />);

    fireEvent.click(screen.getByRole("button", { name: /plus \(\+\) tags/i }));
    fireEvent.click(screen.getByRole("button", { name: /generate tricks/i }));

    await waitFor(() => {
      expect(screen.getByText("a+newsletter@gmail.com")).toBeInTheDocument();
    });
    expect(onCopy).toHaveBeenCalledWith("a+newsletter@gmail.com");
  });

  it("generates dot plus aliases for a one-character username", async () => {
    const onCopy = vi.fn();
    render(<GmailTricks baseEmail="a@gmail.com" onCopy={onCopy} />);

    fireEvent.click(screen.getByRole("button", { name: /dot \+ plus/i }));
    fireEvent.click(screen.getByRole("button", { name: /generate tricks/i }));

    await waitFor(() => {
      expect(screen.getByText("a+shop@gmail.com")).toBeInTheDocument();
    });
    expect(onCopy).toHaveBeenCalledWith("a+shop@gmail.com");
  });

  it("generates combo aliases for a one-character username", async () => {
    const onCopy = vi.fn();
    render(<GmailTricks baseEmail="a@gmail.com" onCopy={onCopy} />);

    fireEvent.click(screen.getByRole("button", { name: /all combos/i }));
    fireEvent.click(screen.getByRole("button", { name: /generate tricks/i }));

    await waitFor(() => {
      expect(screen.getByText("a+newsletter@gmail.com")).toBeInTheDocument();
    });
    expect(onCopy).toHaveBeenCalledWith("a+newsletter@gmail.com");
  });
});
