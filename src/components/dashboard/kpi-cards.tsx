import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardKpi } from "@/types/dashboard";

export function KpiCards({ kpis }: { kpis: DashboardKpi[] }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="animate-in fade-in-50">
          <CardHeader>
            <CardDescription>{kpi.title}</CardDescription>
            {kpi.trend === "up" ? (
              <ArrowUpRight className="text-emerald-500 size-4" />
            ) : (
              <ArrowDownRight className="text-rose-500 size-4" />
            )}
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl tracking-tight">{kpi.value}</CardTitle>
            <p className="text-muted-foreground text-xs">{kpi.change} from previous period</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
