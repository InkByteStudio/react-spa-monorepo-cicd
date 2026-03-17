import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import { Settings } from "../Settings";

describe("Settings", () => {
  it("renders the heading", () => {
    render(<Settings />);
    expect(screen.getByRole("heading", { level: 1, name: /settings/i })).toBeInTheDocument();
  });

  it("renders site name input with default value", () => {
    render(<Settings />);
    const input = screen.getByLabelText(/site name/i);
    expect(input).toHaveValue("My Application");
  });

  it("renders site description input", () => {
    render(<Settings />);
    expect(screen.getByLabelText(/site description/i)).toBeInTheDocument();
  });

  it("renders timezone select", () => {
    render(<Settings />);
    expect(screen.getByLabelText(/timezone/i)).toBeInTheDocument();
  });

  it("renders notification checkboxes", () => {
    render(<Settings />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBe(3);
  });

  it("shows success message on valid save", async () => {
    vi.useFakeTimers();
    render(<Settings />);

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(saveButton);

    expect(screen.getByText(/settings saved successfully/i)).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText(/settings saved successfully/i)).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it("shows error when site name is empty", () => {
    render(<Settings />);

    const input = screen.getByLabelText(/site name/i);
    fireEvent.change(input, { target: { value: "" } });

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(saveButton);

    expect(screen.getByText(/site name is required/i)).toBeInTheDocument();
    expect(screen.queryByText(/settings saved successfully/i)).not.toBeInTheDocument();
  });

  it("shows error when site name is too long", () => {
    render(<Settings />);

    const input = screen.getByLabelText(/site name/i);
    fireEvent.change(input, { target: { value: "a".repeat(101) } });

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(saveButton);

    expect(screen.getByText(/100 characters or fewer/i)).toBeInTheDocument();
  });

  it("shows danger zone with reset button", () => {
    render(<Settings />);
    expect(screen.getByRole("button", { name: /reset all settings/i })).toBeInTheDocument();
  });

  it("shows confirmation on reset click", () => {
    render(<Settings />);
    fireEvent.click(screen.getByRole("button", { name: /reset all settings/i }));
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /yes, reset everything/i })).toBeInTheDocument();
  });

  it("updates site name input value", () => {
    render(<Settings />);
    const input = screen.getByLabelText(/site name/i);
    fireEvent.change(input, { target: { value: "New Name" } });
    expect(input).toHaveValue("New Name");
  });
});
