"use client"

import { useState } from "react"
import Button from "@/components/ui/Button"
import { Person, MenuItem, Assignment, BillData } from "@/types/bill"
import { calculateBill } from "@/lib/utils"

interface StepSummaryProps {
  billData: BillData
  onSave: () => void
  onBack: () => void
  onReset: () => void
}

export default function StepSummary({
  billData,
  onSave,
  onBack,
  onReset,
}: StepSummaryProps) {
  const [saving, setSaving] = useState(false)

  const calculations = calculateBill(
    billData.menuItems,
    billData.people,
    billData.assignments,
    billData.taxPercentage,
    billData.servicePercentage,
    billData.discountPercentage
  )

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Final Summary</h2>
        <p className="text-gray-600">Review the bill breakdown before saving</p>
      </div>

      {/* Overall Summary */}
      <div className="bg-gradient-to-br from-sky-blue-50 to-white rounded-xl p-6 border-2 border-sky-blue-100">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="text-gray-900 text-lg font-semibold">
              Rp {calculations.subtotal.toLocaleString('id-ID')}
            </span>
          </div>
          {calculations.taxAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax ({billData.taxPercentage}%):</span>
              <span className="text-gray-900 font-medium">
                Rp {calculations.taxAmount.toLocaleString('id-ID')}
              </span>
            </div>
          )}
          {calculations.serviceAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service ({billData.servicePercentage}%):</span>
              <span className="text-gray-900 font-medium">
                Rp {calculations.serviceAmount.toLocaleString('id-ID')}
              </span>
            </div>
          )}
          {calculations.discountAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount ({billData.discountPercentage}%):</span>
              <span className="text-green-600 font-medium">
                -Rp {calculations.discountAmount.toLocaleString('id-ID')}
              </span>
            </div>
          )}
          <div className="border-t border-sky-blue-200 pt-3 mt-3">
            <div className="flex justify-between">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-sky-blue-600">
                Rp {calculations.total.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Per-Person Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Per-Person Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {calculations.personBreakdowns.map((breakdown) => (
            <div
              key={breakdown.personId}
              className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm"
            >
              <h4 className="font-semibold text-gray-900 mb-3">{breakdown.personName}</h4>
              
              {breakdown.items.length > 0 && (
                <div className="space-y-2 mb-4 text-sm">
                  {breakdown.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-gray-600">
                      <span className="truncate mr-2">
                        {item.menuItemName}
                        {item.sharePercentage < 100 && (
                          <span className="text-xs text-gray-400">
                            {" "}({item.sharePercentage.toFixed(0)}%)
                          </span>
                        )}
                      </span>
                      <span className="font-medium">Rp {item.shareAmount.toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-200 pt-3 space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Items:</span>
                  <span>Rp {breakdown.itemsSubtotal.toLocaleString('id-ID')}</span>
                </div>
                {breakdown.taxShare > 0 && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Tax:</span>
                    <span>Rp {breakdown.taxShare.toLocaleString('id-ID')}</span>
                  </div>
                )}
                {breakdown.serviceShare > 0 && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Service:</span>
                    <span>Rp {breakdown.serviceShare.toLocaleString('id-ID')}</span>
                  </div>
                )}
                {breakdown.discountShare > 0 && (
                  <div className="flex justify-between text-xs text-green-600">
                    <span>Discount:</span>
                    <span>-Rp {breakdown.discountShare.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sky-blue-600 pt-1">
                  <span>Total:</span>
                  <span>Rp {breakdown.total.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button variant="ghost" onClick={onReset}>
            Start Over
          </Button>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Bill"}
        </Button>
      </div>
    </div>
  )
}