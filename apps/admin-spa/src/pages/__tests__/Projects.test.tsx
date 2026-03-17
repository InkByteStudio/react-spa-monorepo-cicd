import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { Projects } from "../Projects";

describe("Admin Projects", () => {
  it("renders the heading", () => {
    render(<Projects />);
    expect(screen.getByRole("heading", { level: 1, name: /projects/i })).toBeInTheDocument();
  });

  it("displays project count", () => {
    render(<Projects />);
    expect(screen.getByText(/8 projects across all accounts/i)).toBeInTheDocument();
  });

  it("renders project table", () => {
    render(<Projects />);
    expect(screen.getByText("Website Redesign")).toBeInTheDocument();
    expect(screen.getByText("Mobile App MVP")).toBeInTheDocument();
  });

  it("renders status filter", () => {
    render(<Projects />);
    expect(screen.getByLabelText(/filter by status/i)).toBeInTheDocument();
  });

  it("filters projects by status", () => {
    render(<Projects />);
    const select = screen.getByLabelText(/filter by status/i);
    fireEvent.change(select, { target: { value: "completed" } });
    expect(screen.getByText("API Integration")).toBeInTheDocument();
    expect(screen.queryByText("Website Redesign")).not.toBeInTheDocument();
  });
});
