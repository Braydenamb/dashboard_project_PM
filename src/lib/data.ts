import { formatDistanceToNow } from "date-fns";
import { prisma } from "@/lib/prisma";
import type {
  ActivityItem,
  DashboardKpi,
  DashboardUser,
  MetricPoint,
  NotificationItem,
} from "@/types/dashboard";

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export async function getDashboardData() {
  const [metrics, activities, notifications, users] = await Promise.all([
    prisma.metricSnapshot.findMany({
      orderBy: { date: "asc" },
      take: 30,
    }),
    prisma.activity.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.user.findMany({
      orderBy: { lastActiveAt: "desc" },
      take: 12,
    }),
  ]);

  const latest = metrics.at(-1);
  const previous = metrics.at(-2) ?? latest;

  const percentDelta = (current: number, prev: number) => {
    if (!prev) return "0%";
    const value = ((current - prev) / prev) * 100;
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  const kpis: DashboardKpi[] = latest
    ? [
        {
          title: "Monthly Revenue",
          value: formatCompactCurrency(latest.revenue),
          change: percentDelta(latest.revenue, previous?.revenue ?? latest.revenue),
          trend: latest.revenue >= (previous?.revenue ?? latest.revenue) ? "up" : "down",
        },
        {
          title: "MRR",
          value: formatCompactCurrency(latest.mrr),
          change: percentDelta(latest.mrr, previous?.mrr ?? latest.mrr),
          trend: latest.mrr >= (previous?.mrr ?? latest.mrr) ? "up" : "down",
        },
        {
          title: "Churn Rate",
          value: `${latest.churnRate.toFixed(2)}%`,
          change: percentDelta(latest.churnRate, previous?.churnRate ?? latest.churnRate),
          trend: latest.churnRate <= (previous?.churnRate ?? latest.churnRate) ? "up" : "down",
        },
        {
          title: "Active Users",
          value: latest.activeUsers.toLocaleString("en-US"),
          change: percentDelta(latest.activeUsers, previous?.activeUsers ?? latest.activeUsers),
          trend: latest.activeUsers >= (previous?.activeUsers ?? latest.activeUsers) ? "up" : "down",
        },
      ]
    : [];

  const metricPoints: MetricPoint[] = metrics.map((metric) => ({
    date: metric.date.toISOString(),
    revenue: metric.revenue,
    mrr: metric.mrr,
    churnRate: metric.churnRate,
    activeUsers: metric.activeUsers,
    ticketsResolved: metric.ticketsResolved,
    conversionRate: metric.conversionRate,
  }));

  const activityItems: ActivityItem[] = activities.map((activity) => ({
    id: activity.id,
    type: activity.type,
    message: activity.message,
    userName: activity.user?.name ?? "System",
    createdAt: formatDistanceToNow(activity.createdAt, { addSuffix: true }),
  }));

  const notificationItems: NotificationItem[] = notifications.map((notification) => ({
    id: notification.id,
    title: notification.title,
    description: notification.description,
    level: notification.level,
    isRead: notification.isRead,
    createdAt: formatDistanceToNow(notification.createdAt, { addSuffix: true }),
  }));

  const dashboardUsers: DashboardUser[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    lastActiveAt: formatDistanceToNow(user.lastActiveAt, { addSuffix: true }),
  }));

  return {
    kpis,
    metricPoints,
    activityItems,
    notificationItems,
    dashboardUsers,
  };
}

export async function getUsers(search = "", role = "all") {
  const validRoles = new Set(["ADMIN", "ANALYST", "SUPPORT"]);
  const normalizedRole = validRoles.has(role) ? role : "all";

  const users = await prisma.user.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search } },
                { email: { contains: search } },
              ],
            }
          : {},
        normalizedRole !== "all"
          ? { role: normalizedRole as "ADMIN" | "ANALYST" | "SUPPORT" }
          : {},
      ],
    },
    orderBy: { lastActiveAt: "desc" },
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    lastActiveAt: formatDistanceToNow(user.lastActiveAt, { addSuffix: true }),
  }));
}
