import type { ButtonHTMLAttributes, ReactNode } from "react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: "primary" | "secondary" | "ghost"
}

const styleByVariant = {
  primary:
    "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400",
  secondary:
    "border border-white/30 bg-white/10 text-white hover:bg-white/20",
  ghost: "text-cyan-200 hover:text-cyan-100",
}

const Button = ({ children, className = "", variant = "primary", ...props }: ButtonProps) => {
  return (
    <button
      className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${styleByVariant[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
