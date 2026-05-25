import { Activity, BellRing, Rocket, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityItem } from "@/types/dashboard";

const iconByType: Record<string, React.ComponentType<{ className?: string }>> = {
  Deploy: Rocket,
  Alert: ShieldAlert,
  Incident: BellRing,
  Model: Activity,
};

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
        <CardDescription>Recent updates from your AI operations workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => {
            const Icon = iconByType[item.type] ?? Activity;
            return (
              <div key={item.id} className="flex gap-3 rounded-lg border p-3 transition hover:-translate-y-0.5">
                <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md">
                  <Icon className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{item.message}</p>
                  <p className="text-muted-foreground text-xs">
                    {item.userName} • {item.createdAt}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
