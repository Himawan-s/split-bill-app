"use client"

import { useState, useEffect } from "react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Person, MenuItem, Assignment } from "@/types/bill"
import { calculateBill } from "@/lib/utils"

interface StepReviewProps {
  people: Person[]
  menuItems: MenuItem[]
  assignments: Assignment[]
  taxPercentage: number
  servicePercentage: number
  discountPercentage: number
  onUpdate: (tax: number, service: number, discount: number) => void
  onNext: () => void
  onBack: () => void
}

export default function StepReview({
  people,
  menuItems,
  assignments,
  taxPercentage,
  servicePercentage,
  discountPercentage,
  onUpdate,
  onNext,
  onBack,
}: StepReviewProps) {
  const [tax, setTax] = useState(taxPercentage.toString())
  const [service, setService] = useState(servicePercentage.toString())
  const [discount, setDiscount] = useState(discountPercentage.toString())

  useEffect(() => {
    setTax(taxPercentage.toString())
    setService(servicePercentage.toString())
    setDiscount(discountPercentage.toString())
  }, [taxPercentage, servicePercentage, discountPercentage])

  const handleNext = () => {
    const taxNum = parseFloat(tax) || 0
    const serviceNum = parseFloat(service) || 0
    const discountNum = parseFloat(discount) || 0
    onUpdate(taxNum, serviceNum, discountNum)
    onNext()
  }

  const calculations = calculateBill(
    menuItems,
    people,
    assignments,
    parseFloat(tax) || 0,
    parseFloat(service) || 0,
    parseFloat(discount) || 0
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Calculate</h2>
        <p className="text-gray-600">Adjust tax, service, and discount percentages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Tax (%)"
          type="number"
          step="0.01"
          min="0"
          value={tax}
          onChange={(e) => setTax(e.target.value)}
          placeholder="0.00"
        />
        <Input
          label="Service (%)"
          type="number"
          step="0.01"
          min="0"
          value={service}
          onChange={(e) => setService(e.target.value)}
          placeholder="0.00"
        />
        <Input
          label="Discount (%)"
          type="number"
          step="0.01"
          min="0"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          placeholder="0.00"
        />
      </div>

      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Subtotal:</span>
          <span className="text-lg font-semibold text-gray-900">
            ${calculations.subtotal.toFixed(2)}
          </span>
        </div>

        {calculations.taxAmount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-700">
              Tax ({parseFloat(tax) || 0}%):
            </span>
            <span className="text-gray-900 font-medium">
              ${calculations.taxAmount.toFixed(2)}
            </span>
          </div>
        )}

        {calculations.serviceAmount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-700">
              Service ({parseFloat(service) || 0}%):
            </span>
            <span className="text-gray-900 font-medium">
              ${calculations.serviceAmount.toFixed(2)}
            </span>
          </div>
        )}

        {calculations.discountAmount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-700">
              Discount ({parseFloat(discount) || 0}%):
            </span>
            <span className="text-green-600 font-medium">
              -${calculations.discountAmount.toFixed(2)}
            </span>
          </div>
        )}

        <div className="border-t border-gray-300 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-sky-blue-600">
              ${calculations.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext}>
          Next: Final Summary
        </Button>
      </div>
    </div>
  )
}