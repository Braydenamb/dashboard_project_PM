import { NextResponse } from "next/server";
import { getUsers } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const role = searchParams.get("role") ?? "all";

  const users = await getUsers(search, role);
  return NextResponse.json({ users });
}
