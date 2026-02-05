type SectionHeaderProps = {
  eyebrow: string
  title: string
  subtitle: string
}

const SectionHeader = ({ eyebrow, title, subtitle }: SectionHeaderProps) => {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-slate-600">
        {subtitle}
      </p>
    </div>
  )
}

export default SectionHeader
