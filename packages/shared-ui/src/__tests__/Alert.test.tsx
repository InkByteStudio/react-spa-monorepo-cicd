import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Alert } from "../components/Alert";

describe("Alert", () => {
  it("renders alert content", () => {
    render(<Alert>Something happened</Alert>);
    expect(screen.getByRole("alert")).toHaveTextContent("Something happened");
  });

  it("applies info variant by default", () => {
    render(<Alert>Info message</Alert>);
    expect(screen.getByRole("alert").className).toContain("info");
  });

  it("applies success variant", () => {
    render(<Alert variant="success">Done!</Alert>);
    expect(screen.getByRole("alert").className).toContain("success");
  });

  it("applies warning variant", () => {
    render(<Alert variant="warning">Caution</Alert>);
    expect(screen.getByRole("alert").className).toContain("warning");
  });

  it("applies error variant", () => {
    render(<Alert variant="error">Failed</Alert>);
    expect(screen.getByRole("alert").className).toContain("error");
  });

  it("has role=alert for accessibility", () => {
    render(<Alert>Accessible</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
