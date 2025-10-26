// Local storage database layer for job hunt tracker
import type {
  Lead,
  Application,
  Interview,
  Contact,
  Task,
  Offer,
} from "@/lib/types";

const DB_VERSION = 1;
const DB_NAME = "job-hunt-tracker";

interface Database {
  leads: Lead[];
  applications: Application[];
  interviews: Interview[];
  contacts: Contact[];
  tasks: Task[];
  offers: Offer[];
}

const defaultDB: Database = {
  leads: [],
  applications: [],
  interviews: [],
  contacts: [],
  tasks: [],
  offers: [],
};

export function initializeDB(): Database {
  if (typeof window === "undefined") return defaultDB;

  const stored = localStorage.getItem(DB_NAME);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultDB;
    }
  }
  return defaultDB;
}

export function saveDB(db: Database): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DB_NAME, JSON.stringify(db));
}

export function getDB(): Database {
  if (typeof window === "undefined") return defaultDB;
  return initializeDB();
}

// Lead operations
export function addLead(
  lead: Omit<Lead, "id" | "createdAt" | "updatedAt">
): Lead {
  const db = getDB();
  const newLead: Lead = {
    ...lead,
    id: `lead-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.leads.push(newLead);
  saveDB(db);
  return newLead;
}

export function updateLead(id: string, updates: Partial<Lead>): Lead | null {
  const db = getDB();
  const lead = db.leads.find((l) => l.id === id);
  if (!lead) return null;

  const updated = { ...lead, ...updates, updatedAt: new Date().toISOString() };
  db.leads = db.leads.map((l) => (l.id === id ? updated : l));
  saveDB(db);
  return updated;
}

export function getLeads(): Lead[] {
  return getDB().leads;
}

// Application operations
export function addApplication(
  app: Omit<Application, "id" | "createdAt" | "updatedAt">
): Application {
  const db = getDB();
  const newApp: Application = {
    ...app,
    id: `app-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.applications.push(newApp);
  saveDB(db);
  return newApp;
}

export function updateApplication(
  id: string,
  updates: Partial<Application>
): Application | null {
  const db = getDB();
  const app = db.applications.find((a) => a.id === id);
  if (!app) return null;

  const updated = { ...app, ...updates, updatedAt: new Date().toISOString() };
  db.applications = db.applications.map((a) => (a.id === id ? updated : a));
  saveDB(db);
  return updated;
}

export function getApplications(): Application[] {
  return getDB().applications;
}

// Contact operations
export function addContact(
  contact: Omit<Contact, "id" | "createdAt">
): Contact {
  const db = getDB();
  const newContact: Contact = {
    ...contact,
    id: `contact-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.contacts.push(newContact);
  saveDB(db);
  return newContact;
}

export function updateContact(
  id: string,
  updates: Partial<Contact>
): Contact | null {
  const db = getDB();
  const contact = db.contacts.find((c) => c.id === id);
  if (!contact) return null;

  const updated = { ...contact, ...updates };
  db.contacts = db.contacts.map((c) => (c.id === id ? updated : c));
  saveDB(db);
  return updated;
}

export function getContacts(): Contact[] {
  return getDB().contacts;
}

// Task operations
export function addTask(task: Omit<Task, "id" | "createdAt">): Task {
  const db = getDB();
  const newTask: Task = {
    ...task,
    id: `task-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.tasks.push(newTask);
  saveDB(db);
  return newTask;
}

export function updateTask(id: string, updates: Partial<Task>): Task | null {
  const db = getDB();
  const task = db.tasks.find((t) => t.id === id);
  if (!task) return null;

  const updated = { ...task, ...updates };
  db.tasks = db.tasks.map((t) => (t.id === id ? updated : t));
  saveDB(db);
  return updated;
}

export function getTasks(): Task[] {
  return getDB().tasks;
}

// Offer operations
export function addOffer(offer: Omit<Offer, "id" | "createdAt">): Offer {
  const db = getDB();
  const newOffer: Offer = {
    ...offer,
    id: `offer-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.offers.push(newOffer);
  saveDB(db);
  return newOffer;
}

export function updateOffer(id: string, updates: Partial<Offer>): Offer | null {
  const db = getDB();
  const offer = db.offers.find((o) => o.id === id);
  if (!offer) return null;

  const updated = { ...offer, ...updates };
  db.offers = db.offers.map((o) => (o.id === id ? updated : o));
  saveDB(db);
  return updated;
}

export function getOffers(): Offer[] {
  return getDB().offers;
}

// Interview operations
export function addInterview(
  interview: Omit<Interview, "id" | "createdAt">
): Interview {
  const db = getDB();
  const newInterview: Interview = {
    ...interview,
    id: `interview-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.interviews.push(newInterview);
  saveDB(db);
  return newInterview;
}

export function updateInterview(
  id: string,
  updates: Partial<Interview>
): Interview | null {
  const db = getDB();
  const interview = db.interviews.find((i) => i.id === id);
  if (!interview) return null;

  const updated = { ...interview, ...updates };
  db.interviews = db.interviews.map((i) => (i.id === id ? updated : i));
  saveDB(db);
  return updated;
}

export function getInterviews(): Interview[] {
  return getDB().interviews;
}

export function getInterviewsByApplication(applicationId: string): Interview[] {
  return getDB().interviews.filter((i) => i.applicationId === applicationId);
}
