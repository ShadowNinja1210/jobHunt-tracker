"use client";

import { useState, useEffect } from "react";
import {
  getLeads,
  getApplications,
  getContacts,
  getTasks,
  getOffers,
  getInterviews,
} from "@/lib/db";
import type {
  Lead,
  Application,
  Contact,
  Task,
  Offer,
  Interview,
} from "@/lib/types";

interface JobData {
  leads: Lead[];
  applications: Application[];
  contacts: Contact[];
  tasks: Task[];
  offers: Offer[];
  interviews: Interview[];
}

export function useJobData() {
  const [data, setData] = useState<JobData>({
    leads: [],
    applications: [],
    contacts: [],
    tasks: [],
    offers: [],
    interviews: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setData({
      leads: getLeads(),
      applications: getApplications(),
      contacts: getContacts(),
      tasks: getTasks(),
      offers: getOffers(),
      interviews: getInterviews(),
    });
    setLoading(false);
  }, []);

  return { data, loading };
}
