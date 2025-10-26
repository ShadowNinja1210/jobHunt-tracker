"use client"

import type { Lead, Application, Task, Offer } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, AlertCircle } from "lucide-react"

interface DashboardProps {
  data: {
    leads: Lead[]
    applications: Application[]
    contacts: any[]
    tasks: Task[]
    offers: Offer[]
  }
}

export function Dashboard({ data }: DashboardProps) {
  const stats = {
    totalApplications: data.applications.length,
    activeInterviews: data.applications.filter((a) => a.status === "interviewing").length,
    pendingOffers: data.applications.filter((a) => a.status === "offer").length,
    overdueTasks: data.tasks.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length,
  }

  const dueTodayTasks = data.tasks.filter((t) => {
    if (t.completed || !t.dueDate) return false
    const today = new Date().toDateString()
    return new Date(t.dueDate).toDateString() === today
  })

  const stalledApplications = data.applications.filter((a) => {
    if (a.status === "closed-won" || a.status === "closed-lost") return false
    if (!a.lastFollowUp) return true
    const daysSinceFollowUp = Math.floor(
      (new Date().getTime() - new Date(a.lastFollowUp).getTime()) / (1000 * 60 * 60 * 24),
    )
    return daysSinceFollowUp > 14
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's your job search overview.</p>
        </div>
        <div className="flex gap-3">
          <Button className="gap-2">
            <Plus size={18} />
            Add Lead
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Plus size={18} />
            Add Application
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground mt-2">Active job applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.activeInterviews}</div>
            <p className="text-xs text-muted-foreground mt-2">Currently interviewing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.pendingOffers}</div>
            <p className="text-xs text-muted-foreground mt-2">Offers received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.overdueTasks}</div>
            <p className="text-xs text-muted-foreground mt-2">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Due Today */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Due Today
            </CardTitle>
            <CardDescription>{dueTodayTasks.length} tasks</CardDescription>
          </CardHeader>
          <CardContent>
            {dueTodayTasks.length === 0 ? (
              <p className="text-muted-foreground text-sm">No tasks due today</p>
            ) : (
              <div className="space-y-3">
                {dueTodayTasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-3 p-3 bg-accent rounded-lg">
                    <input type="checkbox" className="mt-1" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stalled Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle size={20} />
              Stalled Applications
            </CardTitle>
            <CardDescription>{stalledApplications.length} applications</CardDescription>
          </CardHeader>
          <CardContent>
            {stalledApplications.length === 0 ? (
              <p className="text-muted-foreground text-sm">All applications are active</p>
            ) : (
              <div className="space-y-2">
                {stalledApplications.slice(0, 5).map((app) => (
                  <div key={app.id} className="p-2 bg-accent rounded text-sm">
                    <p className="font-medium text-foreground">{app.companyName}</p>
                    <p className="text-xs text-muted-foreground">{app.roleTitle}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
