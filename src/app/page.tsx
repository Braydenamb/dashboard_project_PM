import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAuthenticatedToken } from "@/lib/auth";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("dashboard_session")?.value;

  if (isAuthenticatedToken(token)) {
    redirect("/dashboard");
  }

  redirect("/login");
}
