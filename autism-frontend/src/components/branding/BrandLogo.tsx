const BrandLogo = () => {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-xl border border-sky-100 bg-white shadow-lg shadow-sky-500/20 sm:h-12 sm:w-12">
        <img
          src="/manassaathi-logo.svg"
          alt="Manassaathi logo"
          className="h-full w-full object-contain scale-[1.06]"
        />
      </div>

      <div className="leading-tight">
        <p className="text-[9px] tracking-[0.18em] text-sky-500 uppercase dark:text-sky-300">AI Platform</p>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 sm:text-base">MANASSAATHI</p>
      </div>
    </div>
  )
}

export default BrandLogo
