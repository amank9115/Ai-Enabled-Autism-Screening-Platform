import { motion } from "framer-motion"
import type { AuthMethod } from "../../services/authApi"

const tabs: { key: AuthMethod; label: string }[] = [
  { key: "password", label: "Email + Password" },
  { key: "emailOtp", label: "Email OTP" },
  { key: "phoneOtp", label: "Phone OTP" },
]

const AuthMethodTabs = ({ value, onChange }: { value: AuthMethod; onChange: (method: AuthMethod) => void }) => {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white/60 p-1 dark:border-slate-700 dark:bg-slate-900/55">
      <div className="grid grid-cols-3 gap-1">
        {tabs.map((tab) => {
          const active = value === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`relative rounded-lg px-2 py-2 text-[11px] font-medium transition sm:text-xs ${
                active ? "text-white dark:text-slate-900" : "text-slate-500 hover:text-slate-700 dark:text-slate-300"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="method-pill"
                  className="absolute inset-0 -z-10 rounded-lg bg-slate-900 dark:bg-slate-100"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {tab.label}
            </button>
          )
        })}
      </div>
      <div className="relative mt-1 h-[2px] w-full bg-slate-200/80 dark:bg-slate-700/80">
        <motion.div
          className="absolute top-0 h-[2px] rounded-full bg-gradient-to-r from-sky-500 to-emerald-500"
          animate={{ x: value === "password" ? "0%" : value === "emailOtp" ? "100%" : "200%" }}
          transition={{ type: "spring", stiffness: 360, damping: 30 }}
          style={{ width: "33.3333%" }}
        />
      </div>
    </div>
  )
}

export default AuthMethodTabs
