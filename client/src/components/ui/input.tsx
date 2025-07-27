import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Minimal, borderless, underlined input
          "block w-full border-0 border-b-2 border-muted-foreground bg-transparent px-0 py-2 text-base font-sans text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
