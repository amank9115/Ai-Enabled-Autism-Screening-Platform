import type { ReactNode } from "react"

type GlassCardProps = {
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
}

const GlassCard = ({ title, subtitle, children, className = "" }: GlassCardProps) => {
  return (
    <section
      className={`rounded-2xl border border-white/15 bg-white/[0.06] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl ${className}`}
    >
      {(title || subtitle) && (
        <header className="mb-4">
          {title && <h3 className="text-lg font-semibold text-slate-100">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-slate-300/80">{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  )
}

export default GlassCard
