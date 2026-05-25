import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/data";

export async function GET() {
  const { notificationItems } = await getDashboardData();
  return NextResponse.json({ notifications: notificationItems });
}
