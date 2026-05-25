export type MetricPoint = {
  date: string;
  revenue: number;
  mrr: number;
  churnRate: number;
  activeUsers: number;
  ticketsResolved: number;
  conversionRate: number;
};

export type DashboardKpi = {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
};

export type DashboardUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActiveAt: string;
};

export type ActivityItem = {
  id: number;
  type: string;
  message: string;
  userName: string;
  createdAt: string;
};

export type NotificationItem = {
  id: number;
  title: string;
  description: string;
  level: string;
  isRead: boolean;
  createdAt: string;
};
