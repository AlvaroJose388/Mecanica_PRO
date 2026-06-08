"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "ghost" | "accent"
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
}

const variantClasses = {
  default: "border-primary",
  ghost: "border-muted-foreground",
  accent: "border-blue-500",
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-solid border-r-transparent",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
)
Spinner.displayName = "Spinner"

interface LoadingStateProps {
  isLoading: boolean
  children: React.ReactNode
  loadingText?: string
  spinnerSize?: "sm" | "md" | "lg"
  fullScreen?: boolean
}

export function LoadingState({
  isLoading,
  children,
  loadingText = "Cargando...",
  spinnerSize = "md",
  fullScreen = false,
}: LoadingStateProps) {
  if (!isLoading) return <>{children}</>

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <Spinner size={spinnerSize} />
          <p className="text-sm text-muted-foreground">{loadingText}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Spinner size={spinnerSize} />
      <span className="text-sm text-muted-foreground">{loadingText}</span>
    </div>
  )
}
