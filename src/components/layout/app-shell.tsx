import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export function AppShell({ children, userName }: { children: React.ReactNode; userName: string }) {
  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="hidden border-r md:block">
          <Sidebar />
        </aside>
        <main className="min-w-0">
          <Header userName={userName} />
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
