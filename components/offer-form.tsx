"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Offer, Application } from "@/lib/types"

interface OfferFormProps {
  offer?: Offer
  applications: Application[]
  onSubmit: (data: Omit<Offer, "id" | "createdAt">) => void
  onCancel: () => void
}

export function OfferForm({ offer, applications, onSubmit, onCancel }: OfferFormProps) {
  const [formData, setFormData] = useState({
    applicationId: offer?.applicationId || "",
    companyName: offer?.companyName || "",
    roleTitle: offer?.roleTitle || "",
    ctc: offer?.ctc || "",
    base: offer?.base || "",
    bonus: offer?.bonus || "",
    equity: offer?.equity || "",
    benefits: offer?.benefits || "",
    deadline: offer?.deadline || "",
    decision: offer?.decision || "",
    notes: offer?.notes || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      ctc: formData.ctc ? Number.parseFloat(formData.ctc.toString()) : undefined,
      base: formData.base ? Number.parseFloat(formData.base.toString()) : undefined,
      bonus: formData.bonus ? Number.parseFloat(formData.bonus.toString()) : undefined,
      equity: formData.equity ? Number.parseFloat(formData.equity.toString()) : undefined,
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Base Salary</label>
          <input
            type="number"
            name="base"
            value={formData.base}
            onChange={handleChange}
            placeholder="e.g., 150000"
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Bonus</label>
          <input
            type="number"
            name="bonus"
            value={formData.bonus}
            onChange={handleChange}
            placeholder="e.g., 30000"
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Equity (%)</label>
          <input
            type="number"
            name="equity"
            value={formData.equity}
            onChange={handleChange}
            placeholder="e.g., 0.5"
            step="0.01"
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Benefits</label>
        <textarea
          name="benefits"
          value={formData.benefits}
          onChange={handleChange}
          placeholder="e.g., Health insurance, 401k, remote work..."
          rows={2}
          className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Decision</label>
        <input
          type="text"
          name="decision"
          value={formData.decision}
          onChange={handleChange}
          placeholder="e.g., Accepted, Declined, Pending"
          className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Any additional notes about this offer..."
          rows={3}
          className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {offer ? "Update Offer" : "Add Offer"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Cancel
        </Button>
      </div>
    </form>
  )
}
