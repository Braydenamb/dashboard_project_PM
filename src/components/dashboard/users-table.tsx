"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DashboardUser } from "@/types/dashboard";

const roleOptions = ["all", "ADMIN", "ANALYST", "SUPPORT"];

export function UsersTable({ initialUsers }: { initialUsers: DashboardUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (role !== "all") params.set("role", role);

      const response = await fetch(`/api/users?${params.toString()}`);
      if (!response.ok) {
        setError("Unable to load users. Please try again.");
        return;
      }
      const data = (await response.json()) as { users: DashboardUser[] };
      setError(null);
      setUsers(data.users);
    }, 250);

    return () => clearTimeout(timeout);
  }, [search, role]);

  const filteredCount = useMemo(() => users.length, [users]);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>User Management</CardTitle>
          <CardDescription>{filteredCount} team members match filters.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-3 size-4" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9"
              placeholder="Search name or email"
            />
          </div>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
          >
            {roleOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All roles" : option}
              </option>
            ))}
          </select>
        </div>
        {error ? <p className="mb-3 text-sm text-rose-500">{error}</p> : null}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Last active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Active" ? "success" : "warning"}>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">{user.lastActiveAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
