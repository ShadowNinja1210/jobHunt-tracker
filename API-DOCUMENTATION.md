# Job Hunt Tracker - Database Documentation

## Overview

This document provides complete specifications for the Job Hunt Tracker database schema, including all entities, relationships, field definitions, and API endpoints needed to build the backend.

The application manages a user's job search journey through 6 core entities: **Leads**, **Applications**, **Interviews**, **Contacts**, **Tasks**, and **Offers**.

---

## Database Schema

### 1. LEADS Table

Represents potential job opportunities before applying.

| Field         | Type        | Constraints | Description                                                                                                       |
| ------------- | ----------- | ----------- | ----------------------------------------------------------------------------------------------------------------- |
| `id`          | UUID/String | PRIMARY KEY | Unique identifier (format: `lead-{timestamp}`)                                                                    |
| `name`        | String      | NOT NULL    | Job opportunity name/title                                                                                        |
| `roleTitle`   | String      | NOT NULL    | Job role/position title                                                                                           |
| `companyName` | String      | NOT NULL    | Company name                                                                                                      |
| `source`      | String      | NOT NULL    | Where the lead came from (LinkedIn, job board, referral, etc.)                                                    |
| `listingUrl`  | String      | NULLABLE    | URL to job listing                                                                                                |
| `city`        | String      | NULLABLE    | Job location city                                                                                                 |
| `status`      | Enum        | NOT NULL    | Current stage: `new`, `researching`, `contacted`, `applied`, `interviewing`, `offer`, `closed-won`, `closed-lost` |
| `createdAt`   | DateTime    | NOT NULL    | Timestamp when lead was created                                                                                   |
| `updatedAt`   | DateTime    | NOT NULL    | Timestamp of last update                                                                                          |

**Indexes:**

- `status` (for filtering by stage)
- `companyName` (for searching)
- `createdAt` (for sorting)

**Relationships:**

- One Lead → Many Applications (via `leadId` in Applications table)

---

### 2. APPLICATIONS Table

Represents submitted job applications.

| Field             | Type        | Constraints  | Description                                                                        |
| ----------------- | ----------- | ------------ | ---------------------------------------------------------------------------------- |
| `id`              | UUID/String | PRIMARY KEY  | Unique identifier (format: `app-{timestamp}`)                                      |
| `leadId`          | UUID/String | NULLABLE, FK | Reference to Lead (if created from a lead)                                         |
| `companyName`     | String      | NOT NULL     | Company name                                                                       |
| `roleTitle`       | String      | NOT NULL     | Job role/position title                                                            |
| `applicationLink` | String      | NULLABLE     | URL to application or tracking link                                                |
| `city`            | String      | NULLABLE     | Job location city                                                                  |
| `workType`        | Enum        | NOT NULL     | Work arrangement: `remote`, `hybrid`, `onsite`                                     |
| `priority`        | Enum        | NOT NULL     | Priority level: `low`, `medium`, `high`                                            |
| `status`          | Enum        | NOT NULL     | Application stage: `applied`, `interviewing`, `offer`, `closed-won`, `closed-lost` |
| `lastFollowUp`    | DateTime    | NULLABLE     | Date of last follow-up communication                                               |
| `nextFollowUp`    | DateTime    | NULLABLE     | Scheduled date for next follow-up                                                  |
| `createdAt`       | DateTime    | NOT NULL     | Timestamp when application was created                                             |
| `updatedAt`       | DateTime    | NOT NULL     | Timestamp of last update                                                           |

**Indexes:**

- `status` (for Kanban view filtering)
- `priority` (for sorting)
- `companyName` (for searching)
- `nextFollowUp` (for follow-up reminders)
- `leadId` (for joining with leads)

**Relationships:**

- Many Applications → One Lead (via `leadId`)
- One Application → Many Interviews (via `applicationId` in Interviews table)
- One Application → One Offer (via `applicationId` in Offers table)

---

### 3. INTERVIEWS Table

Represents scheduled and completed interviews for applications.

