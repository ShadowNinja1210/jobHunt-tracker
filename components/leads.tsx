"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Lead } from "@/lib/types"
import { addLead, updateLead } from "@/lib/db"
import { LeadForm } from "@/components/lead-form"
import { LeadCard } from "@/components/lead-card"

interface LeadsProps {
  data: {
    leads: Lead[]
  }
}

export function Leads({ data }: LeadsProps) {
  const [leads, setLeads] = useState<Lead[]>(data.leads)
  const [showForm, setShowForm] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const statuses: Array<{ value: string; label: string; color: string }> = [
    { value: "new", label: "New", color: "bg-blue-500" },
    { value: "researching", label: "Researching", color: "bg-purple-500" },
    { value: "contacted", label: "Contacted", color: "bg-yellow-500" },
    { value: "applied", label: "Applied", color: "bg-green-500" },
    { value: "interviewing", label: "Interviewing", color: "bg-cyan-500" },
    { value: "offer", label: "Offer", color: "bg-emerald-500" },
    { value: "closed-won", label: "Closed Won", color: "bg-green-600" },
    { value: "closed-lost", label: "Closed Lost", color: "bg-red-500" },
  ]

  const filteredLeads = filterStatus === "all" ? leads : leads.filter((l) => l.status === filterStatus)

  const handleAddLead = (leadData: Omit<Lead, "id" | "createdAt" | "updatedAt">) => {
    const newLead = addLead(leadData)
    setLeads([...leads, newLead])
    setShowForm(false)
  }

  const handleUpdateLead = (leadData: Omit<Lead, "id" | "createdAt" | "updatedAt">) => {
    if (!editingLead) return
    const updated = updateLead(editingLead.id, leadData)
    if (updated) {
      setLeads(leads.map((l) => (l.id === editingLead.id ? updated : l)))
      setEditingLead(null)
    }
  }

  const handleStatusChange = (leadId: string, newStatus: string) => {
    const updated = updateLead(leadId, { status: newStatus as any })
    if (updated) {
      setLeads(leads.map((l) => (l.id === leadId ? updated : l)))
    }
  }

  const handleConvertToApplication = (lead: Lead) => {
    // This will be implemented when we build the applications section
    console.log("Convert to application:", lead)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground mt-2">Manage and track job leads</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus size={18} />
          Add Lead
        </Button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filterStatus === "all" ? "default" : "outline"}
          onClick={() => setFilterStatus("all")}
          className="bg-transparent"
        >
          All ({leads.length})
        </Button>
        {statuses.map((status) => {
          const count = leads.filter((l) => l.status === status.value).length
          return (
            <Button
              key={status.value}
              variant={filterStatus === status.value ? "default" : "outline"}
              onClick={() => setFilterStatus(status.value)}
              className="bg-transparent"
            >
              {status.label} ({count})
            </Button>
          )
        })}
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLeads.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No leads found. Add one to get started!</p>
            </CardContent>
          </Card>
        ) : (
          filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              statuses={statuses}
              onStatusChange={handleStatusChange}
              onEdit={() => setEditingLead(lead)}
              onConvert={() => handleConvertToApplication(lead)}
            />
          ))
        )}
      </div>

      {/* Lead Form Modal */}
      {(showForm || editingLead) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingLead ? "Edit Lead" : "Add New Lead"}</CardTitle>
              <CardDescription>{editingLead ? "Update lead information" : "Create a new job lead"}</CardDescription>
            </CardHeader>
            <CardContent>
              <LeadForm
                lead={editingLead || undefined}
                onSubmit={editingLead ? handleUpdateLead : handleAddLead}
                onCancel={() => {
                  setShowForm(false)
                  setEditingLead(null)
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
