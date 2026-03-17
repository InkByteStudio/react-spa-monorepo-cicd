import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { Account } from "../Account";

describe("Portal Account", () => {
  it("renders the heading", () => {
    render(<Account />);
    expect(screen.getByRole("heading", { name: /account settings/i })).toBeInTheDocument();
  });

  it("shows account profile info", () => {
    render(<Account />);
    expect(screen.getByText("Sarah Chen")).toBeInTheDocument();
    expect(screen.getByText("sarah.chen@acmecorp.com")).toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("Pro")).toBeInTheDocument();
  });

  it("renders notification checkboxes", () => {
    render(<Account />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBe(3);
  });

  it("shows success alert on save", () => {
    render(<Account />);
    fireEvent.click(screen.getByRole("button", { name: /save preferences/i }));
    expect(screen.getByText(/settings saved successfully/i)).toBeInTheDocument();
  });
});
