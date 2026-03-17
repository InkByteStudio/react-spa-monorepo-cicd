export interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  status: "active" | "inactive";
  lastLogin: Date;
  joinedAt: string;
}

export interface PlatformStats {
  totalUsers: number;
  activeProjects: number;
  storageUsedGb: number;
  storageLimitGb: number;
  monthlyRevenue: number;
  supportTicketsOpen: number;
}

export interface AdminActivity {
  id: string;
  user: string;
  action: string;
  timestamp: Date;
}

export interface AdminProject {
  id: string;
  name: string;
  owner: string;
  status: "active" | "completed" | "on-hold";
  createdAt: string;
  teamSize: number;
}

const now = new Date();

export const users: User[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Admin",
    status: "active",
    lastLogin: new Date(now.getTime() - 10 * 60 * 1000),
    joinedAt: "2024-06-15",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    role: "Editor",
    status: "active",
    lastLogin: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    joinedAt: "2024-08-22",
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol@example.com",
    role: "Viewer",
    status: "active",
    lastLogin: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    joinedAt: "2025-01-10",
  },
  {
    id: 4,
    name: "Dave Wilson",
    email: "dave@example.com",
    role: "Editor",
    status: "active",
    lastLogin: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    joinedAt: "2025-02-14",
  },
  {
    id: 5,
    name: "Eva Martinez",
    email: "eva@example.com",
    role: "Admin",
    status: "active",
    lastLogin: new Date(now.getTime() - 30 * 60 * 1000),
    joinedAt: "2024-11-03",
  },
  {
    id: 6,
    name: "Frank Lee",
    email: "frank@example.com",
    role: "Viewer",
    status: "inactive",
    lastLogin: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    joinedAt: "2024-09-18",
  },
  {
    id: 7,
    name: "Grace Kim",
    email: "grace@example.com",
    role: "Editor",
    status: "active",
    lastLogin: new Date(now.getTime() - 5 * 60 * 60 * 1000),
    joinedAt: "2025-03-01",
  },
  {
    id: 8,
    name: "Henry Patel",
    email: "henry@example.com",
    role: "Viewer",
    status: "inactive",
    lastLogin: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
    joinedAt: "2025-01-25",
  },
];

export const platformStats: PlatformStats = {
  totalUsers: 142,
  activeProjects: 23,
  storageUsedGb: 4.2,
  storageLimitGb: 10,
  monthlyRevenue: 12800,
  supportTicketsOpen: 7,
};

export const adminActivities: AdminActivity[] = [
  {
    id: "aa-1",
    user: "Alice Johnson",
    action: "created project 'Payment Gateway Migration'",
    timestamp: new Date(now.getTime() - 15 * 60 * 1000),
  },
  {
    id: "aa-2",
    user: "Bob Smith",
    action: "updated billing info for Acme Corp",
    timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000),
  },
  {
    id: "aa-3",
    user: "Eva Martinez",
    action: "resolved ticket TKT-298",
    timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000),
  },
  {
    id: "aa-4",
    user: "Grace Kim",
    action: "added user Henry Patel",
    timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000),
  },
  {
    id: "aa-5",
    user: "Carol Davis",
    action: "exported Q1 analytics report",
    timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "aa-6",
    user: "Dave Wilson",
    action: "deployed website redesign v2.1",
    timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "aa-7",
    user: "Alice Johnson",
    action: "updated system notification settings",
    timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
  },
];

export const adminProjects: AdminProject[] = [
  {
    id: "PRJ-001",
    name: "Website Redesign",
    owner: "Sarah Chen",
    status: "active",
    createdAt: "2025-11-10",
    teamSize: 5,
  },
  {
    id: "PRJ-002",
    name: "Mobile App MVP",
    owner: "Sarah Chen",
    status: "active",
    createdAt: "2026-01-15",
    teamSize: 8,
  },
  {
    id: "PRJ-003",
    name: "API Integration",
    owner: "Marcus Brown",
    status: "completed",
    createdAt: "2025-10-05",
    teamSize: 3,
  },
  {
    id: "PRJ-004",
    name: "Q1 Analytics Report",
    owner: "Sarah Chen",
    status: "on-hold",
    createdAt: "2026-02-01",
    teamSize: 2,
  },
  {
    id: "PRJ-005",
    name: "User Onboarding Flow",
    owner: "Lisa Wang",
    status: "active",
    createdAt: "2026-01-20",
    teamSize: 4,
  },
  {
    id: "PRJ-006",
    name: "Payment Gateway Migration",
    owner: "Sarah Chen",
    status: "active",
    createdAt: "2026-03-10",
    teamSize: 3,
  },
  {
    id: "PRJ-007",
    name: "Customer Dashboard v2",
    owner: "Marcus Brown",
    status: "active",
    createdAt: "2026-02-20",
    teamSize: 6,
  },
  {
    id: "PRJ-008",
    name: "Data Export Tool",
    owner: "Lisa Wang",
    status: "completed",
    createdAt: "2025-09-01",
    teamSize: 2,
  },
];
