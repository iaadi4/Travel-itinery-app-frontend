import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "bg-transparent border-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:border-none placeholder:text-primary",
        className
      )}
      {...props}
    />
  )
}

export { Input }
