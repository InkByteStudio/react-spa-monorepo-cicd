import { Card } from "@repo/shared-ui";
import { formatDate, relativeTime } from "@repo/shared-utils";
import { platformStats, adminActivities } from "../data/mock-data";
import "./Dashboard.css";

export function Dashboard() {
  const today = formatDate(new Date());

  return (
    <>
      <header className="app-header">
        <h1>Admin Dashboard</h1>
        <p className="app-date">Today is {today}</p>
      </header>

      <main className="app-content">
        <div className="stats-grid">
          <Card>
            <p className="stat-value">{platformStats.totalUsers}</p>
            <p className="stat-label">Total Users</p>
          </Card>
          <Card>
            <p className="stat-value">{platformStats.activeProjects}</p>
            <p className="stat-label">Active Projects</p>
          </Card>
          <Card>
            <p className="stat-value">
              {platformStats.storageUsedGb} / {platformStats.storageLimitGb} GB
            </p>
            <p className="stat-label">Storage Used</p>
          </Card>
          <Card>
            <p className="stat-value">${platformStats.monthlyRevenue.toLocaleString()}</p>
            <p className="stat-label">Monthly Revenue</p>
          </Card>
        </div>

        <Card title="Recent Activity">
          <ul className="activity-list">
            {adminActivities.map((item) => (
              <li key={item.id} className="activity-item">
                <span className="activity-text">
                  <strong>{item.user}</strong> {item.action}
                </span>
                <span className="activity-time">{relativeTime(item.timestamp)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </main>
    </>
  );
}
