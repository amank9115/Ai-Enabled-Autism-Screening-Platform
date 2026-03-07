import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import BrandLogo from "../branding/BrandLogo"
import EmergencyPanel from "../emergency/EmergencyPanel"
import GlobalSearch from "../search/GlobalSearch"

const navItems = [
  { id: "hero", label: "Home" },
  { id: "problem", label: "Problem" },
  { id: "technology", label: "Technology" },
  { id: "features", label: "Features" },
  { id: "impact", label: "Impact" },
]

const popupMotion = {
  initial: { opacity: 0, y: -8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98 },
  transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const },
}

const GlassNavbar = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [emergencyOpen, setEmergencyOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!panelRef.current) return
      if (!panelRef.current.contains(event.target as Node)) setAccountOpen(false)
    }
    window.addEventListener("mousedown", onPointerDown)
    return () => window.removeEventListener("mousedown", onPointerDown)
  }, [])

  const goToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate(`/#${id}`)
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <header className="sticky top-4 z-50 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-2xl border border-slate-200/70 bg-white/65 p-3 shadow-[0_10px_40px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-slate-700/70 dark:bg-slate-900/55 dark:shadow-[0_10px_40px_rgba(2,6,23,0.5)]">
        <div className="flex items-center justify-between gap-3">
          <Link to="/">
            <BrandLogo />
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => goToSection(item.id)}
                className="rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100/80 hover:text-sky-600 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-sky-300"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="relative flex items-center gap-2" ref={panelRef}>
            <GlobalSearch />
            <button
              onClick={() => setEmergencyOpen((current) => !current)}
              className="rounded-xl border border-rose-300/60 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-600 dark:border-rose-400/40 dark:text-rose-300"
            >
              SOS
            </button>
            <button
              onClick={toggleTheme}
              className="rounded-xl border border-slate-300/70 bg-white/60 px-3 py-2 text-xs text-slate-700 dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-200"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>

            {!user ? (
              <>
                <button
                  onClick={() => setAccountOpen((current) => !current)}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-slate-300 bg-white/70 text-slate-700 transition hover:scale-105 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:bg-slate-700"
                  title="Account"
                  aria-label="Open account options"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M5 19C6.4 15.8 9 14.4 12 14.4C15 14.4 17.6 15.8 19 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>

                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      {...popupMotion}
                      className="absolute top-12 right-0 z-40 w-72 rounded-2xl border border-slate-200/70 bg-white/95 p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900/95"
                    >
                      <p className="px-1 text-xs text-slate-500 dark:text-slate-300">Account access</p>
                      <p className="mt-1 px-1 text-sm font-semibold text-slate-700 dark:text-slate-100">
                        Are you a new user or already have an account?
                      </p>

                      <div className="mt-3 space-y-2">
                        <button
                          onClick={() => {
                            setAccountOpen(false)
                            navigate("/auth")
                          }}
                          className="group w-full rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-400/60 dark:hover:bg-sky-500/10"
                        >
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">Already have account</p>
                          <p className="text-xs text-slate-500 dark:text-slate-300">Go to Login</p>
                        </button>
                        <button
                          onClick={() => {
                            setAccountOpen(false)
                            navigate("/auth?mode=register")
                          }}
                          className="group w-full rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-400/60 dark:hover:bg-emerald-500/10"
                        >
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">I am new user</p>
                          <p className="text-xs text-slate-500 dark:text-slate-300">Go to Registration</p>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <>
                <span className="hidden text-xs text-slate-600 sm:inline dark:text-slate-300">{user.name}</span>
                <button
                  onClick={() => {
                    logout()
                    navigate("/")
                  }}
                  className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
                >
                  Logout
                </button>
              </>
            )}
            <EmergencyPanel open={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
          </div>
        </div>
      </div>
    </header>
  )
}

export default GlassNavbar
