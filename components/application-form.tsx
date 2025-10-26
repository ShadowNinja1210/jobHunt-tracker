"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Application } from "@/lib/types"

interface ApplicationFormProps {
  application?: Application
  onSubmit: (data: Omit<Application, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}

export function ApplicationForm({ application, onSubmit, onCancel }: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    companyName: application?.companyName || "",
    roleTitle: application?.roleTitle || "",
    applicationLink: application?.applicationLink || "",
    city: application?.city || "",
    workType: application?.workType || "remote",
    priority: application?.priority || "medium",
    status: application?.status || "applied",
    lastFollowUp: application?.lastFollowUp || "",
    nextFollowUp: application?.nextFollowUp || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData as any)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="e.g., Google"
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Role Title</label>
          <input
            type="text"
            name="roleTitle"
            value={formData.roleTitle}
            onChange={handleChange}
            placeholder="e.g., Senior Engineer"
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Application Link</label>
        <input
          type="url"
          name="applicationLink"
          value={formData.applicationLink}
          onChange={handleChange}
          placeholder="https://..."
          className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g., San Francisco"
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Work Type</label>
          <select
            name="workType"
            value={formData.workType}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          >
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">Onsite</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          >
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Offer</option>
            <option value="closed-won">Closed Won</option>
            <option value="closed-lost">Closed Lost</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Last Follow-up</label>
          <input
            type="date"
            name="lastFollowUp"
            value={formData.lastFollowUp}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Next Follow-up</label>
          <input
            type="date"
            name="nextFollowUp"
            value={formData.nextFollowUp}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {application ? "Update Application" : "Add Application"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Cancel
        </Button>
      </div>
    </form>
  )
}
