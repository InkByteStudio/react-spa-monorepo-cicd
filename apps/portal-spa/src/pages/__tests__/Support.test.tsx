import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { Support } from "../Support";

describe("Portal Support", () => {
  it("renders the heading", () => {
    render(<Support />);
    expect(screen.getByRole("heading", { name: /support/i })).toBeInTheDocument();
  });

  it("renders ticket table", () => {
    render(<Support />);
    expect(screen.getByText("TKT-301")).toBeInTheDocument();
    expect(screen.getByText(/export csv not working/i)).toBeInTheDocument();
  });

  it("renders the contact form", () => {
    render(<Support />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", () => {
    render(<Support />);
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/message is required/i)).toBeInTheDocument();
  });

  it("validates email format", () => {
    render(<Support />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "not-an-email" } });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
  });
});
