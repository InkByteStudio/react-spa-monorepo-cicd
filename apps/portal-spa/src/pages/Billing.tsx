import { Card, Badge } from "@repo/shared-ui";
import { formatDate } from "@repo/shared-utils";
import { invoices } from "../data/mock-data";
import "./Billing.css";

const statusVariant = {
  paid: "success",
  pending: "warning",
  overdue: "error",
} as const;

export function Billing() {
  const totalBilled = invoices.reduce((sum, i) => sum + i.amount, 0);
  const outstanding = invoices
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <main>
      <header className="page-header">
        <h1>Billing</h1>
        <p className="page-subtitle">Manage invoices and payment history</p>
      </header>

      <div className="stats-grid billing-summary">
        <Card>
          <p className="stat-value">${totalBilled.toLocaleString()}</p>
          <p className="stat-label">Total Billed</p>
        </Card>
        <Card>
          <p className="stat-value">${outstanding.toLocaleString()}</p>
          <p className="stat-label">Outstanding Balance</p>
        </Card>
        <Card>
          <p className="stat-value">{invoices.length}</p>
          <p className="stat-label">Total Invoices</p>
        </Card>
      </div>

      <section className="section">
        <Card title="Invoice History">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="invoice-id">{invoice.id}</td>
                  <td>{formatDate(new Date(invoice.date))}</td>
                  <td>{invoice.description}</td>
                  <td>${invoice.amount.toLocaleString()}</td>
                  <td>
                    <Badge variant={statusVariant[invoice.status]}>{invoice.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>
    </main>
  );
}
