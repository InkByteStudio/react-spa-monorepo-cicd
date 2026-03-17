import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import { describe, it, expect } from "vitest";
import { AppRoutes } from "../App";

describe("Admin App", () => {
  it("renders the dashboard heading", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: /admin dashboard/i })).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /users/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /settings/i })).toBeInTheDocument();
  });

  it("renders stat cards on dashboard", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByText(/total users/i)).toBeInTheDocument();
    expect(screen.getByText(/active projects/i)).toBeInTheDocument();
  });

  it("renders today's date using shared-utils", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByText(/today is/i)).toBeInTheDocument();
  });

  it("renders users page", () => {
    render(
      <MemoryRouter initialEntries={["/users"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: /users/i })).toBeInTheDocument();
  });

  it("renders projects page", () => {
    render(
      <MemoryRouter initialEntries={["/projects"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { level: 1, name: /projects/i })).toBeInTheDocument();
  });

  it("renders settings page", () => {
    render(
      <MemoryRouter initialEntries={["/settings"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { level: 1, name: /settings/i })).toBeInTheDocument();
  });
});
