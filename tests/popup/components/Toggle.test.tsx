import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Toggle from "../../../entrypoints/popup/components/Toggle";

describe("Toggle", () => {
  it("renders label", () => {
    render(<Toggle enabled={false} onChange={vi.fn()} label="Dark mode" />);
    expect(screen.getByText("Dark mode")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <Toggle
        enabled={false}
        onChange={vi.fn()}
        label="Test"
        description="Some description"
      />,
    );
    expect(screen.getByText("Some description")).toBeInTheDocument();
  });

  it("does not render description when omitted", () => {
    render(<Toggle enabled={false} onChange={vi.fn()} label="Test" />);
    expect(screen.queryByText("Some description")).not.toBeInTheDocument();
  });

  it("calls onChange with true when toggled from off", () => {
    const onChange = vi.fn();
    render(<Toggle enabled={false} onChange={onChange} label="Test" />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("calls onChange with false when toggled from on", () => {
    const onChange = vi.fn();
    render(<Toggle enabled onChange={onChange} label="Test" />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("has aria-checked=true when enabled", () => {
    render(<Toggle enabled onChange={vi.fn()} label="Test" />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("has aria-checked=false when disabled", () => {
    render(<Toggle enabled={false} onChange={vi.fn()} label="Test" />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("has bg-primary when enabled", () => {
    render(<Toggle enabled onChange={vi.fn()} label="Test" />);
    expect(screen.getByRole("switch")).toHaveClass("bg-primary");
  });

  it("has bg-muted when disabled", () => {
    render(<Toggle enabled={false} onChange={vi.fn()} label="Test" />);
    expect(screen.getByRole("switch")).toHaveClass("bg-muted");
  });
});
