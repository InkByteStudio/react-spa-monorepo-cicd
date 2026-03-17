import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router";

import { Dashboard } from "./pages/Dashboard";
import { Users } from "./pages/Users";
import { Projects } from "./pages/Projects";
import { Settings } from "./pages/Settings";

export function AppRoutes() {
  return (
    <div className="app">
      <header className="site-header">
        <a href="/" className="site-brand">
          Monorepo Demo
        </a>
        <span className="site-label">Admin Dashboard</span>
      </header>
      <nav className="app-nav" aria-label="Main navigation">
        <NavLink to="/" end>
          Dashboard
        </NavLink>
        <NavLink to="/users">Users</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter basename="/admin">
      <AppRoutes />
    </BrowserRouter>
  );
}