| Field           | Type        | Constraints  | Description                                                             |
| --------------- | ----------- | ------------ | ----------------------------------------------------------------------- |
| `id`            | UUID/String | PRIMARY KEY  | Unique identifier (format: `interview-{timestamp}`)                     |
| `applicationId` | UUID/String | NOT NULL, FK | Reference to Application                                                |
| `round`         | Integer     | NOT NULL     | Interview round number (1, 2, 3, etc.)                                  |
| `type`          | Enum        | NOT NULL     | Interview type: `screen`, `technical`, `hr`, `onsite`                   |
| `dateTime`      | DateTime    | NULLABLE     | Scheduled date and time of interview                                    |
| `timezone`      | String      | NULLABLE     | Timezone for the interview (e.g., "America/New_York")                   |
| `interviewers`  | String[]    | NULLABLE     | Array of interviewer names                                              |
| `location`      | String      | NULLABLE     | Physical location or "Virtual"                                          |
| `meetingLink`   | String      | NULLABLE     | Video call link (Zoom, Teams, etc.)                                     |
| `notes`         | Text        | NULLABLE     | Interview notes and details                                             |
| `outcome`       | String      | NULLABLE     | Interview result (e.g., "Positive", "Negative", "Pending")              |
| `nextStep`      | String      | NULLABLE     | What happens next (e.g., "Wait for feedback", "Second round scheduled") |
| `createdAt`     | DateTime    | NOT NULL     | Timestamp when interview was created                                    |

**Indexes:**

- `applicationId` (for joining with applications)
- `dateTime` (for sorting by date)
- `type` (for filtering by interview type)

**Relationships:**

- Many Interviews → One Application (via `applicationId`)

**Auto-Generated Prep Checklist:**
Based on `type`, automatically generate prep items:

- **Screen**: Research company, Prepare elevator pitch, Review resume
- **Technical**: Review data structures, Practice coding problems, Test setup
- **HR**: Prepare questions, Research culture, Discuss salary expectations
- **Onsite**: Plan travel, Prepare presentation, Research team members

---

### 4. CONTACTS Table

Represents professional network and referral sources.

| Field                | Type        | Constraints | Description                                                                                       |
| -------------------- | ----------- | ----------- | ------------------------------------------------------------------------------------------------- |
| `id`                 | UUID/String | PRIMARY KEY | Unique identifier (format: `contact-{timestamp}`)                                                 |
| `name`               | String      | NOT NULL    | Contact's full name                                                                               |
| `role`               | String      | NULLABLE    | Job title/role                                                                                    |
| `company`            | String      | NULLABLE    | Company name                                                                                      |
| `email`              | String      | NULLABLE    | Email address                                                                                     |
| `linkedIn`           | String      | NULLABLE    | LinkedIn profile URL                                                                              |
| `relationship`       | String      | NULLABLE    | Relationship type: `recruiter`, `hiring-manager`, `current-employee`, `friend`, `mentor`, `other` |
| `notes`              | Text        | NULLABLE    | Additional notes about the contact                                                                |
| `linkedApplications` | String[]    | NULLABLE    | Array of Application IDs this contact is associated with                                          |
| `referralStatus`     | Enum        | NULLABLE    | Referral progress: `requested`, `sent`, `accepted`, `declined`, `completed`                       |
| `createdAt`          | DateTime    | NOT NULL    | Timestamp when contact was created                                                                |

**Indexes:**

- `company` (for searching by company)
- `relationship` (for filtering by type)
- `referralStatus` (for tracking referral progress)

**Relationships:**

- Many Contacts → Many Applications (via `linkedApplications` array)

---

### 5. TASKS Table

Represents follow-ups, reminders, and action items.

| Field           | Type        | Constraints              | Description                                                            |
| --------------- | ----------- | ------------------------ | ---------------------------------------------------------------------- |
| `id`            | UUID/String | PRIMARY KEY              | Unique identifier (format: `task-{timestamp}`)                         |
| `title`         | String      | NOT NULL                 | Task description                                                       |
| `type`          | Enum        | NOT NULL                 | Task type: `follow-up`, `send-materials`, `thank-you`, `prep`, `other` |
| `dueDate`       | DateTime    | NULLABLE                 | When the task is due                                                   |
| `priority`      | Enum        | NOT NULL                 | Priority level: `low`, `medium`, `high`                                |
| `relatedEntity` | UUID/String | NULLABLE                 | ID of related Lead, Application, or Contact                            |
| `completed`     | Boolean     | NOT NULL, DEFAULT: false | Whether task is completed                                              |
| `createdAt`     | DateTime    | NOT NULL                 | Timestamp when task was created                                        |

