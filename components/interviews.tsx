"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Clock } from "lucide-react"
import type { Interview, Application } from "@/lib/types"
import { addInterview, updateInterview } from "@/lib/db"
import { InterviewForm } from "@/components/interview-form"
import { InterviewCard } from "@/components/interview-card"

interface InterviewsProps {
  data: {
    interviews: Interview[]
    applications: Application[]
  }
}

export function Interviews({ data }: InterviewsProps) {
  const [interviews, setInterviews] = useState<Interview[]>(data.interviews)
  const [showForm, setShowForm] = useState(false)
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null)
  const [selectedAppId, setSelectedAppId] = useState<string>("")

  const handleAddInterview = (interviewData: Omit<Interview, "id" | "createdAt">) => {
    const newInterview = addInterview(interviewData)
    setInterviews([...interviews, newInterview])
    setShowForm(false)
  }

  const handleUpdateInterview = (interviewData: Omit<Interview, "id" | "createdAt">) => {
    if (!editingInterview) return
    const updated = updateInterview(editingInterview.id, interviewData)
    if (updated) {
      setInterviews(interviews.map((i) => (i.id === editingInterview.id ? updated : i)))
      setEditingInterview(null)
    }
  }

  const upcomingInterviews = interviews
    .filter((i) => i.dateTime && new Date(i.dateTime) > new Date())
    .sort((a, b) => new Date(a.dateTime!).getTime() - new Date(b.dateTime!).getTime())

  const pastInterviews = interviews
    .filter((i) => !i.dateTime || new Date(i.dateTime) <= new Date())
    .sort((a, b) => new Date(b.dateTime || 0).getTime() - new Date(a.dateTime || 0).getTime())

  const getApplicationName = (appId: string) => {
    const app = data.applications.find((a) => a.id === appId)
    return app ? `${app.companyName} - ${app.roleTitle}` : "Unknown"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Interviews</h1>
          <p className="text-muted-foreground mt-2">Schedule and track your interviews</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus size={18} />
          Schedule Interview
        </Button>
      </div>

      {/* Upcoming Interviews */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={20} className="text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Upcoming Interviews</h2>
          <span className="text-sm bg-accent text-muted-foreground px-3 py-1 rounded-full">
            {upcomingInterviews.length}
          </span>
        </div>

        {upcomingInterviews.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No upcoming interviews scheduled</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interview={interview}
                applicationName={getApplicationName(interview.applicationId)}
                onEdit={() => setEditingInterview(interview)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Past Interviews */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock size={20} className="text-muted-foreground" />
          <h2 className="text-2xl font-bold text-foreground">Past Interviews</h2>
          <span className="text-sm bg-accent text-muted-foreground px-3 py-1 rounded-full">
            {pastInterviews.length}
          </span>
        </div>

        {pastInterviews.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No past interviews</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {pastInterviews.map((interview) => (
              <Card key={interview.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{getApplicationName(interview.applicationId)}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Round {interview.round} - {interview.type}
                      </p>
                      {interview.dateTime && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(interview.dateTime).toLocaleDateString()} at{" "}
                          {new Date(interview.dateTime).toLocaleTimeString()}
                        </p>
                      )}
                      {interview.outcome && (
                        <p className="text-sm mt-2">
                          <span className="font-medium text-foreground">Outcome:</span>{" "}
                          <span className="text-muted-foreground">{interview.outcome}</span>
                        </p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setEditingInterview(interview)}>
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Interview Form Modal */}
      {(showForm || editingInterview) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingInterview ? "Edit Interview" : "Schedule Interview"}</CardTitle>
              <CardDescription>{editingInterview ? "Update interview details" : "Add a new interview"}</CardDescription>
            </CardHeader>
            <CardContent>
              <InterviewForm
                interview={editingInterview || undefined}
                applications={data.applications}
                onSubmit={editingInterview ? handleUpdateInterview : handleAddInterview}
                onCancel={() => {
                  setShowForm(false)
                  setEditingInterview(null)
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
