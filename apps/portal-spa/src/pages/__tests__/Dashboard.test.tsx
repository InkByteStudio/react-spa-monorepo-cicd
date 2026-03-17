import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { Dashboard } from "../Dashboard";

describe("Portal Dashboard", () => {
  it("renders the heading", () => {
    render(<Dashboard />);
    expect(screen.getByRole("heading", { name: /dashboard/i })).toBeInTheDocument();
  });

  it("shows stat cards", () => {
    render(<Dashboard />);
    expect(screen.getByText(/active projects/i)).toBeInTheDocument();
    expect(screen.getByText(/tasks completed/i)).toBeInTheDocument();
    expect(screen.getByText(/pending invoices/i)).toBeInTheDocument();
    expect(screen.getByText(/open tickets/i)).toBeInTheDocument();
  });

  it("shows the welcome message with date", () => {
    render(<Dashboard />);
    expect(screen.getByText(/welcome back, sarah/i)).toBeInTheDocument();
  });

  it("renders recent activity list", () => {
    render(<Dashboard />);
    expect(screen.getByText(/recent activity/i)).toBeInTheDocument();
    expect(screen.getByText(/payment gateway migration/i)).toBeInTheDocument();
  });
});
