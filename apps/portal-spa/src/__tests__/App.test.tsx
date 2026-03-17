import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import { describe, it, expect } from "vitest";
import { AppRoutes } from "../App";

describe("Portal App", () => {
  it("renders the dashboard heading by default", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: /dashboard/i })).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /billing/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /support/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /account/i })).toBeInTheDocument();
  });

  it("renders projects page", () => {
    render(
      <MemoryRouter initialEntries={["/projects"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: /projects/i })).toBeInTheDocument();
  });

  it("renders billing page", () => {
    render(
      <MemoryRouter initialEntries={["/billing"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: /billing/i })).toBeInTheDocument();
  });

  it("renders support page", () => {
    render(
      <MemoryRouter initialEntries={["/support"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: /support/i })).toBeInTheDocument();
  });

  it("renders account page", () => {
    render(
      <MemoryRouter initialEntries={["/account"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: /account settings/i })).toBeInTheDocument();
  });

  it("redirects unknown routes to dashboard", () => {
    render(
      <MemoryRouter initialEntries={["/nonexistent"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: /dashboard/i })).toBeInTheDocument();
  });
});
