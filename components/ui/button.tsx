import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
const buttonVariants = cva("inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50", {
  variants: { variant: { default: "bg-orange-600 text-white hover:bg-orange-700", secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200", outline: "border border-zinc-200 bg-white hover:bg-zinc-100", ghost: "hover:bg-zinc-100" }, size: { default: "h-10 px-6", sm: "h-8 px-4", lg: "h-12 px-8", icon: "h-10 w-10" } },
  defaultVariants: { variant: "default", size: "default" },
})
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
))
Button.displayName = "Button"
export { Button, buttonVariants }
