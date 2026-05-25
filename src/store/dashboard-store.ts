"use client";

import { create } from "zustand";
import type { MetricPoint } from "@/types/dashboard";

type DashboardState = {
  liveMultiplier: number;
  setLiveMultiplier: (value: number) => void;
  applyLiveSimulation: (points: MetricPoint[]) => MetricPoint[];
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  liveMultiplier: 1,
  setLiveMultiplier: (value) => set({ liveMultiplier: value }),
  applyLiveSimulation: (points) => {
    const multiplier = get().liveMultiplier;
    const now = Date.now();

    return points.map((point, index) => {
      const pulse = 1 + Math.sin((now / 4000 + index) % (Math.PI * 2)) * 0.02;
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
