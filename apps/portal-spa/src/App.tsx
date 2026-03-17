import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router";

import { Dashboard } from "./pages/Dashboard";
import { Projects } from "./pages/Projects";
import { Billing } from "./pages/Billing";
import { Support } from "./pages/Support";
import { Account } from "./pages/Account";

export function AppRoutes() {
  return (
    <div className="app">
      <header className="site-header">
        <a href="/" className="site-brand">
          Monorepo Demo
        </a>
        <span className="site-label">Customer Portal</span>
      </header>
      <nav className="app-nav" aria-label="Main navigation">
        <NavLink to="/" end>
          Dashboard
        </NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/billing">Billing</NavLink>
        <NavLink to="/support">Support</NavLink>
        <NavLink to="/account">Account</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/support" element={<Support />} />
        <Route path="/account" element={<Account />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter basename="/portal">
      <AppRoutes />
    </BrowserRouter>
  );
}
