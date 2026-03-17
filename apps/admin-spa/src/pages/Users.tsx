import { useState, useMemo } from "react";
import { Card, Alert, Badge, Input } from "@repo/shared-ui";
import { relativeTime } from "@repo/shared-utils";
import { users } from "../data/mock-data";
import "./Users.css";

const roleVariant = {
  Admin: "info",
  Editor: "warning",
  Viewer: "default",
} as const;

const statusVariant = {
  active: "success",
  inactive: "default",
} as const;

export function Users() {
  const [search, setSearch] = useState("");
  const [error] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const query = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.role.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <>
      <header className="app-header">
        <h1>Users</h1>
        <p className="app-date">{users.length} users total</p>
      </header>

      <main className="app-content">
        {error && <Alert variant="error">{error}</Alert>}

        <Card title="User List">
          <div className="users-search">
            <Input
              label="Search users"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name, email, or role..."
            />
          </div>
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge variant={roleVariant[user.role]}>{user.role}</Badge>
                  </td>
                  <td>
                    <Badge variant={statusVariant[user.status]}>{user.status}</Badge>
                  </td>
                  <td className="users-login-time">{relativeTime(user.lastLogin)}</td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="users-empty">
                    No users match your search.
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
