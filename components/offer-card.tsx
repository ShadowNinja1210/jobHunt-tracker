"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Calendar, AlertCircle } from "lucide-react"
import type { Offer } from "@/lib/types"

interface OfferCardProps {
  offer: Offer
  applicationName: string
  isSelected: boolean
  onToggleSelect: () => void
  onEdit: () => void
}

export function OfferCard({ offer, applicationName, isSelected, onToggleSelect, onEdit }: OfferCardProps) {
  const total = (offer.base || 0) + (offer.bonus || 0)
  const daysUntilDeadline = offer.deadline
    ? Math.floor((new Date(offer.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null
  const isUrgent = daysUntilDeadline !== null && daysUntilDeadline <= 3 && daysUntilDeadline >= 0

  return (
    <Card className={`hover:shadow-lg transition-shadow ${isSelected ? "ring-2 ring-primary" : ""}`}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-foreground">{offer.companyName}</h3>
              <p className="text-sm text-muted-foreground">{offer.roleTitle}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit2 size={16} />
            </Button>
          </div>

          {/* Compensation */}
          <div className="space-y-2 p-3 bg-accent rounded">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base:</span>
              <span className="font-semibold text-foreground">
                {offer.base ? `$${offer.base.toLocaleString()}` : "—"}
              </span>
            </div>
            {offer.bonus && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bonus:</span>
                <span className="font-semibold text-foreground">${offer.bonus.toLocaleString()}</span>
              </div>
            )}
            {offer.equity && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Equity:</span>
                <span className="font-semibold text-foreground">{offer.equity}%</span>
              </div>
            )}
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="font-medium text-foreground">Total:</span>
              <span className="font-bold text-primary text-lg">${total.toLocaleString()}</span>
            </div>
          </div>

          {/* Deadline */}
          {offer.deadline && (
            <div className={`flex items-center gap-2 p-2 rounded ${isUrgent ? "bg-red-500/10" : "bg-accent"}`}>
              {isUrgent ? <AlertCircle size={16} className="text-red-500" /> : <Calendar size={16} />}
              <span className={`text-sm ${isUrgent ? "text-red-500 font-semibold" : "text-muted-foreground"}`}>
                Deadline: {new Date(offer.deadline).toLocaleDateString()}
                {daysUntilDeadline !== null && ` (${daysUntilDeadline} days)`}
              </span>
            </div>
          )}

          {/* Benefits */}
          {offer.benefits && (
            <div className="p-3 bg-accent rounded text-sm text-foreground">
              <p className="font-medium mb-1">Benefits:</p>
              <p className="text-muted-foreground">{offer.benefits}</p>
            </div>
          )}

          {/* Decision */}
          {offer.decision && (
            <div className="p-3 bg-accent rounded text-sm">
              <p className="font-medium text-foreground mb-1">Decision:</p>
              <p className="text-muted-foreground">{offer.decision}</p>
            </div>
          )}

          {/* Select for Comparison */}
          <Button
            onClick={onToggleSelect}
            variant={isSelected ? "default" : "outline"}
            className="w-full bg-transparent"
          >
            {isSelected ? "Selected for Comparison" : "Select for Comparison"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
