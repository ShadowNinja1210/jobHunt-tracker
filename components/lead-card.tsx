"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, ArrowRight, ExternalLink } from "lucide-react"
import type { Lead } from "@/lib/types"

interface LeadCardProps {
  lead: Lead
  statuses: Array<{ value: string; label: string; color: string }>
  onStatusChange: (leadId: string, newStatus: string) => void
  onEdit: () => void
  onConvert: () => void
}

export function LeadCard({ lead, statuses, onStatusChange, onEdit, onConvert }: LeadCardProps) {
  const currentStatus = statuses.find((s) => s.value === lead.status)

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-foreground">{lead.companyName}</h3>
              <p className="text-sm text-muted-foreground">{lead.roleTitle}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit2 size={16} />
            </Button>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm">
            {lead.city && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="text-foreground">{lead.city}</span>
              </div>
            )}
            {lead.source && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Source:</span>
                <span className="text-foreground">{lead.source}</span>
              </div>
            )}
            {lead.listingUrl && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Listing:</span>
                <a
                  href={lead.listingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Status</label>
            <select
              value={lead.status}
              onChange={(e) => onStatusChange(lead.id, e.target.value)}
              className="w-full px-3 py-2 bg-accent text-foreground rounded-md border border-border text-sm"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button onClick={onConvert} className="flex-1 gap-2" size="sm">
              <ArrowRight size={14} />
              Convert to App
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
