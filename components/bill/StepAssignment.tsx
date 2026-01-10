"use client"

import { useState, useEffect } from "react"
import Button from "@/components/ui/Button"
import { Person, MenuItem, Assignment } from "@/types/bill"

interface StepAssignmentProps {
  people: Person[]
  menuItems: MenuItem[]
  assignments: Assignment[]
  onUpdate: (assignments: Assignment[]) => void
  onNext: () => void
  onBack: () => void
}

export default function StepAssignment({
  people,
  menuItems,
  assignments,
  onUpdate,
  onNext,
  onBack,
}: StepAssignmentProps) {
  const [selectedAssignments, setSelectedAssignments] = useState<Map<string, Set<string>>>(
    new Map()
  )

  useEffect(() => {
    // Initialize selected assignments from props
    const initial = new Map<string, Set<string>>()
    assignments.forEach((assignment) => {
      if (!initial.has(assignment.menuItemId)) {
        initial.set(assignment.menuItemId, new Set())
      }
      initial.get(assignment.menuItemId)!.add(assignment.personId)
    })
    setSelectedAssignments(initial)
  }, [])

  const toggleAssignment = (menuItemId: string, personId: string) => {
    const newAssignments = new Map(selectedAssignments)
    
    if (!newAssignments.has(menuItemId)) {
      newAssignments.set(menuItemId, new Set())
    }
    
    const personsSet = newAssignments.get(menuItemId)!
    if (personsSet.has(personId)) {
      personsSet.delete(personId)
      if (personsSet.size === 0) {
        newAssignments.delete(menuItemId)
      }
    } else {
      personsSet.add(personId)
    }
    
    setSelectedAssignments(newAssignments)
  }

  const handleNext = () => {
    // Convert selected assignments to Assignment objects
    const newAssignments: Assignment[] = []
    selectedAssignments.forEach((personIds, menuItemId) => {
      // Calculate share percentage for each person (equal split)
      const sharePercentage = 100 / personIds.size
      personIds.forEach((personId) => {
        newAssignments.push({
          menuItemId,
          personId,
          sharePercentage,
        })
      })
    })
    onUpdate(newAssignments)
    onNext()
  }

  const isMenuItemAssigned = (menuItemId: string) => {
    return selectedAssignments.has(menuItemId) && 
           selectedAssignments.get(menuItemId)!.size > 0
  }

  const getAssignedPeopleForItem = (menuItemId: string) => {
    const personIds = selectedAssignments.get(menuItemId)
    if (!personIds) return []
    return people.filter((p) => personIds.has(p.id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Assign Items to People</h2>
        <p className="text-gray-600">Select which people ordered each menu item</p>
      </div>

      {menuItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No menu items to assign. Please go back and add menu items.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {menuItems.map((item) => {
            const assignedPeople = getAssignedPeopleForItem(item.id)
            const isAssigned = isMenuItemAssigned(item.id)
            const sharePercentage = isAssigned 
              ? (100 / selectedAssignments.get(item.id)!.size).toFixed(1)
              : 0

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl p-6 border-2 transition ${
                  isAssigned
                    ? "border-sky-blue-500 shadow-md"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                     <p className="text-gray-600">Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                  {isAssigned && (
                    <div className="text-right">
                      <span className="text-sm text-gray-600">
                        {assignedPeople.length} {assignedPeople.length === 1 ? "person" : "people"}
                      </span>
                      <p className="text-xs text-gray-500">
                        {sharePercentage}% each
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {people.map((person) => {
                    const isSelected = selectedAssignments
                      .get(item.id)
                      ?.has(person.id) || false

                    return (
                      <button
                        key={person.id}
                        onClick={() => toggleAssignment(item.id, person.id)}
                        className={`px-4 py-2 rounded-lg border-2 transition font-medium text-sm ${
                          isSelected
                            ? "bg-sky-blue-50 border-sky-blue-500 text-sky-blue-700"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:border-sky-blue-300"
                        }`}
                      >
                        {person.name}
                      </button>
                    )
                  })}
                </div>

                {!isAssigned && (
                  <p className="mt-3 text-sm text-amber-600">
                    {"⚠️ This item hasn't been assigned to anyone yet"}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={selectedAssignments.size === 0}
        >
          Next: Review & Calculate
        </Button>
      </div>
    </div>
  )
}