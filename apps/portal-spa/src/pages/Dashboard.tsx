import { Card } from "@repo/shared-ui";
import { formatDate, relativeTime } from "@repo/shared-utils";
import { projects, invoices, tickets, activities } from "../data/mock-data";
import "./Dashboard.css";

export function Dashboard() {
  const today = formatDate(new Date());
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const totalTasks = projects.reduce((sum, p) => sum + p.tasksTotal, 0);
  const completedTasks = projects.reduce((sum, p) => sum + p.tasksCompleted, 0);
  const pendingAmount = invoices
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((sum, i) => sum + i.amount, 0);
  const openTickets = tickets.filter((t) => t.status !== "resolved").length;

  return (
    <main>
      <header className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">Welcome back, Sarah &mdash; {today}</p>
      </header>

      <div className="stats-grid">
        <Card>
          <p className="stat-value">{activeProjects}</p>
          <p className="stat-label">Active Projects</p>
        </Card>
        <Card>
          <p className="stat-value">
            {completedTasks}/{totalTasks}
          </p>
          <p className="stat-label">Tasks Completed</p>
        </Card>
        <Card>
          <p className="stat-value">${pendingAmount.toLocaleString()}</p>
          <p className="stat-label">Pending Invoices</p>
        </Card>
        <Card>
          <p className="stat-value">{openTickets}</p>
          <p className="stat-label">Open Tickets</p>
        </Card>
      </div>

      <section className="section">
        <Card title="Recent Activity">
          <ul className="activity-list">
            {activities.map((item) => (
              <li key={item.id} className="activity-item">
                <span className="activity-text">
                  {item.action} <strong>{item.target}</strong>
                </span>
                <span className="activity-time">{relativeTime(item.timestamp)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </main>
  );
}
