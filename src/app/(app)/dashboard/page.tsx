import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { MetricsCharts } from "@/components/dashboard/metrics-charts";
import { NotificationCenter } from "@/components/dashboard/notification-center";
import { UsersTable } from "@/components/dashboard/users-table";
import { getDashboardData } from "@/lib/data";

export default async function DashboardPage() {
  const { kpis, metricPoints, activityItems, notificationItems, dashboardUsers } =
    await getDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">AI Analytics Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Monitor product health, team productivity, and machine intelligence trends in real time.
        </p>
      </div>

      <KpiCards kpis={kpis} />
      <MetricsCharts points={metricPoints} />

      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <ActivityFeed items={activityItems} />
        <NotificationCenter notifications={notificationItems} />
      </section>

      <UsersTable initialUsers={dashboardUsers} />
    </div>
  );
}
