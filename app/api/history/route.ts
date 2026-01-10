import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic";

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
      select: {
        id: true,
        title: true,
        totalAmount: true,
        createdAt: true,
        people: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ bills }, { status: 200 })
  } catch (error) {
    console.error("Error fetching history:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}