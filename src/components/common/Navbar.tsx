import { NavLink } from "react-router-dom"

const navLinks = [
  { label: "Landing", to: "/" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Features", to: "/features" },
  { label: "Technology", to: "/technology" },
  { label: "Caregivers", to: "/caregivers" },
  { label: "Clinicians", to: "/clinicians" },
  { label: "Impact", to: "/impact" },
  { label: "About", to: "/about" },
  { label: "Roadmap", to: "/roadmap" },
]

const linkBase =
  "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition"

const Navbar = () => {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200">
            <span className="text-sm font-semibold">N</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">NEUROLYTIX-AI</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Care Intelligence
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-2 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 sm:inline-flex"
          >
            Clinician Login
          </button>
          <button
            type="button"
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Request Pilot
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar

