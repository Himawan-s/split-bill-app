"use client"

import { useState } from "react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { MenuItem } from "@/types/bill"

interface StepMenuProps {
  menuItems: MenuItem[]
  onUpdate: (items: MenuItem[]) => void
  onNext: () => void
  onBack: () => void
}

export default function StepMenu({ menuItems, onUpdate, onNext, onBack }: StepMenuProps) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")

  const addMenuItem = () => {
    if (name.trim() && price) {
      const priceNum = parseFloat(price)
      if (priceNum > 0) {
        const newItem: MenuItem = {
          id: Date.now().toString(),
          name: name.trim(),
          price: priceNum,
        }
        onUpdate([...menuItems, newItem])
        setName("")
        setPrice("")
      }
    }
  }

  const removeMenuItem = (id: string) => {
    onUpdate(menuItems.filter((item) => item.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addMenuItem()
    }
  }

  const subtotal = menuItems.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Menu Items</h2>
        <p className="text-gray-600">Enter the menu items and their prices</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Input
          label="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., Pizza"
          className="md:col-span-2"
        />
        <Input
          label="Price"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="0.00"
        />
      </div>
      <div className="flex justify-end">
        <Button onClick={addMenuItem} disabled={!name.trim() || !price || parseFloat(price) <= 0}>
          Add Item
        </Button>
      </div>

      {menuItems.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700">
            Menu Items ({menuItems.length})
          </h3>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 max-h-64 overflow-y-auto">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-gray-200"
              >
                <span className="text-gray-900 font-medium">{item.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-gray-700">${item.price.toFixed(2)}</span>
                  <button
                    onClick={() => removeMenuItem(item.id)}
                    className="text-red-500 hover:text-red-700 font-medium text-sm transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="font-semibold text-gray-900">Subtotal:</span>
            <span className="text-xl font-bold text-sky-blue-600">
              ${subtotal.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {menuItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No menu items added yet. Add at least one item to continue.</p>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={menuItems.length === 0}>
          Next: Assign Items
        </Button>
      </div>
    </div>
  )
}