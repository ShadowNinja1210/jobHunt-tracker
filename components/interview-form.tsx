"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Interview, Application } from "@/lib/types"

interface InterviewFormProps {
  interview?: Interview
  applications: Application[]
  onSubmit: (data: Omit<Interview, "id" | "createdAt">) => void
  onCancel: () => void
}

export function InterviewForm({ interview, applications, onSubmit, onCancel }: InterviewFormProps) {
  const [formData, setFormData] = useState({
    applicationId: interview?.applicationId || "",
    round: interview?.round || 1,
    type: interview?.type || "screen",
    dateTime: interview?.dateTime || "",
    timezone: interview?.timezone || "UTC",
    interviewers: interview?.interviewers?.join(", ") || "",
    location: interview?.location || "",
    meetingLink: interview?.meetingLink || "",
    notes: interview?.notes || "",
    outcome: interview?.outcome || "",
    nextStep: interview?.nextStep || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      round: Number.parseInt(formData.round.toString()),
      interviewers: formData.interviewers
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i),
    } as any)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Application</label>
        <select
          name="applicationId"
          value={formData.applicationId}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          required
        >
          <option value="">Select an application</option>
          {applications.map((app) => (
            <option key={app.id} value={app.id}>
              {app.companyName} - {app.roleTitle}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Round</label>
          <input
            type="number"
            name="round"
            value={formData.round}
            onChange={handleChange}
            min="1"
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          >
            <option value="screen">Phone Screen</option>
            <option value="technical">Technical</option>
            <option value="hr">HR</option>
            <option value="onsite">Onsite</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Date & Time</label>
          <input
            type="datetime-local"
            name="dateTime"
            value={formData.dateTime}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
          <input
            type="text"
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            placeholder="e.g., PST, EST"
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Interviewers (comma-separated)</label>
        <input
          type="text"
          name="interviewers"
          value={formData.interviewers}
          onChange={handleChange}
          placeholder="e.g., John Smith, Jane Doe"
          className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Office, Virtual"
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Meeting Link</label>
          <input
            type="url"
            name="meetingLink"
            value={formData.meetingLink}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Interview notes, topics to discuss..."
          rows={3}
          className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Outcome</label>
          <input
            type="text"
            name="outcome"
            value={formData.outcome}
            onChange={handleChange}
            placeholder="e.g., Positive, Needs improvement"
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Next Step</label>
          <input
            type="text"
            name="nextStep"
            value={formData.nextStep}
            onChange={handleChange}
            placeholder="e.g., Technical round, Offer"
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {interview ? "Update Interview" : "Schedule Interview"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Cancel
        </Button>
      </div>
    </form>
  )
}
