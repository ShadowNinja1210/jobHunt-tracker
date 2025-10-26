"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Contact, Application } from "@/lib/types"
import { addContact, updateContact, addTask } from "@/lib/db"
import { ContactForm } from "@/components/contact-form"
import { ContactCard } from "@/components/contact-card"

interface ContactsProps {
  data: {
    contacts: Contact[]
    applications: Application[]
  }
}

export function Contacts({ data }: ContactsProps) {
  const [contacts, setContacts] = useState<Contact[]>(data.contacts)
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [filterRelationship, setFilterRelationship] = useState<string>("all")

  const relationships = ["all", "recruiter", "hiring-manager", "current-employee", "friend", "mentor", "other"]

  const handleAddContact = (contactData: Omit<Contact, "id" | "createdAt">) => {
    const newContact = addContact(contactData)
    setContacts([...contacts, newContact])
    setShowForm(false)
  }

  const handleUpdateContact = (contactData: Omit<Contact, "id" | "createdAt">) => {
    if (!editingContact) return
    const updated = updateContact(editingContact.id, contactData)
    if (updated) {
      setContacts(contacts.map((c) => (c.id === editingContact.id ? updated : c)))
      setEditingContact(null)
    }
  }

  const handleAskForReferral = (contact: Contact) => {
    // Create a task for referral request
    addTask({
      title: `Ask ${contact.name} for referral`,
      type: "follow-up",
      priority: "high",
      relatedEntity: contact.id,
      completed: false,
    })

    // Update contact referral status
    updateContact(contact.id, { referralStatus: "requested" })
    setContacts(contacts.map((c) => (c.id === contact.id ? { ...c, referralStatus: "requested" } : c)))
  }

  const filteredContacts =
    filterRelationship === "all" ? contacts : contacts.filter((c) => c.relationship === filterRelationship)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Contacts & Referrals</h1>
          <p className="text-muted-foreground mt-2">Manage your professional network</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus size={18} />
          Add Contact
        </Button>
      </div>

      {/* Relationship Filter */}
      <div className="flex gap-2 flex-wrap">
        {relationships.map((rel) => {
          const count = rel === "all" ? contacts.length : contacts.filter((c) => c.relationship === rel).length
          return (
            <Button
              key={rel}
              variant={filterRelationship === rel ? "default" : "outline"}
              onClick={() => setFilterRelationship(rel)}
              className="bg-transparent capitalize"
            >
              {rel} ({count})
            </Button>
          )
        })}
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No contacts found. Add one to get started!</p>
            </CardContent>
          </Card>
        ) : (
          filteredContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onEdit={() => setEditingContact(contact)}
              onAskForReferral={() => handleAskForReferral(contact)}
            />
          ))
        )}
      </div>

      {/* Contact Form Modal */}
      {(showForm || editingContact) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingContact ? "Edit Contact" : "Add New Contact"}</CardTitle>
              <CardDescription>
                {editingContact ? "Update contact information" : "Add a new professional contact"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm
                contact={editingContact || undefined}
                onSubmit={editingContact ? handleUpdateContact : handleAddContact}
                onCancel={() => {
                  setShowForm(false)
                  setEditingContact(null)
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
