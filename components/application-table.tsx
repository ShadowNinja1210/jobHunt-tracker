"use client"

import { Button } from "@/components/ui/button"
import { Edit2, ExternalLink } from "lucide-react"
import type { Application } from "@/lib/types"

interface ApplicationTableProps {
  applications: Application[]
  onStatusChange: (appId: string, newStatus: string) => void
  onEdit: (app: Application) => void
}

const statuses = [
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "closed-won", label: "Closed Won" },
  { value: "closed-lost", label: "Closed Lost" },
]

export function ApplicationTable({ applications, onStatusChange, onEdit }: ApplicationTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold text-foreground">Company</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Role</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Location</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Type</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Priority</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="border-b border-border hover:bg-accent transition-colors">
              <td className="py-3 px-4 text-foreground font-medium">{app.companyName}</td>
              <td className="py-3 px-4 text-foreground">{app.roleTitle}</td>
              <td className="py-3 px-4 text-muted-foreground">{app.city || "—"}</td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 bg-accent rounded text-xs text-muted-foreground">{app.workType}</span>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded text-white text-xs font-medium ${
                    app.priority === "high" ? "bg-red-500" : app.priority === "medium" ? "bg-yellow-500" : "bg-gray-500"
                  }`}
                >
                  {app.priority}
                </span>
              </td>
              <td className="py-3 px-4">
                <select
                  value={app.status}
                  onChange={(e) => onStatusChange(app.id, e.target.value)}
                  className="px-2 py-1 bg-accent text-foreground rounded text-xs border border-border"
                >
                  {statuses.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(app)}>
                    <Edit2 size={14} />
                  </Button>
                  {app.applicationLink && (
                    <a href={app.applicationLink} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm">
                        <ExternalLink size={14} />
                      </Button>
                    </a>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
