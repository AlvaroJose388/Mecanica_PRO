"use client"

import { useToast } from "@/hooks/use-toast"
import type { ToastProps } from "@/components/ui/toast"

export interface EnhancedToastProps extends Omit<ToastProps, 'variant'> {
  title?: React.ReactNode
  description?: React.ReactNode
}

export function useEnhancedToast() {
  const { toast: baseToast } = useToast()

  return {
    success: (props: EnhancedToastProps) =>
      baseToast({
        ...props,
        variant: "success" as const,
      }),

    error: (props: EnhancedToastProps) =>
      baseToast({
        ...props,
        variant: "destructive" as const,
      }),

    warning: (props: EnhancedToastProps) =>
      baseToast({
        ...props,
        variant: "warning" as const,
      }),

    info: (props: EnhancedToastProps) =>
      baseToast({
        ...props,
        variant: "info" as const,
      }),

    default: (props: EnhancedToastProps) =>
      baseToast({
        ...props,
        variant: "default" as const,
      }),
  }
}
