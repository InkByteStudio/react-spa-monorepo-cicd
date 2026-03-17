import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as axeMatchers from "vitest-axe/matchers";
import { axe } from "vitest-axe";
import { Input } from "../components/Input";

expect.extend(axeMatchers);

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input aria-label="test" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with a label", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<Input label="Email" error="Required field" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Required field");
  });

  it("sets aria-invalid when error is present", () => {
    render(<Input label="Email" error="Invalid" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  });

  it("handles onChange events", () => {
    const handleChange = vi.fn();
    render(<Input label="Name" onChange={handleChange} />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "test" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("supports disabled state", () => {
    render(<Input label="Name" disabled />);
    expect(screen.getByLabelText("Name")).toBeDisabled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Input label="Email" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
