export interface Project {
  id: string;
  name: string;
  status: "active" | "completed" | "on-hold";
  progress: number;
  dueDate: string;
  teamSize: number;
  tasksCompleted: number;
  tasksTotal: number;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  description: string;
}

export interface Activity {
  id: string;
  action: string;
  target: string;
  timestamp: Date;
}

export interface Ticket {
  id: string;
  subject: string;
  status: "open" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  createdAt: string;
  lastUpdate: string;
}

export interface Account {
  name: string;
  email: string;
  company: string;
  plan: string;
  avatarInitials: string;
}

export const projects: Project[] = [
  {
    id: "PRJ-001",
    name: "Website Redesign",
    status: "active",
    progress: 65,
    dueDate: "2026-04-15",
    teamSize: 5,
    tasksCompleted: 26,
    tasksTotal: 40,
  },
  {
    id: "PRJ-002",
    name: "Mobile App MVP",
    status: "active",
    progress: 30,
    dueDate: "2026-06-01",
    teamSize: 8,
    tasksCompleted: 12,
    tasksTotal: 40,
  },
  {
    id: "PRJ-003",
    name: "API Integration",
    status: "completed",
    progress: 100,
    dueDate: "2026-02-28",
    teamSize: 3,
    tasksCompleted: 18,
    tasksTotal: 18,
  },
  {
    id: "PRJ-004",
    name: "Q1 Analytics Report",
    status: "on-hold",
    progress: 45,
    dueDate: "2026-04-30",
    teamSize: 2,
    tasksCompleted: 9,
    tasksTotal: 20,
  },
  {
    id: "PRJ-005",
    name: "User Onboarding Flow",
    status: "active",
    progress: 80,
    dueDate: "2026-03-25",
    teamSize: 4,
    tasksCompleted: 16,
    tasksTotal: 20,
  },
  {
    id: "PRJ-006",
    name: "Payment Gateway Migration",
    status: "active",
    progress: 15,
    dueDate: "2026-05-20",
    teamSize: 3,
    tasksCompleted: 3,
    tasksTotal: 20,
  },
];

export const invoices: Invoice[] = [
  {
    id: "INV-1042",
    date: "2026-03-01",
    amount: 2400.0,
    status: "paid",
    description: "Pro Plan — March 2026",
  },
  {
    id: "INV-1035",
    date: "2026-02-01",
    amount: 2400.0,
    status: "paid",
    description: "Pro Plan — February 2026",
  },
  {
    id: "INV-1028",
    date: "2026-01-01",
    amount: 1800.0,
    status: "paid",
    description: "Team Plan — January 2026",
  },
  {
    id: "INV-1049",
    date: "2026-04-01",
    amount: 2400.0,
    status: "pending",
    description: "Pro Plan — April 2026",
  },
  {
    id: "INV-1021",
    date: "2025-12-01",
    amount: 1800.0,
    status: "overdue",
    description: "Team Plan — December 2025",
  },
  {
    id: "INV-1014",
    date: "2025-11-01",
    amount: 1800.0,
    status: "paid",
    description: "Team Plan — November 2025",
  },
];

const now = new Date();

export const activities: Activity[] = [
  {
    id: "act-1",
    action: "completed task",
    target: "Update landing page hero section",
    timestamp: new Date(now.getTime() - 12 * 60 * 1000),
  },
  {
    id: "act-2",
    action: "created project",
    target: "Payment Gateway Migration",
    timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
  },
  {
    id: "act-3",
    action: "paid invoice",
    target: "INV-1042",
    timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000),
  },
  {
    id: "act-4",
    action: "added team member to",
    target: "Mobile App MVP",
    timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "act-5",
    action: "submitted ticket",
    target: "Export CSV not working",
    timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "act-6",
    action: "completed task",
    target: "Set up CI/CD pipeline",
    timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "act-7",
    action: "updated project status for",
    target: "API Integration",
    timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "act-8",
    action: "uploaded file to",
    target: "Q1 Analytics Report",
    timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
  },
];

export const tickets: Ticket[] = [
  {
    id: "TKT-301",
    subject: "Export CSV not working for large datasets",
    status: "open",
    priority: "high",
    createdAt: "2026-03-15",
    lastUpdate: "2026-03-16",
  },
  {
    id: "TKT-298",
    subject: "Dashboard chart not loading on Safari",
    status: "in-progress",
    priority: "medium",
    createdAt: "2026-03-12",
    lastUpdate: "2026-03-15",
  },
  {
    id: "TKT-295",
    subject: "Request to increase storage limit",
    status: "open",
    priority: "low",
    createdAt: "2026-03-10",
    lastUpdate: "2026-03-10",
  },
  {
    id: "TKT-290",
    subject: "Two-factor authentication setup issue",
    status: "resolved",
    priority: "high",
    createdAt: "2026-03-05",
    lastUpdate: "2026-03-08",
  },
  {
    id: "TKT-287",
    subject: "Notification emails arriving late",
    status: "resolved",
    priority: "medium",
    createdAt: "2026-03-01",
    lastUpdate: "2026-03-04",
  },
];

export const account: Account = {
  name: "Sarah Chen",
  email: "sarah.chen@acmecorp.com",
  company: "Acme Corp",
  plan: "Pro",
  avatarInitials: "SC",
};
