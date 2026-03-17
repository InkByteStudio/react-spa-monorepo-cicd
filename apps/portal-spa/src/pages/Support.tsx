import { useState, useEffect, useRef } from "react";
import { Card, Badge, Button, Input, Alert } from "@repo/shared-ui";
import { formatDate, isValidEmail, isNonEmpty } from "@repo/shared-utils";
import { tickets } from "../data/mock-data";
import "./Support.css";

const statusVariant = {
  open: "warning",
  "in-progress": "info",
  resolved: "success",
} as const;

const priorityVariant = {
  low: "default",
  medium: "warning",
  high: "error",
} as const;

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function Support() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const submitTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (!submitted) return;
    submitTimerRef.current = setTimeout(() => setSubmitted(false), 5000);
    return () => {
      if (submitTimerRef.current) clearTimeout(submitTimerRef.current);
    };
  }, [submitted]);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!isNonEmpty(name)) errs.name = "Name is required";
    if (!isNonEmpty(email)) errs.email = "Email is required";
    else if (!isValidEmail(email)) errs.email = "Please enter a valid email";
    if (!isNonEmpty(message)) errs.message = "Message is required";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    }
  };

  return (
    <main>
      <header className="page-header">
        <h1>Support</h1>
        <p className="page-subtitle">View tickets and contact our team</p>
      </header>

      <section className="section">
        <Card title="Your Tickets">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Last Update</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="ticket-id">{ticket.id}</td>
                  <td>{ticket.subject}</td>
                  <td>
                    <Badge variant={statusVariant[ticket.status]}>{ticket.status}</Badge>
                  </td>
                  <td>
                    <Badge variant={priorityVariant[ticket.priority]}>{ticket.priority}</Badge>
                  </td>
                  <td>{formatDate(new Date(ticket.lastUpdate))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      <section className="section">
        {submitted && <Alert variant="success">Thank you! Your message has been sent.</Alert>}

        <Card title="Contact Us">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-fields">
              <Input
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                placeholder="Your name"
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="you@example.com"
              />
              <div>
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  id="message"
                  className={`form-textarea${errors.message ? " form-textarea--error" : ""}`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help?"
                  rows={4}
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <span role="alert" className="form-error">
                    {errors.message}
                  </span>
                )}
              </div>
              <Button type="submit" size="lg">
                Send Message
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </main>
  );
}
