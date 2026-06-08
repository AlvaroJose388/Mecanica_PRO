"use client"

import { useToast as useToastBase } from "@/hooks/use-toast"
import type { ToastActionElement } from "@/components/ui/toast"

interface EnhancedToastProps {
  title?: string
  description?: React.ReactNode
  action?: ToastActionElement
  duration?: number
}

type ToastVariant = "default" | "destructive" | "success" | "warning" | "info"

export function useEnhancedToast() {
  const { toast } = useToastBase()

  const showToast = (variant: ToastVariant, props: EnhancedToastProps) => {
    const icons = {
      default: null,
      destructive: "❌",
      success: "✅",
      warning: "⚠️",
      info: "ℹ️",
    }

    const icon = icons[variant]
    const title = props.title ? `${icon ? icon + " " : ""}${props.title}` : undefined

    return toast({
      ...props,
      title,
      variant: variant as any,
      duration: props.duration || 3000,
    })
  }

  return {
    success: (props: EnhancedToastProps) => showToast("success", props),
    error: (props: EnhancedToastProps) => showToast("destructive", props),
    warning: (props: EnhancedToastProps) => showToast("warning", props),
    info: (props: EnhancedToastProps) => showToast("info", props),
    default: (props: EnhancedToastProps) => showToast("default", props),
    toast,
  }
}
