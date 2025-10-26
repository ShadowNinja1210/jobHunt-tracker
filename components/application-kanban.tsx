"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, ExternalLink } from "lucide-react"
import type { Application } from "@/lib/types"

interface ApplicationKanbanProps {
  applications: Application[]
  onStatusChange: (appId: string, newStatus: string) => void
  onEdit: (app: Application) => void
}

const statuses = [
  { value: "applied", label: "Applied", color: "bg-blue-500" },
  { value: "interviewing", label: "Interviewing", color: "bg-cyan-500" },
  { value: "offer", label: "Offer", color: "bg-green-500" },
  { value: "closed-won", label: "Closed Won", color: "bg-emerald-600" },
  { value: "closed-lost", label: "Closed Lost", color: "bg-red-500" },
]

export function ApplicationKanban({ applications, onStatusChange, onEdit }: ApplicationKanbanProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statuses.map((status) => {
        const statusApps = applications.filter((a) => a.status === status.value)
        return (
          <div key={status.value} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
              <h3 className="font-semibold text-foreground">{status.label}</h3>
              <span className="text-xs bg-accent text-muted-foreground px-2 py-1 rounded">{statusApps.length}</span>
            </div>

            <div className="space-y-2">
              {statusApps.map((app) => (
                <Card key={app.id} className="cursor-move hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground text-sm">{app.companyName}</h4>
                          <p className="text-xs text-muted-foreground">{app.roleTitle}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => onEdit(app)}>
                          <Edit2 size={14} />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-1 bg-accent rounded text-muted-foreground">{app.workType}</span>
                        <span
                          className={`px-2 py-1 rounded text-white text-xs font-medium ${
                            app.priority === "high"
                              ? "bg-red-500"
                              : app.priority === "medium"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                          }`}
                        >
                          {app.priority}
                        </span>
                      </div>

                      {app.city && <p className="text-xs text-muted-foreground">{app.city}</p>}

                      {app.applicationLink && (
                        <a
                          href={app.applicationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-xs flex items-center gap-1"
                        >
                          View Application <ExternalLink size={12} />
                        </a>
                      )}

                      <select
                        value={app.status}
                        onChange={(e) => onStatusChange(app.id, e.target.value)}
                        className="w-full px-2 py-1 bg-accent text-foreground rounded text-xs border border-border"
                      >
                        {statuses.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
