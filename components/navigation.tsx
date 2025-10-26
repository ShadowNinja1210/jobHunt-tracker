"use client"

import { useState } from "react"
import { LayoutDashboard, Briefcase, FileText, Users, CheckSquare, Gift, Menu, X } from "lucide-react"

interface NavigationProps {
  currentView: string
  onViewChange: (view: string) => void
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(true)

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "leads", label: "Leads", icon: Briefcase },
    { id: "applications", label: "Applications", icon: FileText },
    { id: "interviews", label: "Interviews", icon: Users },
    { id: "contacts", label: "Contacts", icon: Users },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "offers", label: "Offers", icon: Gift },
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-primary-foreground lg:hidden"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <nav
        className={`fixed left-0 top-0 h-screen w-64 bg-card border-r border-border transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-foreground">JobTrack</h1>
          <p className="text-sm text-muted-foreground">Job Hunt CRM</p>
        </div>

        <div className="space-y-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === item.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
