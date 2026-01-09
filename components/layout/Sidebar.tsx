"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import Button from "@/components/ui/Button"

interface Bill {
  id: string
  title: string | null
  totalAmount: number
  createdAt: string
  people: Array<{
    id: string
    name: string
  }>
}

interface SidebarProps {
  onBillSelect?: (billId: string) => void
  onNewBill?: () => void
}

export default function Sidebar({ onBillSelect, onNewBill }: SidebarProps) {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [days])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/history?days=${days}`)
      if (response.ok) {
        const data = await response.json()
        setBills(data.bills || [])
      }
    } catch (error) {
      console.error("Error fetching history:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (billId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this bill?")) {
      return
    }

    try {
      const response = await fetch(`/api/bills/${billId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchHistory()
      }
    } catch (error) {
      console.error("Error deleting bill:", error)
    }
  }

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-sky-blue-500 text-white p-3 rounded-xl shadow-lg"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } fixed md:static inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-200 shadow-lg md:shadow-none transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Bill History</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {onNewBill && (
            <Button onClick={onNewBill} className="w-full mb-4">
              New Bill
            </Button>
          )}

          <div className="flex gap-2">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  days === d
                    ? "bg-sky-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <p>Loading...</p>
            </div>
          ) : bills.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No bills found in the last {days} days</p>
              {onNewBill && (
                <Button
                  onClick={onNewBill}
                  variant="outline"
                  className="mt-4"
                >
                  Create First Bill
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {bills.map((bill) => (
                <div
                  key={bill.id}
                  onClick={() => onBillSelect?.(bill.id)}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-sky-blue-300 hover:shadow-md transition cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {bill.title || "Untitled Bill"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(bill.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(bill.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-sm transition"
                      title="Delete bill"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-600">
                      {bill.people.length} {bill.people.length === 1 ? "person" : "people"}
                    </span>
                    <span className="text-lg font-bold text-sky-blue-600">
                      ${bill.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}