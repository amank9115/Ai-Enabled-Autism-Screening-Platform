import type { ButtonHTMLAttributes, ReactNode } from "react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: "primary" | "secondary" | "ghost"
}

const styleByVariant = {
  primary:
    "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400",
  secondary:
    "border border-slate-300 bg-white/70 text-slate-700 hover:bg-white dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-800",
  ghost: "text-sky-600 hover:text-sky-500 dark:text-cyan-200 dark:hover:text-cyan-100",
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
