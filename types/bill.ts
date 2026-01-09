export interface Person {
  id: string
  name: string
}

export interface MenuItem {
  id: string
  name: string
  price: number
}

export interface Assignment {
  menuItemId: string
  personId: string
  sharePercentage: number
}

export interface BillData {
  title?: string
  people: Person[]
  menuItems: MenuItem[]
  assignments: Assignment[]
  taxPercentage: number
  servicePercentage: number
  discountPercentage: number
}

export interface BillWithRelations {
  id: string
  title: string | null
  taxPercentage: number
  servicePercentage: number
  discountPercentage: number
  totalAmount: number
  createdAt: Date
  people: Array<{
    id: string
    name: string
  }>
  menuItems: Array<{
    id: string
    name: string
    price: number
  }>
  assignments: Array<{
    id: string
    menuItemId: string
    personId: string
    sharePercentage: number
  }>
}