import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { calculateBill } from "@/lib/utils"

const billSchema = z.object({
  title: z.string().optional(),
  people: z.array(z.object({
    name: z.string(),
  })),
  menuItems: z.array(z.object({
    name: z.string(),
    price: z.number().min(0),
  })),
  assignments: z.array(z.object({
    menuItemId: z.string(),
    personId: z.string(),
    sharePercentage: z.number().min(0).max(100),
  })),
  taxPercentage: z.number().min(0),
  servicePercentage: z.number().min(0),
  discountPercentage: z.number().min(0),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = billSchema.parse(body)

    // Map person IDs from client to temporary IDs for calculation
    const people = validatedData.people.map((p, idx) => ({
      id: idx.toString(),
      name: p.name,
    }))

    const menuItems = validatedData.menuItems.map((item, idx) => ({
      id: idx.toString(),
      name: item.name,
      price: item.price,
    }))

    // Map assignments using indices directly
    const assignments = validatedData.assignments.map((assignment) => ({
      menuItemId: assignment.menuItemId,
      personId: assignment.personId,
      sharePercentage: assignment.sharePercentage,
    }))

    // Calculate total amount
    const calculations = calculateBill(
      menuItems,
      people,
      assignments,
      validatedData.taxPercentage,
      validatedData.servicePercentage,
      validatedData.discountPercentage
    )

    // Create bill with all related data
    const bill = await prisma.bill.create({
      data: {
        userId: session.user.id,
        title: validatedData.title || "Untitled Bill",
        taxPercentage: validatedData.taxPercentage,
        servicePercentage: validatedData.servicePercentage,
        discountPercentage: validatedData.discountPercentage,
        totalAmount: Math.round(calculations.total),
        people: {
          create: validatedData.people.map((p) => ({
            name: p.name,
          })),
        },
        menuItems: {
          create: validatedData.menuItems.map((item) => ({
            name: item.name,
            price: Math.round(item.price),
          })),
        },
      },
      include: {
        people: true,
        menuItems: true,
      },
    })

    // Create assignments
    for (const assignment of validatedData.assignments) {
      const personIdx = parseInt(assignment.personId)
      const menuItemIdx = parseInt(assignment.menuItemId)

      if (
        !isNaN(personIdx) &&
        !isNaN(menuItemIdx) &&
        personIdx >= 0 &&
        personIdx < bill.people.length &&
        menuItemIdx >= 0 &&
        menuItemIdx < bill.menuItems.length
      ) {
        const person = bill.people[personIdx]
        const menuItem = bill.menuItems[menuItemIdx]

        if (person && menuItem) {
          await prisma.assignment.create({
            data: {
              menuItemId: menuItem.id,
              billId: bill.id,
              personId: person.id,
              sharePercentage: assignment.sharePercentage,
            },
          })
        }
      }
    }

    return NextResponse.json(
      { message: "Bill created successfully", billId: bill.id },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Bill creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get("days") || "30")
    const dateFrom = new Date()
    dateFrom.setDate(dateFrom.getDate() - days)

    const bills = await prisma.bill.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: dateFrom,
        },
      },
      include: {
        people: true,
        menuItems: true,
        assignments: {
          include: {
            person: true,
            menuItem: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ bills }, { status: 200 })
  } catch (error) {
    console.error("Error fetching bills:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}