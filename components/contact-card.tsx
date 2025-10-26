"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Mail, Linkedin, MessageSquare } from "lucide-react"
import type { Contact } from "@/lib/types"

interface ContactCardProps {
  contact: Contact
  onEdit: () => void
  onAskForReferral: () => void
}

const referralStatusColors: Record<string, string> = {
  requested: "bg-yellow-500",
  sent: "bg-blue-500",
  accepted: "bg-green-500",
  declined: "bg-red-500",
  completed: "bg-emerald-600",
}

export function ContactCard({ contact, onEdit, onAskForReferral }: ContactCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-foreground">{contact.name}</h3>
              {contact.role && <p className="text-sm text-muted-foreground">{contact.role}</p>}
              {contact.company && <p className="text-sm text-muted-foreground">{contact.company}</p>}
            </div>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit2 size={16} />
            </Button>
          </div>

          {/* Relationship Badge */}
          {contact.relationship && (
            <div>
              <span className="px-3 py-1 bg-accent rounded-full text-xs font-medium text-muted-foreground capitalize">
                {contact.relationship}
              </span>
            </div>
          )}

          {/* Contact Info */}
          <div className="space-y-2 text-sm">
            {contact.email && (
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-muted-foreground" />
                <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                  {contact.email}
                </a>
              </div>
            )}
            {contact.linkedIn && (
              <div className="flex items-center gap-2">
                <Linkedin size={16} className="text-muted-foreground" />
                <a
                  href={contact.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  LinkedIn Profile
                </a>
              </div>
            )}
          </div>

          {/* Notes */}
          {contact.notes && (
            <div className="p-3 bg-accent rounded text-sm text-foreground">
              <p className="text-muted-foreground">{contact.notes}</p>
            </div>
          )}

          {/* Referral Status */}
          {contact.referralStatus && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Referral:</span>
              <span
                className={`px-2 py-1 rounded text-white text-xs font-medium ${
                  referralStatusColors[contact.referralStatus] || "bg-gray-500"
                }`}
              >
                {contact.referralStatus}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button onClick={onAskForReferral} variant="outline" className="flex-1 gap-2 bg-transparent" size="sm">
              <MessageSquare size={14} />
              Ask for Referral
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
