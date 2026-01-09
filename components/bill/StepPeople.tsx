"use client"

import { useState } from "react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Person } from "@/types/bill"

interface StepPeopleProps {
  people: Person[]
  onUpdate: (people: Person[]) => void
  onNext: () => void
}

export default function StepPeople({ people, onUpdate, onNext }: StepPeopleProps) {
  const [name, setName] = useState("")

  const addPerson = () => {
    if (name.trim()) {
      const newPerson: Person = {
        id: Date.now().toString(),
        name: name.trim(),
      }
      onUpdate([...people, newPerson])
      setName("")
    }
  }

  const removePerson = (id: string) => {
    onUpdate(people.filter((p) => p.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addPerson()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add People</h2>
        <p className="text-gray-600">Enter the names of people joining this bill</p>
      </div>

      <div className="flex gap-3">
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter person name"
          className="flex-1"
        />
        <div className="flex items-end">
          <Button onClick={addPerson} disabled={!name.trim()}>
            Add
          </Button>
        </div>
      </div>

      {people.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700">People ({people.length})</h3>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 max-h-64 overflow-y-auto">
            {people.map((person) => (
              <div
                key={person.id}
                className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-gray-200"
              >
                <span className="text-gray-900 font-medium">{person.name}</span>
                <button
                  onClick={() => removePerson(person.id)}
                  className="text-red-500 hover:text-red-700 font-medium text-sm transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {people.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No people added yet. Add at least one person to continue.</p>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button onClick={onNext} disabled={people.length === 0}>
          Next: Add Menu Items
        </Button>
      </div>
    </div>
  )
}