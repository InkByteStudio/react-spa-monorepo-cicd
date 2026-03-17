import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { Billing } from "../Billing";

describe("Portal Billing", () => {
  it("renders the heading", () => {
    render(<Billing />);
    expect(screen.getByRole("heading", { name: /billing/i })).toBeInTheDocument();
  });

  it("shows summary stats", () => {
    render(<Billing />);
    expect(screen.getByText(/total billed/i)).toBeInTheDocument();
    expect(screen.getByText(/outstanding balance/i)).toBeInTheDocument();
    expect(screen.getByText(/total invoices/i)).toBeInTheDocument();
  });

  it("renders invoice table", () => {
    render(<Billing />);
    expect(screen.getByText("INV-1042")).toBeInTheDocument();
    expect(screen.getByText("INV-1049")).toBeInTheDocument();
  });

  it("shows invoice status badges", () => {
    render(<Billing />);
    const paidBadges = screen.getAllByText("paid");
    expect(paidBadges.length).toBeGreaterThan(0);
    expect(screen.getByText("pending")).toBeInTheDocument();
    expect(screen.getByText("overdue")).toBeInTheDocument();
  });
});
