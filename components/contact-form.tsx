"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Contact } from "@/lib/types"

interface ContactFormProps {
  contact?: Contact
  onSubmit: (data: Omit<Contact, "id" | "createdAt">) => void
  onCancel: () => void
}

export function ContactForm({ contact, onSubmit, onCancel }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: contact?.name || "",
    role: contact?.role || "",
    company: contact?.company || "",
    email: contact?.email || "",
    linkedIn: contact?.linkedIn || "",
    relationship: contact?.relationship || "",
    notes: contact?.notes || "",
    referralStatus: contact?.referralStatus || "requested",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
          <label className="block text-sm font-medium text-foreground mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., John Smith"
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Role</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g., Engineering Manager"
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g., Google"
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Relationship</label>
          <select
            name="relationship"
            value={formData.relationship}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          >
            <option value="">Select relationship</option>
            <option value="recruiter">Recruiter</option>
            <option value="hiring-manager">Hiring Manager</option>
            <option value="current-employee">Current Employee</option>
            <option value="friend">Friend</option>
            <option value="mentor">Mentor</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">LinkedIn</label>
          <input
            type="url"
            name="linkedIn"
            value={formData.linkedIn}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/..."
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Referral Status</label>
        <select
          name="referralStatus"
          value={formData.referralStatus}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
        >
          <option value="requested">Requested</option>
          <option value="sent">Sent</option>
          <option value="accepted">Accepted</option>
          <option value="declined">Declined</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Any notes about this contact..."
          rows={3}
          className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {contact ? "Update Contact" : "Add Contact"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Cancel
        </Button>
      </div>
    </form>
  )
}
