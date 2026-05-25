import { BellDot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { NotificationItem } from "@/types/dashboard";

function levelVariant(level: string): "default" | "success" | "warning" {
  if (level === "success") return "success";
  if (level === "warning") return "warning";
  return "default";
}

export function NotificationCenter({ notifications }: { notifications: NotificationItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Center</CardTitle>
        <CardDescription>Latest system and team notifications.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="rounded-lg border p-3">
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{notification.title}</p>
                <Badge variant={levelVariant(notification.level)}>{notification.level}</Badge>
              </div>
              <p className="text-muted-foreground text-xs">{notification.description}</p>
              <div className="text-muted-foreground mt-2 flex items-center gap-1 text-xs">
                <BellDot className="size-3" /> {notification.createdAt}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
