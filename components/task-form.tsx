"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Task } from "@/lib/types"

interface TaskFormProps {
  onSubmit: (data: Omit<Task, "id" | "createdAt">) => void
  onCancel: () => void
}

export function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    type: "follow-up",
    dueDate: "",
    priority: "medium",
    relatedEntity: "",
    completed: false,
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
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Task Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Follow up with Google recruiter"
          className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
          >
            <option value="follow-up">Follow-up</option>
            <option value="send-materials">Send Materials</option>
            <option value="thank-you">Thank You</option>
            <option value="prep">Prep</option>
            <option value="other">Other</option>
          </select>
        </div>
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
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Related Entity (optional)</label>
        <input
          type="text"
          name="relatedEntity"
          value={formData.relatedEntity}
          onChange={handleChange}
          placeholder="e.g., Contact ID, Application ID"
          className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          Add Task
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Cancel
        </Button>
      </div>
    </form>
  )
}
