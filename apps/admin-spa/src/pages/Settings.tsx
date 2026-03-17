import { useState, useEffect, useCallback } from "react";
import { Button, Card, Input, Alert } from "@repo/shared-ui";
import { isNonEmpty } from "@repo/shared-utils";
import "./Settings.css";

export function Settings() {
  const [siteName, setSiteName] = useState("My Application");
  const [siteDescription, setSiteDescription] = useState("A project management platform");
  const [timezone, setTimezone] = useState("America/New_York");
  const [error, setError] = useState<string | undefined>();
  const [saved, setSaved] = useState(false);

  const [notifyNewUser, setNotifyNewUser] = useState(true);
  const [notifyWeeklyReport, setNotifyWeeklyReport] = useState(true);
  const [notifySystemErrors, setNotifySystemErrors] = useState(false);

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 3000);
    return () => clearTimeout(timer);
  }, [saved]);

  const handleSave = useCallback(() => {
    if (!isNonEmpty(siteName)) {
      setError("Site name is required");
      return;
    }
    if (siteName.length > 100) {
      setError("Site name must be 100 characters or fewer");
      return;
    }
    setError(undefined);
    setSaved(true);
  }, [siteName]);

  const handleReset = () => {
    setSiteName("My Application");
    setSiteDescription("A project management platform");
    setTimezone("America/New_York");
    setNotifyNewUser(true);
    setNotifyWeeklyReport(true);
    setNotifySystemErrors(false);
    setShowResetConfirm(false);
    setSaved(true);
  };

  return (
    <>
      <header className="app-header">
        <h1>Settings</h1>
      </header>

      <main className="app-content">
        {saved && <Alert variant="success">Settings saved successfully!</Alert>}

        <div className="settings-sections">
          <Card title="General" footer={<Button onClick={handleSave}>Save Changes</Button>}>
            <div className="settings-fields">
              <Input
                label="Site Name"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                error={error}
              />
              <Input
                label="Site Description"
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
              />
              <div className="select-field">
                <label htmlFor="timezone" className="select-label">
                  Timezone
                </label>
                <select
                  id="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="select-input"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                  <option value="Europe/Berlin">Central European Time (CET)</option>
                  <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                </select>
              </div>
            </div>
          </Card>

          <Card title="Notifications">
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={notifyNewUser}
                  onChange={(e) => setNotifyNewUser(e.target.checked)}
                />
                Email alerts on new user signups
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={notifyWeeklyReport}
                  onChange={(e) => setNotifyWeeklyReport(e.target.checked)}
                />
                Weekly usage report
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={notifySystemErrors}
                  onChange={(e) => setNotifySystemErrors(e.target.checked)}
                />
                System error notifications
              </label>
            </div>
          </Card>

          <Card title="Danger Zone">
            <div className="danger-zone">
              <p className="danger-description">
                Reset all settings to their default values. This cannot be undone.
              </p>
              {showResetConfirm ? (
                <div className="danger-confirm">
                  <Alert variant="warning">Are you sure? This will reset all settings.</Alert>
                  <div className="danger-actions">
                    <Button variant="danger" onClick={handleReset}>
                      Yes, Reset Everything
                    </Button>
                    <Button variant="secondary" onClick={() => setShowResetConfirm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button variant="danger" onClick={() => setShowResetConfirm(true)}>
                  Reset All Settings
                </Button>
              )}
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
