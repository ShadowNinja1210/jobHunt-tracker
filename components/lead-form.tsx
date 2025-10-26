"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Lead } from "@/lib/types"

interface LeadFormProps {
  lead?: Lead
  onSubmit: (data: Omit<Lead, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}

export function LeadForm({ lead, onSubmit, onCancel }: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: lead?.name || "",
    roleTitle: lead?.roleTitle || "",
    companyName: lead?.companyName || "",
    source: lead?.source || "",
    listingUrl: lead?.listingUrl || "",
    city: lead?.city || "",
    status: lead?.status || "new",
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
          <label className="block text-sm font-medium text-foreground mb-2">Lead Name</label>
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
      </div>

      <div className="grid grid-cols-2 gap-4">
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
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Source</label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            placeholder="e.g., LinkedIn, Referral"
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Listing URL</label>
        <input
          type="url"
          name="listingUrl"
          value={formData.listingUrl}
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
          <label className="block text-sm font-medium text-foreground mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          >
            <option value="new">New</option>
            <option value="researching">Researching</option>
            <option value="contacted">Contacted</option>
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Offer</option>
            <option value="closed-won">Closed Won</option>
            <option value="closed-lost">Closed Lost</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {lead ? "Update Lead" : "Add Lead"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Cancel
        </Button>
      </div>
    </form>
  )
}
