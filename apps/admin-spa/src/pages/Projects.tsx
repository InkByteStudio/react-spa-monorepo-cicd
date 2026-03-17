import { useState, useMemo } from "react";
import { Card, Badge } from "@repo/shared-ui";
import { formatDate } from "@repo/shared-utils";
import { adminProjects } from "../data/mock-data";
import "./Projects.css";

const statusVariant = {
  active: "success",
  completed: "info",
  "on-hold": "warning",
} as const;

type StatusFilter = "all" | "active" | "completed" | "on-hold";

export function Projects() {
  const [filter, setFilter] = useState<StatusFilter>("all");

  const filteredProjects = useMemo(() => {
    if (filter === "all") return adminProjects;
    return adminProjects.filter((p) => p.status === filter);
  }, [filter]);

  return (
    <>
      <header className="app-header">
        <h1>Projects</h1>
        <p className="app-date">{adminProjects.length} projects across all accounts</p>
      </header>

      <main className="app-content">
        <Card title="All Projects">
          <div className="projects-filter">
            <label htmlFor="status-filter" className="filter-label">
              Filter by status:
            </label>
            <select
              id="status-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as StatusFilter)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
          <table className="projects-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Project</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Team Size</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id}>
                  <td className="project-id">{project.id}</td>
                  <td>{project.name}</td>
                  <td>{project.owner}</td>
                  <td>
                    <Badge variant={statusVariant[project.status]}>{project.status}</Badge>
                  </td>
                  <td>{project.teamSize}</td>
                  <td>{formatDate(new Date(project.createdAt))}</td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={6} className="projects-empty">
                    No projects match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </main>
    </>
  );
}
