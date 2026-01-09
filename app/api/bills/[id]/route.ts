import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const bill = await prisma.bill.findUnique({
      where: {
        id,
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
    })

    if (!bill) {
      return NextResponse.json(
        { error: "Bill not found" },
        { status: 404 }
      )
    }

    if (bill.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    return NextResponse.json({ bill }, { status: 200 })
  } catch (error) {
    console.error("Error fetching bill:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const bill = await prisma.bill.findUnique({
      where: {
        id,
      },
    })

    if (!bill) {
      return NextResponse.json(
        { error: "Bill not found" },
        { status: 404 }
      )
    }

    if (bill.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    await prisma.bill.delete({
      where: {
        id,
      },
    })

    return NextResponse.json(
      { message: "Bill deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting bill:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}