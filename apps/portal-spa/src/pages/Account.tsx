import { useState, useEffect, useRef } from "react";
import { Card, Button, Alert } from "@repo/shared-ui";
import { account } from "../data/mock-data";
import "./Account.css";

export function Account() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [projectUpdates, setProjectUpdates] = useState(false);
  const [saved, setSaved] = useState(false);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (!saved) return;
    savedTimerRef.current = setTimeout(() => setSaved(false), 3000);
    return () => {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, [saved]);

  const handleSave = () => {
    setSaved(true);
  };

  return (
    <main>
      <header className="page-header">
        <h1>Account Settings</h1>
        <p className="page-subtitle">Manage your profile and preferences</p>
      </header>

      {saved && <Alert variant="success">Settings saved successfully.</Alert>}

      <section className="section">
        <Card title="Profile">
          <div className="account-profile">
            <div className="avatar">{account.avatarInitials}</div>
            <dl className="profile-details">
              <div className="detail-row">
                <dt>Name</dt>
                <dd>{account.name}</dd>
              </div>
              <div className="detail-row">
                <dt>Email</dt>
                <dd>{account.email}</dd>
              </div>
              <div className="detail-row">
                <dt>Company</dt>
                <dd>{account.company}</dd>
              </div>
              <div className="detail-row">
                <dt>Plan</dt>
                <dd>{account.plan}</dd>
              </div>
            </dl>
          </div>
        </Card>
      </section>

      <section className="section">
        <Card title="Notification Preferences">
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
              />
              Email notifications for ticket updates
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
              />
              Weekly project digest
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={projectUpdates}
                onChange={(e) => setProjectUpdates(e.target.checked)}
              />
              Real-time project update alerts
            </label>
          </div>
          <div className="save-row">
            <Button onClick={handleSave}>Save Preferences</Button>
          </div>
        </Card>
      </section>
    </main>
  );
}
