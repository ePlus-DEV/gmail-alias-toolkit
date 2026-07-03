import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Button from "../../../entrypoints/popup/components/Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Test</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when disabled", () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Test
      </Button>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Test</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders icon when provided", () => {
    render(<Button icon={<span data-testid="icon">X</span>}>Test</Button>);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("applies w-full class when fullWidth is true", () => {
    render(<Button fullWidth>Test</Button>);
    expect(screen.getByRole("button")).toHaveClass("w-full");
  });

  it.each(["primary", "secondary", "danger", "success"] as const)(
    "renders %s variant without error",
    (variant) => {
      render(<Button variant={variant}>Test</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    },
  );

  it.each(["sm", "md", "lg"] as const)(
    "renders %s size without error",
    (size) => {
      render(<Button size={size}>Test</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    },
  );

  it("applies opacity-50 when disabled", () => {
    render(<Button disabled>Test</Button>);
    expect(screen.getByRole("button")).toHaveClass("opacity-50");
  });
});
