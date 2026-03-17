import { Card, Badge } from "@repo/shared-ui";
import { formatDate } from "@repo/shared-utils";
import { projects } from "../data/mock-data";
import "./Projects.css";

const statusVariant = {
  active: "success",
  completed: "info",
  "on-hold": "warning",
} as const;

export function Projects() {
  return (
    <main>
      <header className="page-header">
        <h1>Projects</h1>
        <p className="page-subtitle">{projects.length} projects total</p>
      </header>

      <div className="projects-grid">
        {projects.map((project) => (
          <Card key={project.id} title={project.name}>
            <div className="project-meta">
              <Badge variant={statusVariant[project.status]}>{project.status}</Badge>
              <span className="project-id">{project.id}</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${project.progress}%` }} />
              </div>
              <span className="progress-label">{project.progress}%</span>
            </div>
            <div className="project-details">
              <span>
                {project.tasksCompleted}/{project.tasksTotal} tasks
              </span>
              <span>{project.teamSize} members</span>
              <span>Due {formatDate(new Date(project.dueDate))}</span>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
