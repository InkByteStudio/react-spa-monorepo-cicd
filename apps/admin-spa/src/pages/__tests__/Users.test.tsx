import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { Users } from "../Users";

describe("Users", () => {
  it("renders the heading", () => {
    render(<Users />);
    expect(screen.getByRole("heading", { name: /users/i })).toBeInTheDocument();
  });

  it("displays user count", () => {
    render(<Users />);
    expect(screen.getByText("8 users total")).toBeInTheDocument();
  });

  it("displays all users", () => {
    render(<Users />);
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    expect(screen.getByText("Eva Martinez")).toBeInTheDocument();
    expect(screen.getByText("Grace Kim")).toBeInTheDocument();
  });

  it("renders table headers", () => {
    render(<Users />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Last Login")).toBeInTheDocument();
  });

  it("shows role and status badges", () => {
    render(<Users />);
    const adminBadges = screen.getAllByText("Admin");
    expect(adminBadges.length).toBeGreaterThan(0);
  });

  it("filters users by search", () => {
    render(<Users />);
    const searchInput = screen.getByLabelText(/search users/i);
    fireEvent.change(searchInput, { target: { value: "alice" } });
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.queryByText("Bob Smith")).not.toBeInTheDocument();
  });

  it("shows empty state when search has no results", () => {
    render(<Users />);
    const searchInput = screen.getByLabelText(/search users/i);
    fireEvent.change(searchInput, { target: { value: "zzzzz" } });
    expect(screen.getByText(/no users match/i)).toBeInTheDocument();
  });
});
