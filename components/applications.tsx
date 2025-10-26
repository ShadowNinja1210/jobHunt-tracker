"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, LayoutGrid, List } from "lucide-react"
import type { Application } from "@/lib/types"
import { addApplication, updateApplication } from "@/lib/db"
import { ApplicationForm } from "@/components/application-form"
import { ApplicationKanban } from "@/components/application-kanban"
import { ApplicationTable } from "@/components/application-table"

interface ApplicationsProps {
  data: {
    applications: Application[]
  }
}

export function Applications({ data }: ApplicationsProps) {
  const [applications, setApplications] = useState<Application[]>(data.applications)
  const [showForm, setShowForm] = useState(false)
  const [editingApp, setEditingApp] = useState<Application | null>(null)
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban")

  const handleAddApplication = (appData: Omit<Application, "id" | "createdAt" | "updatedAt">) => {
    const newApp = addApplication(appData)
    setApplications([...applications, newApp])
    setShowForm(false)
  }

  const handleUpdateApplication = (appData: Omit<Application, "id" | "createdAt" | "updatedAt">) => {
    if (!editingApp) return
    const updated = updateApplication(editingApp.id, appData)
    if (updated) {
      setApplications(applications.map((a) => (a.id === editingApp.id ? updated : a)))
      setEditingApp(null)
    }
  }

  const handleStatusChange = (appId: string, newStatus: string) => {
    const updated = updateApplication(appId, { status: newStatus as any })
    if (updated) {
      setApplications(applications.map((a) => (a.id === appId ? updated : a)))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Applications</h1>
          <p className="text-muted-foreground mt-2">Track and manage your job applications</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 bg-accent rounded-lg p-1">
            <Button
              variant={viewMode === "kanban" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="gap-2"
            >
              <LayoutGrid size={16} />
              Kanban
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="gap-2"
            >
              <List size={16} />
              Table
            </Button>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus size={18} />
            Add Application
          </Button>
        </div>
      </div>

      {/* View */}
      {viewMode === "kanban" ? (
        <ApplicationKanban applications={applications} onStatusChange={handleStatusChange} onEdit={setEditingApp} />
      ) : (
        <ApplicationTable applications={applications} onStatusChange={handleStatusChange} onEdit={setEditingApp} />
      )}

      {/* Application Form Modal */}
      {(showForm || editingApp) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingApp ? "Edit Application" : "Add New Application"}</CardTitle>
              <CardDescription>
                {editingApp ? "Update application details" : "Create a new job application"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApplicationForm
                application={editingApp || undefined}
                onSubmit={editingApp ? handleUpdateApplication : handleAddApplication}
                onCancel={() => {
                  setShowForm(false)
                  setEditingApp(null)
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
