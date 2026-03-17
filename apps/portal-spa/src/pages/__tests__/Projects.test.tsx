import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { Projects } from "../Projects";

describe("Portal Projects", () => {
  it("renders the heading with project count", () => {
    render(<Projects />);
    expect(screen.getByRole("heading", { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByText(/6 projects total/i)).toBeInTheDocument();
  });

  it("renders project cards", () => {
    render(<Projects />);
    expect(screen.getByText("Website Redesign")).toBeInTheDocument();
    expect(screen.getByText("Mobile App MVP")).toBeInTheDocument();
    expect(screen.getByText("API Integration")).toBeInTheDocument();
  });

  it("shows status badges", () => {
    render(<Projects />);
    const activeBadges = screen.getAllByText("active");
    expect(activeBadges.length).toBeGreaterThan(0);
  });

  it("shows progress information", () => {
    render(<Projects />);
    expect(screen.getByText("65%")).toBeInTheDocument();
    expect(screen.getByText("26/40 tasks")).toBeInTheDocument();
  });
});
