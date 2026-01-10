import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Calculation utilities
export interface MenuItem {
  id: string
  name: string
  price: number
}

export interface Person {
  id: string
  name: string
}

export interface Assignment {
  menuItemId: string
  personId: string
  sharePercentage: number
}

export interface BillCalculations {
  subtotal: number
  taxAmount: number
  serviceAmount: number
  discountAmount: number
  total: number
  personBreakdowns: PersonBreakdown[]
}

export interface PersonBreakdown {
  personId: string
  personName: string
  itemsSubtotal: number
  taxShare: number
  serviceShare: number
  discountShare: number
  total: number
  items: Array<{
    menuItemId: string
    menuItemName: string
    price: number
    sharePercentage: number
    shareAmount: number
  }>
}

export function calculateBill(
  menuItems: MenuItem[],
  people: Person[],
  assignments: Assignment[],
  taxPercentage: number,
  servicePercentage: number,
  discountPercentage: number
): BillCalculations {
  // Calculate subtotal
  const subtotal = menuItems.reduce((sum, item) => sum + item.price, 0)

  // Calculate tax, service, and discount amounts
  const taxAmount = (subtotal * taxPercentage) / 100
  const serviceAmount = (subtotal * servicePercentage) / 100
  const discountAmount = (subtotal * discountPercentage) / 100
  const total = subtotal + taxAmount + serviceAmount - discountAmount

  // Round all monetary values to nearest integer
  const roundedSubtotal = Math.round(subtotal)
  const roundedTaxAmount = Math.round(taxAmount)
  const roundedServiceAmount = Math.round(serviceAmount)
  const roundedDiscountAmount = Math.round(discountAmount)
  const roundedTotal = Math.round(total)

  // Calculate per-person breakdowns
  const personBreakdowns: PersonBreakdown[] = people.map((person) => {
    // Find all assignments for this person
    const personAssignments = assignments.filter(
      (a) => a.personId === person.id
    )

    // Calculate items subtotal for this person
    let itemsSubtotal = 0
    const items = personAssignments.map((assignment) => {
      const menuItem = menuItems.find((item) => item.id === assignment.menuItemId)
      if (!menuItem) {
        return {
          menuItemId: assignment.menuItemId,
          menuItemName: 'Unknown',
          price: 0,
          sharePercentage: assignment.sharePercentage,
          shareAmount: 0,
        }
      }

      const shareAmount = (menuItem.price * assignment.sharePercentage) / 100
      itemsSubtotal += shareAmount

      return {
        menuItemId: menuItem.id,
        menuItemName: menuItem.name,
        price: menuItem.price,
        sharePercentage: assignment.sharePercentage,
        shareAmount: Math.round(shareAmount),
      }
    })

    // Calculate proportional shares of tax, service, and discount
    // Based on the person's share of the subtotal
    const subtotalShare = itemsSubtotal / subtotal
    const taxShare = taxAmount * subtotalShare
    const serviceShare = serviceAmount * subtotalShare
    const discountShare = discountAmount * subtotalShare

    const personTotal = itemsSubtotal + taxShare + serviceShare - discountShare

    return {
      personId: person.id,
      personName: person.name,
      itemsSubtotal: Math.round(itemsSubtotal),
      taxShare: Math.round(taxShare),
      serviceShare: Math.round(serviceShare),
      discountShare: Math.round(discountShare),
      total: Math.round(personTotal),
      items,
    }
  })

  return {
    subtotal: roundedSubtotal,
    taxAmount: roundedTaxAmount,
    serviceAmount: roundedServiceAmount,
    discountAmount: roundedDiscountAmount,
    total: roundedTotal,
    personBreakdowns,
  }
}