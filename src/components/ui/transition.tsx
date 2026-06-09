"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface TransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "fade" | "slide" | "scale"
  duration?: "fast" | "normal" | "slow"
  delay?: number
}

const durationMap = {
  fast: "duration-200",
  normal: "duration-300",
  slow: "duration-500",
}

const typeMap = {
  fade: "animate-in fade-in",
  slide: "animate-in slide-in-from-bottom",
  scale: "animate-in zoom-in",
}

export const Transition = React.forwardRef<HTMLDivElement, TransitionProps>(
  (
    {
      type = "fade",
      duration = "normal",
      delay = 0,
      className,
      style,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(typeMap[type], durationMap[duration], className)}
      style={{
        ...style,
        animationDelay: `${delay}ms`,
      }}
      {...props}
    />
  )
)
Transition.displayName = "Transition"

// Helper component para multi-item transitions
interface TransitionGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  staggerDelay?: number
  type?: "fade" | "slide" | "scale"
  duration?: "fast" | "normal" | "slow"
}

export function TransitionGroup({
  children,
  staggerDelay = 100,
  type = "fade",
  duration = "normal",
  className,
  ...props
}: TransitionGroupProps) {
  return (
    <div className={className} {...props}>
      {React.Children.map(children, (child, index) => (
        <Transition
          key={index}
          type={type}
          duration={duration}
          delay={index * staggerDelay}
        >
          {child}
        </Transition>
      ))}
    </div>
  )
}
