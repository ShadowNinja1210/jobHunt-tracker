"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Download, AlertCircle } from "lucide-react"
import type { Offer, Application } from "@/lib/types"
import { addOffer, updateOffer } from "@/lib/db"
import { OfferForm } from "@/components/offer-form"
import { OfferCard } from "@/components/offer-card"

interface OffersProps {
  data: {
    offers: Offer[]
    applications: Application[]
  }
}

export function Offers({ data }: OffersProps) {
  const [offers, setOffers] = useState<Offer[]>(data.offers)
  const [showForm, setShowForm] = useState(false)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [compareMode, setCompareMode] = useState(false)
  const [selectedOffers, setSelectedOffers] = useState<string[]>([])

  const handleAddOffer = (offerData: Omit<Offer, "id" | "createdAt">) => {
    const newOffer = addOffer(offerData)
    setOffers([...offers, newOffer])
    setShowForm(false)
  }

  const handleUpdateOffer = (offerData: Omit<Offer, "id" | "createdAt">) => {
    if (!editingOffer) return
    const updated = updateOffer(editingOffer.id, offerData)
    if (updated) {
      setOffers(offers.map((o) => (o.id === editingOffer.id ? updated : o)))
      setEditingOffer(null)
    }
  }

  const handleToggleCompare = (offerId: string) => {
    setSelectedOffers((prev) => (prev.includes(offerId) ? prev.filter((id) => id !== offerId) : [...prev, offerId]))
  }

  const getApplicationName = (appId: string) => {
    const app = data.applications.find((a) => a.id === appId)
    return app ? `${app.companyName} - ${app.roleTitle}` : "Unknown"
  }

  const urgentOffers = offers.filter((o) => {
    if (!o.deadline) return false
    const daysUntilDeadline = Math.floor(
      (new Date(o.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    )
    return daysUntilDeadline <= 3 && daysUntilDeadline >= 0
  })

  const exportData = () => {
    const dataToExport = {
      leads: data.applications,
      offers,
      exportDate: new Date().toISOString(),
    }
    const dataStr = JSON.stringify(dataToExport, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `job-hunt-backup-${new Date().toISOString().split("T")[0]}.json`
    link.click()
  }

  const comparisonOffers = offers.filter((o) => selectedOffers.includes(o.id))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Offers</h1>
          <p className="text-muted-foreground mt-2">Track and compare job offers</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportData} variant="outline" className="gap-2 bg-transparent">
            <Download size={18} />
            Export Data
          </Button>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus size={18} />
            Add Offer
          </Button>
        </div>
      </div>

      {/* Urgent Offers Alert */}
      {urgentOffers.length > 0 && (
        <Card className="border-red-500/50 bg-red-500/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-semibold text-foreground">Urgent Offers</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {urgentOffers.length} offer{urgentOffers.length !== 1 ? "s" : ""} with deadline within 3 days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Mode */}
      {compareMode && comparisonOffers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Offer Comparison</h2>
            <Button onClick={() => setCompareMode(false)} variant="outline" className="bg-transparent">
              Exit Comparison
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Company</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Base Salary</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Bonus</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Equity</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Total Comp</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {comparisonOffers.map((offer) => {
                  const total = (offer.base || 0) + (offer.bonus || 0)
                  return (
                    <tr key={offer.id} className="border-b border-border hover:bg-accent transition-colors">
                      <td className="py-3 px-4 text-foreground font-medium">{offer.companyName}</td>
                      <td className="py-3 px-4 text-foreground">
                        {offer.base ? `$${offer.base.toLocaleString()}` : "—"}
                      </td>
                      <td className="py-3 px-4 text-foreground">
                        {offer.bonus ? `$${offer.bonus.toLocaleString()}` : "—"}
                      </td>
                      <td className="py-3 px-4 text-foreground">{offer.equity ? `${offer.equity}%` : "—"}</td>
                      <td className="py-3 px-4 text-foreground font-semibold">${total.toLocaleString()}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {offer.deadline ? new Date(offer.deadline).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Offers Grid */}
      {!compareMode && (
        <>
          {offers.length > 1 && (
            <Button onClick={() => setCompareMode(true)} variant="outline" className="bg-transparent">
              Compare Offers
            </Button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">No offers yet. Add one to get started!</p>
                </CardContent>
              </Card>
            ) : (
              offers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  applicationName={getApplicationName(offer.applicationId)}
                  isSelected={selectedOffers.includes(offer.id)}
                  onToggleSelect={() => handleToggleCompare(offer.id)}
                  onEdit={() => setEditingOffer(offer)}
                />
              ))
            )}
          </div>
        </>
      )}

      {/* Offer Form Modal */}
      {(showForm || editingOffer) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingOffer ? "Edit Offer" : "Add New Offer"}</CardTitle>
              <CardDescription>{editingOffer ? "Update offer details" : "Record a new job offer"}</CardDescription>
            </CardHeader>
            <CardContent>
              <OfferForm
                offer={editingOffer || undefined}
                applications={data.applications}
                onSubmit={editingOffer ? handleUpdateOffer : handleAddOffer}
                onCancel={() => {
                  setShowForm(false)
                  setEditingOffer(null)
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