**Indexes:**

- `dueDate` (for sorting by urgency)
- `completed` (for filtering active/completed tasks)
- `priority` (for sorting)
- `relatedEntity` (for finding tasks related to specific entities)

**Relationships:**

- Many Tasks → One Lead/Application/Contact (via `relatedEntity`)

---

### 6. OFFERS Table

Represents job offers received.

| Field           | Type        | Constraints  | Description                                              |
| --------------- | ----------- | ------------ | -------------------------------------------------------- |
| `id`            | UUID/String | PRIMARY KEY  | Unique identifier (format: `offer-{timestamp}`)          |
| `applicationId` | UUID/String | NOT NULL, FK | Reference to Application                                 |
| `companyName`   | String      | NOT NULL     | Company name                                             |
| `roleTitle`     | String      | NOT NULL     | Job role/position title                                  |
| `ctc`           | Decimal     | NULLABLE     | Cost to Company (total compensation)                     |
| `base`          | Decimal     | NULLABLE     | Base salary                                              |
| `bonus`         | Decimal     | NULLABLE     | Annual bonus amount                                      |
| `equity`        | Decimal     | NULLABLE     | Equity percentage or number of shares                    |
| `benefits`      | Text        | NULLABLE     | Benefits description (health insurance, 401k, PTO, etc.) |
| `deadline`      | DateTime    | NULLABLE     | Offer expiration date                                    |
| `decision`      | String      | NULLABLE     | Decision status: `accepted`, `declined`, `pending`       |
| `notes`         | Text        | NULLABLE     | Additional offer details and negotiations                |
| `createdAt`     | DateTime    | NOT NULL     | Timestamp when offer was created                         |

**Indexes:**

- `applicationId` (for joining with applications)
- `deadline` (for sorting by urgency)
- `decision` (for filtering by status)

**Relationships:**

- Many Offers → One Application (via `applicationId`)

---

## Enums/Constants

### LeadStatus

\`\`\`
new, researching, contacted, applied, interviewing, offer, closed-won, closed-lost
\`\`\`

### ApplicationStatus

\`\`\`
applied, interviewing, offer, closed-won, closed-lost
\`\`\`

### WorkType

\`\`\`
remote, hybrid, onsite
\`\`\`

### Priority

\`\`\`
low, medium, high
\`\`\`

### InterviewType

\`\`\`
screen, technical, hr, onsite
\`\`\`

### ReferralStatus

\`\`\`
requested, sent, accepted, declined, completed
\`\`\`

### TaskType

\`\`\`
follow-up, send-materials, thank-you, prep, other
\`\`\`

---

## Database Setup Instructions

### Database choice: MongoDB (primary)

This project will use MongoDB as the primary production database. The local app currently includes a small localStorage-based helper in `lib/db.ts` for client-only usage and prototyping. For a server-backed API you should replace the local storage implementation with server-side API routes that connect to MongoDB.

The MongoDB connection string is stored in the environment variable `MONGODB_URI` in your `.env` file (example: `MONGODB_URI="mongodb+srv://user:pass@cluster0.example.mongodb.net/dbname"`). The repo includes a helper `lib/mongodb.ts` (server-side) that uses this value to create a single MongoClient instance and reuse it across requests.

Below are instructions and a recommended collection layout to map the previously defined SQL tables to MongoDB collections.

Collections mapping (suggested):

- leads -> collection `leads`
- applications -> collection `applications` (store `leadId` as ObjectId reference or string id)
- interviews -> collection `interviews` (store `applicationId`)
- contacts -> collection `contacts`
- tasks -> collection `tasks`
- offers -> collection `offers` (store `applicationId`)

Indexes to create (examples):

- leads: { status: 1 }, { companyName: 1 }, { createdAt: -1 }
- applications: { status: 1 }, { priority: 1 }, { nextFollowUp: 1 }, { leadId: 1 }
- interviews: { applicationId: 1 }, { dateTime: 1 }

Document shape: use the same field names specified above (e.g. `companyName`, `roleTitle`, `createdAt`) and use ISO-8601 strings or native Date objects in MongoDB for date fields.

Sample server-side connection (see `lib/mongodb.ts`):

```ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI not set in environment");

