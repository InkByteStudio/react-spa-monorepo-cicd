import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Badge } from "../components/Badge";

describe("Badge", () => {
  it("renders badge content", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("applies default variant by default", () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText("Default").className).toContain("default");
  });

  it("applies success variant", () => {
    render(<Badge variant="success">Paid</Badge>);
    expect(screen.getByText("Paid").className).toContain("success");
  });

  it("applies warning variant", () => {
    render(<Badge variant="warning">Pending</Badge>);
    expect(screen.getByText("Pending").className).toContain("warning");
  });

  it("applies error variant", () => {
    render(<Badge variant="error">Overdue</Badge>);
    expect(screen.getByText("Overdue").className).toContain("error");
  });

  it("applies info variant", () => {
    render(<Badge variant="info">Info</Badge>);
    expect(screen.getByText("Info").className).toContain("info");
  });

  it("merges custom className", () => {
    render(<Badge className="custom">Test</Badge>);
    expect(screen.getByText("Test").className).toContain("custom");
  });
});
