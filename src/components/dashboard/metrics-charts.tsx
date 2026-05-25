"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useDashboardStore } from "@/store/dashboard-store";
import type { MetricPoint } from "@/types/dashboard";

function formatYAxisValue(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}m`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}k`;
  return `$${Math.round(value)}`;
}

export function MetricsCharts({ points }: { points: MetricPoint[] }) {
  const [liveMode, setLiveMode] = useState(true);
  const [tick, setTick] = useState(0);
  const { applyLiveSimulation, setLiveMultiplier } = useDashboardStore();

  useEffect(() => {
    setLiveMultiplier(liveMode ? 1.02 : 1);
  }, [liveMode, setLiveMultiplier]);

  useEffect(() => {
    if (!liveMode) return;
    const interval = setInterval(() => setTick((value) => value + 1), 2500);
    return () => clearInterval(interval);
  }, [liveMode]);

  const chartData = (() => {
    const basePoints = liveMode ? applyLiveSimulation(points, tick) : points;
    return basePoints.map((point) => ({
      ...point,
      label: format(new Date(point.date), "MMM d"),
    }));
  })();

  return (
    <section className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Revenue & MRR Trends</CardTitle>
            <CardDescription>Live trend simulation updates every few seconds.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">Realtime</span>
            <Switch checked={liveMode} onCheckedChange={setLiveMode} />
          </div>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => formatYAxisValue(value)} width={64} />
              <Tooltip
                formatter={(value) =>
                  typeof value === "number" ? `$${value.toLocaleString()}` : value
                }
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-primary)"
                fill="url(#revenueGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="mrr"
                stroke="var(--color-chart-2)"
                fill="transparent"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Operational Throughput</CardTitle>
          <CardDescription>Tickets resolved over the past 30 days.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ticketsResolved" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </section>
  );
}
