export type LeadStatus =
  | "new"
  | "researching"
  | "contacted"
  | "applied"
  | "interviewing"
  | "offer"
  | "closed-won"
  | "closed-lost";
export type ApplicationStatus =
  | "applied"
  | "interviewing"
  | "offer"
  | "closed-won"
  | "closed-lost";
export type WorkType = "remote" | "hybrid" | "onsite";
export type Priority = "low" | "medium" | "high";
export type InterviewType = "screen" | "technical" | "hr" | "onsite";
export type ReferralStatus =
  | "requested"
  | "sent"
  | "accepted"
  | "declined"
  | "completed";
export type TaskType =
  | "follow-up"
  | "send-materials"
  | "thank-you"
  | "prep"
  | "other";

export interface Lead {
  id: string;
  name: string;
  roleTitle: string;
  companyName: string;
  source: string;
  listingUrl?: string;
  city?: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  leadId?: string;
  companyName: string;
  roleTitle: string;
  applicationLink?: string;
  city?: string;
  workType: WorkType;
  priority: Priority;
  status: ApplicationStatus;
  lastFollowUp?: string;
  nextFollowUp?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  round: number;
  type: InterviewType;
  dateTime?: string;
  timezone?: string;
  interviewers?: string[];
  location?: string;
  meetingLink?: string;
  notes?: string;
  outcome?: string;
  nextStep?: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  role?: string;
  company?: string;
  email?: string;
  linkedIn?: string;
  relationship?: string;
  notes?: string;
  linkedApplications?: string[];
  referralStatus?: ReferralStatus;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  dueDate?: string;
  priority: Priority;
  relatedEntity?: string; // ID of lead/application/contact
  completed: boolean;
  createdAt: string;
}

export interface Offer {
  id: string;
  applicationId: string;
  companyName: string;
  roleTitle: string;
  ctc?: number;
  base?: number;
  bonus?: number;
  equity?: number;
  benefits?: string;
  deadline?: string;
  decision?: string;
  notes?: string;
  createdAt: string;
}
