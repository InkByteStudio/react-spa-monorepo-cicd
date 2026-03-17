import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as axeMatchers from "vitest-axe/matchers";
import { axe } from "vitest-axe";
import { Card } from "../components/Card";

expect.extend(axeMatchers);

describe("Card", () => {
  it("renders children content", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("renders with a title", () => {
    render(<Card title="My Card">Content</Card>);
    expect(screen.getByText("My Card")).toBeInTheDocument();
  });

  it("renders footer when provided", () => {
    render(<Card footer={<button>Save</button>}>Content</Card>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("renders without title or footer", () => {
    render(<Card>Just content</Card>);
    expect(screen.getByText("Just content")).toBeInTheDocument();
  });

  it("accepts custom className", () => {
    const { container } = render(<Card className="custom">Content</Card>);
    expect(container.firstChild).toHaveClass("custom");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Card title="Test Card">Content</Card>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
