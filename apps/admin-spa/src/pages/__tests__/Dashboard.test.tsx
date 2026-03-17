import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { Dashboard } from "../Dashboard";

describe("Dashboard", () => {
  it("renders the heading", () => {
    render(<Dashboard />);
    expect(screen.getByRole("heading", { name: /admin dashboard/i })).toBeInTheDocument();
  });

  it("displays today's date", () => {
    render(<Dashboard />);
    expect(screen.getByText(/today is/i)).toBeInTheDocument();
  });

  it("renders stat cards", () => {
    render(<Dashboard />);
    expect(screen.getByText(/total users/i)).toBeInTheDocument();
    expect(screen.getByText(/active projects/i)).toBeInTheDocument();
    expect(screen.getByText(/storage used/i)).toBeInTheDocument();
    expect(screen.getByText(/monthly revenue/i)).toBeInTheDocument();
  });

  it("renders recent activity list", () => {
    render(<Dashboard />);
    expect(screen.getByText(/recent activity/i)).toBeInTheDocument();
    const activityItems = screen.getAllByText("Alice Johnson");
    expect(activityItems.length).toBeGreaterThan(0);
  });
});
