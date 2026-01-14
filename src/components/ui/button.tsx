import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium " +
  "transition-all duration-200 ease-out " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-primary-border " +
          "hover:scale-[1.02] hover:shadow-md hover:brightness-110 " +
          "active:scale-[0.98] active:shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground border border-destructive-border " +
          "hover:scale-[1.02] hover:shadow-md hover:brightness-110 " +
          "active:scale-[0.98] active:shadow-sm",
        outline:
          "border border-input bg-background shadow-sm " +
          "hover:bg-accent hover:text-accent-foreground hover:shadow-md " +
          "active:shadow-none",
        secondary:
          "bg-secondary text-secondary-foreground border border-secondary-border " +
          "hover:bg-secondary/80 hover:shadow-sm " +
          "active:bg-secondary/70",
        ghost:
          "border border-transparent " +
          "hover:bg-accent hover:text-accent-foreground",
        // 新增: 品牌主按鈕樣式 (深咖啡色)
        brand:
          "bg-primary text-primary-foreground border-none shadow-md " +
          "hover:scale-[1.03] hover:shadow-lg hover:brightness-110 " +
          "active:scale-[0.98] active:shadow-sm",
      },
      size: {
        default: "min-h-10 px-5 py-2.5 rounded-xl",
        sm: "min-h-9 px-4 py-2 text-xs rounded-lg",
        lg: "min-h-12 px-8 py-3 text-base rounded-xl",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
