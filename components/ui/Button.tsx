import { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  children: ReactNode
}

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-sky-blue-500 text-white hover:bg-sky-blue-600 focus:ring-sky-blue-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    outline: "border-2 border-sky-blue-500 text-sky-blue-500 hover:bg-sky-blue-50 focus:ring-sky-blue-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
  }

  return (
    <button
      className={cn(
        "px-6 py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}