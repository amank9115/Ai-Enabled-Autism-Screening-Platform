import { useMemo, useState } from "react"

const searchCorpus = [
  "Doctors nearby",
  "Therapy routines",
  "Behavior report",
  "AI screening",
  "Parent help",
  "Video analysis",
  "Case management",
  "Emergency clinics",
]

const GlobalSearch = () => {
  const [query, setQuery] = useState("")
  const results = useMemo(
    () => searchCorpus.filter((item) => item.toLowerCase().includes(query.toLowerCase())).slice(0, 5),
    [query],
  )

  return (
    <div className="relative hidden lg:block" data-cursor="interactive">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search doctors, reports, help"
        className="w-64 rounded-xl border border-slate-300/45 bg-white/55 px-4 py-2 text-sm text-slate-700 outline-none backdrop-blur-xl placeholder:text-slate-500 dark:border-slate-600/65 dark:bg-slate-900/50 dark:text-slate-100 dark:placeholder:text-slate-400"
      />
      {query && (
        <div className="absolute top-12 left-0 z-30 w-full rounded-xl border border-slate-200/70 bg-white/95 p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900/95">
          {results.length > 0 ? (
            results.map((item) => (
              <button key={item} className="block w-full rounded-md px-2 py-1 text-left text-xs text-slate-600 hover:bg-sky-500/10 dark:text-slate-300">
                {item}
              </button>
            ))
          ) : (
            <p className="px-2 py-1 text-xs text-slate-500">No results</p>
          )}
        </div>
      )}
    </div>
  )
}

export default GlobalSearch