const client = new MongoClient(uri);
export async function connectToDatabase() {
  if (!client.isConnected?.()) await client.connect();
  return client;
}
```

Notes about IDs: In the original design the app uses string IDs like `lead-<timestamp>`. When migrating to MongoDB, prefer using ObjectId for relational semantics and smaller storage; if you want to preserve the same string format, store them in the `id` field and use a separate `_id` (or set `_id` to the string). Keep consistent references across collections.

### For PostgreSQL

\`\`\`sql
-- Create Leads table
CREATE TABLE leads (
id VARCHAR(50) PRIMARY KEY,
name VARCHAR(255) NOT NULL,
role_title VARCHAR(255) NOT NULL,
company_name VARCHAR(255) NOT NULL,
source VARCHAR(255) NOT NULL,
listing_url TEXT,
city VARCHAR(100),
status VARCHAR(50) NOT NULL CHECK (status IN ('new', 'researching', 'contacted', 'applied', 'interviewing', 'offer', 'closed-won', 'closed-lost')),
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_company ON leads(company_name);
CREATE INDEX idx_leads_created ON leads(created_at);

-- Create Applications table
CREATE TABLE applications (
id VARCHAR(50) PRIMARY KEY,
lead_id VARCHAR(50) REFERENCES leads(id) ON DELETE SET NULL,
company_name VARCHAR(255) NOT NULL,
role_title VARCHAR(255) NOT NULL,
application_link TEXT,
city VARCHAR(100),
work_type VARCHAR(50) NOT NULL CHECK (work_type IN ('remote', 'hybrid', 'onsite')),
priority VARCHAR(50) NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
status VARCHAR(50) NOT NULL CHECK (status IN ('applied', 'interviewing', 'offer', 'closed-won', 'closed-lost')),
last_follow_up TIMESTAMP,
next_follow_up TIMESTAMP,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_priority ON applications(priority);
CREATE INDEX idx_applications_company ON applications(company_name);
CREATE INDEX idx_applications_next_followup ON applications(next_follow_up);
CREATE INDEX idx_applications_lead ON applications(lead_id);

-- Create Interviews table
CREATE TABLE interviews (
id VARCHAR(50) PRIMARY KEY,
application_id VARCHAR(50) NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
round INTEGER NOT NULL,
type VARCHAR(50) NOT NULL CHECK (type IN ('screen', 'technical', 'hr', 'onsite')),
date_time TIMESTAMP,
timezone VARCHAR(100),
interviewers TEXT[],
location VARCHAR(255),
meeting_link TEXT,
notes TEXT,
outcome VARCHAR(255),
next_step VARCHAR(255),
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_interviews_application ON interviews(application_id);
CREATE INDEX idx_interviews_datetime ON interviews(date_time);
CREATE INDEX idx_interviews_type ON interviews(type);

-- Create Contacts table
CREATE TABLE contacts (
id VARCHAR(50) PRIMARY KEY,
name VARCHAR(255) NOT NULL,
role VARCHAR(255),
company VARCHAR(255),
email VARCHAR(255),
linkedin TEXT,
relationship VARCHAR(50),
notes TEXT,
linked_applications TEXT[],
referral_status VARCHAR(50) CHECK (referral_status IN ('requested', 'sent', 'accepted', 'declined', 'completed')),
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contacts_company ON contacts(company);
CREATE INDEX idx_contacts_relationship ON contacts(relationship);
CREATE INDEX idx_contacts_referral_status ON contacts(referral_status);

-- Create Tasks table
CREATE TABLE tasks (
id VARCHAR(50) PRIMARY KEY,
title VARCHAR(255) NOT NULL,
type VARCHAR(50) NOT NULL CHECK (type IN ('follow-up', 'send-materials', 'thank-you', 'prep', 'other')),
due_date TIMESTAMP,
priority VARCHAR(50) NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
related_entity VARCHAR(50),
completed BOOLEAN NOT NULL DEFAULT FALSE,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_related_entity ON tasks(related_entity);

-- Create Offers table
CREATE TABLE offers (
id VARCHAR(50) PRIMARY KEY,
application_id VARCHAR(50) NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
company_name VARCHAR(255) NOT NULL,
role_title VARCHAR(255) NOT NULL,
ctc DECIMAL(12, 2),
base DECIMAL(12, 2),
bonus DECIMAL(12, 2),
equity DECIMAL(10, 4),
benefits TEXT,
deadline TIMESTAMP,
decision VARCHAR(50),
notes TEXT,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_offers_application ON offers(application_id);
CREATE INDEX idx_offers_deadline ON offers(deadline);
CREATE INDEX idx_offers_decision ON offers(decision);
\`\`\`

### For MySQL

\`\`\`sql
-- Create Leads table
CREATE TABLE leads (
id VARCHAR(50) PRIMARY KEY,
name VARCHAR(255) NOT NULL,
role_title VARCHAR(255) NOT NULL,
company_name VARCHAR(255) NOT NULL,
source VARCHAR(255) NOT NULL,
listing_url LONGTEXT,
city VARCHAR(100),
status ENUM('new', 'researching', 'contacted', 'applied', 'interviewing', 'offer', 'closed-won', 'closed-lost') NOT NULL,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
INDEX idx_status (status),
INDEX idx_company (company_name),
INDEX idx_created (created_at)
);

-- Create Applications table
CREATE TABLE applications (
id VARCHAR(50) PRIMARY KEY,
lead_id VARCHAR(50),
company_name VARCHAR(255) NOT NULL,
role_title VARCHAR(255) NOT NULL,
application_link LONGTEXT,
city VARCHAR(100),
work_type ENUM('remote', 'hybrid', 'onsite') NOT NULL,
priority ENUM('low', 'medium', 'high') NOT NULL,
status ENUM('applied', 'interviewing', 'offer', 'closed-won', 'closed-lost') NOT NULL,
last_follow_up TIMESTAMP NULL,
next_follow_up TIMESTAMP NULL,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
INDEX idx_status (status),
INDEX idx_priority (priority),
INDEX idx_company (company_name),
INDEX idx_next_followup (next_follow_up),
INDEX idx_lead (lead_id)
);

-- Create Interviews table
CREATE TABLE interviews (
id VARCHAR(50) PRIMARY KEY,
application_id VARCHAR(50) NOT NULL,
round INT NOT NULL,
type ENUM('screen', 'technical', 'hr', 'onsite') NOT NULL,
date_time TIMESTAMP NULL,
timezone VARCHAR(100),
interviewers JSON,
location VARCHAR(255),
meeting_link LONGTEXT,
notes LONGTEXT,
outcome VARCHAR(255),
next_step VARCHAR(255),
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
INDEX idx_application (application_id),
INDEX idx_datetime (date_time),
INDEX idx_type (type)
);

-- Create Contacts table
CREATE TABLE contacts (
id VARCHAR(50) PRIMARY KEY,
name VARCHAR(255) NOT NULL,
role VARCHAR(255),
company VARCHAR(255),
email VARCHAR(255),
linkedin LONGTEXT,
relationship VARCHAR(50),
notes LONGTEXT,
linked_applications JSON,
referral_status ENUM('requested', 'sent', 'accepted', 'declined', 'completed'),
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
INDEX idx_company (company),
INDEX idx_relationship (relationship),
INDEX idx_referral_status (referral_status)
);

-- Create Tasks table
CREATE TABLE tasks (
id VARCHAR(50) PRIMARY KEY,
title VARCHAR(255) NOT NULL,
type ENUM('follow-up', 'send-materials', 'thank-you', 'prep', 'other') NOT NULL,
due_date TIMESTAMP NULL,
priority ENUM('low', 'medium', 'high') NOT NULL,
related_entity VARCHAR(50),
completed BOOLEAN NOT NULL DEFAULT FALSE,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
INDEX idx_due_date (due_date),
INDEX idx_completed (completed),
INDEX idx_priority (priority),
INDEX idx_related_entity (related_entity)
);

-- Create Offers table
CREATE TABLE offers (
id VARCHAR(50) PRIMARY KEY,
application_id VARCHAR(50) NOT NULL,
company_name VARCHAR(255) NOT NULL,
role_title VARCHAR(255) NOT NULL,
ctc DECIMAL(12, 2),
base DECIMAL(12, 2),
bonus DECIMAL(12, 2),
equity DECIMAL(10, 4),
benefits LONGTEXT,
deadline TIMESTAMP NULL,
decision VARCHAR(50),
notes LONGTEXT,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
INDEX idx_application (application_id),
INDEX idx_deadline (deadline),
INDEX idx_decision (decision)
);
\`\`\`

---

## API Endpoints

### Leads Endpoints

\`\`\`
GET /api/leads - Get all leads
POST /api/leads - Create new lead
GET /api/leads/:id - Get lead by ID
PUT /api/leads/:id - Update lead
DELETE /api/leads/:id - Delete lead
GET /api/leads?status=applied - Filter leads by status
\`\`\`

### Applications Endpoints

\`\`\`
GET /api/applications - Get all applications
POST /api/applications - Create new application
GET /api/applications/:id - Get application by ID
PUT /api/applications/:id - Update application
DELETE /api/applications/:id - Delete application
GET /api/applications?status=interviewing - Filter by status
GET /api/applications?priority=high - Filter by priority
GET /api/applications/lead/:leadId - Get applications for a lead
\`\`\`

### Interviews Endpoints

\`\`\`
GET /api/interviews - Get all interviews
POST /api/interviews - Create new interview
GET /api/interviews/:id - Get interview by ID
PUT /api/interviews/:id - Update interview
DELETE /api/interviews/:id - Delete interview
GET /api/interviews/application/:appId - Get interviews for application
GET /api/interviews/upcoming - Get upcoming interviews
GET /api/interviews/past - Get past interviews
\`\`\`

### Contacts Endpoints

\`\`\`
GET /api/contacts - Get all contacts
POST /api/contacts - Create new contact
GET /api/contacts/:id - Get contact by ID
PUT /api/contacts/:id - Update contact
DELETE /api/contacts/:id - Delete contact
GET /api/contacts?relationship=recruiter - Filter by relationship
GET /api/contacts?referralStatus=pending - Filter by referral status
\`\`\`

### Tasks Endpoints

\`\`\`
GET /api/tasks - Get all tasks
POST /api/tasks - Create new task
GET /api/tasks/:id - Get task by ID
PUT /api/tasks/:id - Update task
DELETE /api/tasks/:id - Delete task
GET /api/tasks?completed=false - Get active tasks
GET /api/tasks/overdue - Get overdue tasks
GET /api/tasks/due-today - Get tasks due today
PATCH /api/tasks/:id/complete - Mark task as complete
PATCH /api/tasks/:id/snooze?days=3 - Snooze task by N days
\`\`\`

### Offers Endpoints

\`\`\`
GET /api/offers - Get all offers
POST /api/offers - Create new offer
GET /api/offers/:id - Get offer by ID
PUT /api/offers/:id - Update offer
DELETE /api/offers/:id - Delete offer
GET /api/offers/application/:appId - Get offers for application
GET /api/offers/pending - Get pending offers
GET /api/offers/comparison - Get offers for comparison
\`\`\`

### Dashboard Endpoints

\`\`\`
GET /api/dashboard/stats - Get dashboard statistics
GET /api/dashboard/due-today - Get tasks and interviews due today
GET /api/dashboard/stalled - Get stalled applications
\`\`\`

### Data Export Endpoints

\`\`\`
GET /api/export/json - Export all data as JSON
GET /api/export/csv - Export data as CSV
GET /api/export/ics - Export interviews as ICS calendar
POST /api/import - Import data from JSON/CSV
\`\`\`

---

## Request/Response Examples

### Create Lead

\`\`\`json
POST /api/leads
{
"name": "Software Engineer - Backend",
"roleTitle": "Senior Backend Engineer",
"companyName": "TechCorp",
"source": "LinkedIn",
"listingUrl": "https://linkedin.com/jobs/...",
"city": "San Francisco, CA",
"status": "new"
}

Response (201):
{
"id": "lead-1729000000000",
"name": "Software Engineer - Backend",
"roleTitle": "Senior Backend Engineer",
"companyName": "TechCorp",
"source": "LinkedIn",
"listingUrl": "https://linkedin.com/jobs/...",
"city": "San Francisco, CA",
"status": "new",
"createdAt": "2024-10-26T10:00:00Z",
"updatedAt": "2024-10-26T10:00:00Z"
}
\`\`\`

### Create Application

\`\`\`json
POST /api/applications
{
"leadId": "lead-1729000000000",
"companyName": "TechCorp",
"roleTitle": "Senior Backend Engineer",
"applicationLink": "https://techcorp.com/careers/apply/123",
"city": "San Francisco, CA",
"workType": "hybrid",
"priority": "high",
"status": "applied",
"nextFollowUp": "2024-11-02T00:00:00Z"
}

Response (201):
{
"id": "app-1729000000001",
"leadId": "lead-1729000000000",
"companyName": "TechCorp",
"roleTitle": "Senior Backend Engineer",
"applicationLink": "https://techcorp.com/careers/apply/123",
"city": "San Francisco, CA",
"workType": "hybrid",
"priority": "high",
"status": "applied",
"lastFollowUp": null,
"nextFollowUp": "2024-11-02T00:00:00Z",
"createdAt": "2024-10-26T10:00:00Z",
"updatedAt": "2024-10-26T10:00:00Z"
}
\`\`\`

### Create Interview

\`\`\`json
POST /api/interviews
{
"applicationId": "app-1729000000001",
"round": 1,
"type": "screen",
"dateTime": "2024-10-30T14:00:00Z",
"timezone": "America/Los_Angeles",
"interviewers": ["John Smith", "Jane Doe"],
"location": "Virtual",
"meetingLink": "https://zoom.us/j/123456789",
"notes": "Phone screen with recruiter"
}

Response (201):
{
"id": "interview-1729000000002",
"applicationId": "app-1729000000001",
"round": 1,
"type": "screen",
"dateTime": "2024-10-30T14:00:00Z",
"timezone": "America/Los_Angeles",
"interviewers": ["John Smith", "Jane Doe"],
"location": "Virtual",
"meetingLink": "https://zoom.us/j/123456789",
"notes": "Phone screen with recruiter",
"outcome": null,
"nextStep": null,
"createdAt": "2024-10-26T10:00:00Z"
}
\`\`\`

### Create Offer

\`\`\`json
POST /api/offers
{
"applicationId": "app-1729000000001",
"companyName": "TechCorp",
"roleTitle": "Senior Backend Engineer",
"base": 180000,
"bonus": 30000,
"equity": 0.05,
"benefits": "Health insurance, 401k, 20 PTO days, remote flexibility",
"deadline": "2024-11-05T23:59:59Z",
"decision": "pending",
"notes": "Negotiated equity from 0.03 to 0.05"
}

Response (201):
{
"id": "offer-1729000000003",
"applicationId": "app-1729000000001",
"companyName": "TechCorp",
"roleTitle": "Senior Backend Engineer",
"ctc": 210000,
"base": 180000,
"bonus": 30000,
"equity": 0.05,
"benefits": "Health insurance, 401k, 20 PTO days, remote flexibility",
"deadline": "2024-11-05T23:59:59Z",
"decision": "pending",
"notes": "Negotiated equity from 0.03 to 0.05",
"createdAt": "2024-10-26T10:00:00Z"
}
\`\`\`

---

## Data Validation Rules

### Leads

- `name`, `roleTitle`, `companyName`, `source` are required
- `status` must be one of the defined enum values
- `listingUrl` must be a valid URL if provided

### Applications

- `companyName`, `roleTitle`, `workType`, `priority`, `status` are required
- `workType` must be: remote, hybrid, or onsite
- `priority` must be: low, medium, or high
- `status` must be: applied, interviewing, offer, closed-won, or closed-lost
- `nextFollowUp` must be in the future

### Interviews

- `applicationId`, `round`, `type` are required
- `round` must be a positive integer
- `type` must be: screen, technical, hr, or onsite
- `dateTime` must be a valid ISO 8601 timestamp if provided
- `timezone` should be a valid IANA timezone

### Contacts

- `name` is required
- `email` must be a valid email format if provided
- `linkedIn` must be a valid URL if provided
- `relationship` must be one of the defined enum values

### Tasks

- `title`, `type`, `priority` are required
- `type` must be: follow-up, send-materials, thank-you, prep, or other
- `priority` must be: low, medium, or high
- `dueDate` must be a valid ISO 8601 timestamp if provided

### Offers

- `applicationId`, `companyName`, `roleTitle` are required
- `base`, `bonus`, `equity` must be positive numbers if provided
- `deadline` must be in the future
- `decision` must be: accepted, declined, or pending

---

## Performance Considerations

1. **Pagination**: Implement pagination for list endpoints (default 20 items per page)
2. **Filtering**: Support multiple filter parameters (e.g., `?status=applied&priority=high`)
3. **Sorting**: Allow sorting by any indexed field (e.g., `?sort=createdAt&order=desc`)
4. **Search**: Implement full-text search on `companyName`, `roleTitle`, `name` fields
5. **Caching**: Cache dashboard statistics (refresh every 5 minutes)
6. **Batch Operations**: Support bulk create/update for imports

---

## Security Considerations

1. **Authentication**: Implement user authentication (JWT tokens recommended)
2. **Authorization**: Ensure users can only access their own data
3. **Input Validation**: Validate all inputs against the schema
4. **SQL Injection**: Use parameterized queries
5. **Rate Limiting**: Implement rate limiting on API endpoints
6. **CORS**: Configure CORS appropriately for frontend domain
7. **Data Encryption**: Encrypt sensitive fields (email, LinkedIn URLs) at rest

---

## Migration Path

If migrating from the current localStorage implementation to a backend database:

1. Export all data from localStorage as JSON
2. Create database tables using the SQL scripts above
3. Transform and import JSON data into database
4. Update frontend to call API endpoints instead of localStorage
5. Implement authentication and user isolation
6. Add data validation on backend
7. Set up monitoring and logging

---

## Notes

- All timestamps should be stored in UTC (ISO 8601 format)
- IDs are generated as `{entity-type}-{timestamp}` for simplicity; consider using UUIDs for production
- The `linkedApplications` array in Contacts is denormalized for performance; consider normalizing if needed
- Consider implementing soft deletes for audit trails
- Implement audit logging for all data modifications

---

## API docs & Swagger UI

A machine-readable OpenAPI spec is included at `public/openapi.json`. A simple Swagger UI page is available at `/api-docs` (implemented as a client page at `app/api-docs/page.tsx`) that points to the spec.

To view the interactive API docs locally:

1. Install runtime dependencies (one-time):

   - `swagger-ui-react` (client-side renderer for the OpenAPI JSON)
   - `mongodb` (server-side driver used by `lib/mongodb.ts`)

   Example (PowerShell):

   ```powershell
   npm install swagger-ui-react mongodb
   ```

2. Ensure your `.env` contains `MONGODB_URI` with a valid connection string. Example:

   ```properties
   MONGODB_URI="mongodb+srv://<user>:<pass>@cluster0.example.mongodb.net/mydatabase"
   ```

3. Start the Next.js dev server:

   ```powershell
   npm run dev
   ```

4. Open the docs at: `http://localhost:3000/api-docs`

Notes:

- The `openapi.json` spec is intentionally compact; expand it as you implement server routes.
- The project currently includes a client-side localStorage prototype (`lib/db.ts`). Replace or augment those functions with server-side API routes that use `lib/mongodb.ts` (server-only) to persist documents in your MongoDB database.
