"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const [autoAlerts, setAutoAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const onSave = () => {
    setSavedAt(new Date().toLocaleTimeString());
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage dashboard behavior and notification preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workspace Preferences</CardTitle>
          <CardDescription>Local demo settings are saved in memory.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workspace">Workspace name</Label>
            <Input id="workspace" defaultValue="Aether Analytics" />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="font-medium">Auto anomaly alerts</p>
              <p className="text-muted-foreground text-xs">Enable automatic alerting when KPI thresholds drift.</p>
            </div>
            <Switch checked={autoAlerts} onCheckedChange={setAutoAlerts} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="font-medium">Daily digest email</p>
              <p className="text-muted-foreground text-xs">Receive a daily summary at 8:00 AM.</p>
            </div>
            <Switch checked={dailyDigest} onCheckedChange={setDailyDigest} />
          </div>
          <div className="space-y-2">
            <Button onClick={onSave}>Save preferences</Button>
            {savedAt ? (
              <p className="text-muted-foreground text-xs">Preferences saved at {savedAt}</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
