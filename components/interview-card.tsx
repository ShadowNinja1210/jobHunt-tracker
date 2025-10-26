"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, Edit2 } from "lucide-react"
import type { Interview } from "@/lib/types"

interface InterviewCardProps {
  interview: Interview
  applicationName: string
  onEdit: () => void
}

const interviewTypeColors: Record<string, string> = {
  screen: "bg-blue-500",
  technical: "bg-purple-500",
  hr: "bg-green-500",
  onsite: "bg-orange-500",
}

export function InterviewCard({ interview, applicationName, onEdit }: InterviewCardProps) {
  const typeColor = interviewTypeColors[interview.type] || "bg-gray-500"

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-foreground">{applicationName}</h3>
              <p className="text-sm text-muted-foreground mt-1">Round {interview.round}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit2 size={16} />
            </Button>
          </div>

          {/* Type Badge */}
          <div>
            <span className={`px-3 py-1 rounded-full text-white text-xs font-medium ${typeColor}`}>
              {interview.type}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm">
            {interview.dateTime && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar size={16} />
                <span>{new Date(interview.dateTime).toLocaleDateString()}</span>
              </div>
            )}
            {interview.dateTime && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock size={16} />
                <span>{new Date(interview.dateTime).toLocaleTimeString()}</span>
              </div>
            )}
            {interview.timezone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-xs">{interview.timezone}</span>
              </div>
            )}
            {interview.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={16} />
                <span>{interview.location}</span>
              </div>
            )}
            {interview.meetingLink && (
              <div className="flex items-center gap-2">
                <a
                  href={interview.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-xs"
                >
                  Join Meeting
                </a>
              </div>
            )}
            {interview.interviewers && interview.interviewers.length > 0 && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users size={16} />
                <span>{interview.interviewers.join(", ")}</span>
              </div>
            )}
          </div>

          {/* Notes */}
          {interview.notes && (
            <div className="p-3 bg-accent rounded text-sm text-foreground">
              <p className="font-medium mb-1">Notes:</p>
              <p className="text-muted-foreground">{interview.notes}</p>
            </div>
          )}

          {/* Prep Checklist */}
          <PrepChecklist interviewType={interview.type} />
        </div>
      </CardContent>
    </Card>
  )
}

function PrepChecklist({ interviewType }: { interviewType: string }) {
  const checklists: Record<string, string[]> = {
    screen: [
      "Review company background",
      "Prepare elevator pitch",
      "Research interviewer on LinkedIn",
      "Test audio/video setup",
    ],
    technical: [
      "Review data structures & algorithms",
      "Practice coding problems",
      "Prepare system design examples",
      "Test IDE/environment",
    ],
    hr: [
      "Prepare behavioral stories (STAR)",
      "Research company culture",
      "Prepare questions about role",
      "Review compensation expectations",
    ],
    onsite: [
      "Plan travel logistics",
      "Prepare professional attire",
      "Review all interviewers",
      "Prepare questions for each round",
    ],
  }

  const items = checklists[interviewType] || []

  return (
    <div className="p-3 bg-accent rounded">
      <p className="font-medium text-sm text-foreground mb-2">Prep Checklist</p>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <label key={idx} className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input type="checkbox" className="rounded" />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
