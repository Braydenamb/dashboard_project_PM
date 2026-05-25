"use client";

import { create } from "zustand";
import type { MetricPoint } from "@/types/dashboard";

type DashboardState = {
  liveMultiplier: number;
  setLiveMultiplier: (value: number) => void;
  applyLiveSimulation: (points: MetricPoint[], tick: number) => MetricPoint[];
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  liveMultiplier: 1,
  setLiveMultiplier: (value) => set({ liveMultiplier: value }),
  applyLiveSimulation: (points, tick) => {
    const multiplier = get().liveMultiplier;
    const now = Date.now() + tick * 250;

    return points.map((point, index) => {
      const pulse = 1 + Math.sin(now / 4000 + index) * 0.02;
      const dynamic = multiplier * pulse;

      return {
        ...point,
        revenue: point.revenue * dynamic,
        mrr: point.mrr * dynamic,
        activeUsers: Math.round(point.activeUsers * dynamic),
      };
    });
  },
}));
