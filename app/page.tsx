"use client";

import { useState } from "react";
import { Dashboard } from "@/components/dashboard";
import { Navigation } from "@/components/navigation";
import { useJobData } from "@/hooks/use-job-data";
import { Leads } from "@/components/leads";
import { Applications } from "@/components/applications";
import { Interviews } from "@/components/interviews";
import { Contacts } from "@/components/contacts";
import { Tasks } from "@/components/tasks";
import { Offers } from "@/components/offers";

export default function Home() {
  const { data, loading } = useJobData();
  const [currentView, setCurrentView] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <main className="ml-64 p-8">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        ) : (
          <>
            {currentView === "dashboard" && <Dashboard data={data} />}
            {currentView === "leads" && <Leads data={data} />}
            {currentView === "applications" && <Applications data={data} />}
            {currentView === "interviews" && <Interviews data={data} />}
            {currentView === "contacts" && <Contacts data={data} />}
            {currentView === "tasks" && <Tasks data={data} />}
            {currentView === "offers" && <Offers data={data} />}
          </>
        )}
      </main>
    </div>
  );
}
