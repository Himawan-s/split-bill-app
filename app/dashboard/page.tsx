"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/layout/Sidebar"
import StepPeople from "@/components/bill/StepPeople"
import StepMenu from "@/components/bill/StepMenu"
import StepAssignment from "@/components/bill/StepAssignment"
import StepReview from "@/components/bill/StepReview"
import StepSummary from "@/components/bill/StepSummary"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import { Person, MenuItem, Assignment, BillData } from "@/types/bill"

type Step = 1 | 2 | 3 | 4 | 5

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [billData, setBillData] = useState<BillData>({
    title: "",
    people: [],
    menuItems: [],
    assignments: [],
    taxPercentage: 0,
    servicePercentage: 0,
    discountPercentage: 0,
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  const resetBill = () => {
    setCurrentStep(1)
    setBillData({
      title: "",
      people: [],
      menuItems: [],
      assignments: [],
      taxPercentage: 0,
      servicePercentage: 0,
      discountPercentage: 0,
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Map assignments to use array indices as IDs
      const mappedAssignments = billData.assignments.map((assignment) => {
        const menuItemIdx = billData.menuItems.findIndex(
          (item) => item.id === assignment.menuItemId
        )
        const personIdx = billData.people.findIndex(
          (p) => p.id === assignment.personId
        )

        return {
          menuItemId: menuItemIdx.toString(),
          personId: personIdx.toString(),
          sharePercentage: assignment.sharePercentage,
        }
      })

      const response = await fetch("/api/bills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: billData.title || undefined,
          people: billData.people.map((p) => ({ name: p.name })),
          menuItems: billData.menuItems.map((item) => ({
            name: item.name,
            price: item.price,
          })),
          assignments: mappedAssignments,
          taxPercentage: billData.taxPercentage,
          servicePercentage: billData.servicePercentage,
          discountPercentage: billData.discountPercentage,
        }),
      })

      if (response.ok) {
        alert("Bill saved successfully!")
        resetBill()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || "Failed to save bill"}`)
      }
    } catch (error) {
      console.error("Error saving bill:", error)
      alert("Failed to save bill. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleBillSelect = (billId: string) => {
    // TODO: Load bill details and allow editing/viewing
    console.log("Selected bill:", billId)
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-blue-50 to-white flex">
      <Sidebar onBillSelect={handleBillSelect} onNewBill={resetBill} />

      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {currentStep === 1 && "Step 1: Add People"}
            {currentStep === 2 && "Step 2: Add Menu Items"}
            {currentStep === 3 && "Step 3: Assign Items"}
            {currentStep === 4 && "Step 4: Review & Calculate"}
            {currentStep === 5 && "Step 5: Final Summary"}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{session.user?.email}</span>
            <Button variant="ghost" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 h-2 rounded-full mx-1 transition ${
                      step <= currentStep
                        ? "bg-sky-blue-500"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>People</span>
                <span>Menu</span>
                <span>Assign</span>
                <span>Review</span>
                <span>Summary</span>
              </div>
            </div>

            {/* Step content */}
            <Card>
              {currentStep === 1 && (
                <StepPeople
                  people={billData.people}
                  onUpdate={(people) =>
                    setBillData({ ...billData, people })
                  }
                  onNext={() => setCurrentStep(2)}
                />
              )}

              {currentStep === 2 && (
                <StepMenu
                  menuItems={billData.menuItems}
                  onUpdate={(menuItems) =>
                    setBillData({ ...billData, menuItems })
                  }
                  onNext={() => setCurrentStep(3)}
                  onBack={() => setCurrentStep(1)}
                />
              )}

              {currentStep === 3 && (
                <StepAssignment
                  people={billData.people}
                  menuItems={billData.menuItems}
                  assignments={billData.assignments}
                  onUpdate={(assignments) =>
                    setBillData({ ...billData, assignments })
                  }
                  onNext={() => setCurrentStep(4)}
                  onBack={() => setCurrentStep(2)}
                />
              )}

              {currentStep === 4 && (
                <StepReview
                  people={billData.people}
                  menuItems={billData.menuItems}
                  assignments={billData.assignments}
                  taxPercentage={billData.taxPercentage}
                  servicePercentage={billData.servicePercentage}
                  discountPercentage={billData.discountPercentage}
                  onUpdate={(tax, service, discount) =>
                    setBillData({
                      ...billData,
                      taxPercentage: tax,
                      servicePercentage: service,
                      discountPercentage: discount,
                    })
                  }
                  onNext={() => setCurrentStep(5)}
                  onBack={() => setCurrentStep(3)}
                />
              )}

              {currentStep === 5 && (
                <StepSummary
                  billData={billData}
                  onSave={handleSave}
                  onBack={() => setCurrentStep(4)}
                  onReset={resetBill}
                />
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}