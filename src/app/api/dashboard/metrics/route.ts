import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/data";

export async function GET() {
  const { metricPoints, kpis } = await getDashboardData();
  return NextResponse.json({ metricPoints, kpis });
}
