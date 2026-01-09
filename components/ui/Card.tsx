import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface CardProps {
  children: ReactNode
  className?: string
  padding?: "none" | "sm" | "md" | "lg"
}

export default function Card({ children, className, padding = "md" }: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  }

  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-lg border border-gray-100",
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  )
}