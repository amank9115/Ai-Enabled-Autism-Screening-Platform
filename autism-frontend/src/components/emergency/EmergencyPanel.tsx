import { AnimatePresence, motion } from "framer-motion"

type EmergencyPanelProps = {
  open: boolean
  onClose: () => void
}

const contacts = [
  { clinic: "Sunrise Child Neuro Clinic", eta: "8 min", phone: "+91 99801 22441" },
  { clinic: "Aster Pediatric Care Hub", eta: "12 min", phone: "+91 99872 18410" },
  { clinic: "City Autism Early Response", eta: "16 min", phone: "+91 99114 33008" },
]

const EmergencyPanel = ({ open, onClose }: EmergencyPanelProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          className="absolute top-16 right-0 z-40 w-80 rounded-2xl border border-rose-200/60 bg-white/95 p-4 shadow-2xl backdrop-blur-2xl dark:border-rose-400/20 dark:bg-slate-900/95"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-rose-600 dark:text-rose-300">Emergency Connect</p>
            <button onClick={onClose} className="text-xs text-slate-500 dark:text-slate-400">Close</button>
          </div>
          <div className="space-y-2">
            {contacts.map((item) => (
              <div key={item.clinic} className="rounded-xl border border-slate-200/70 bg-white/75 p-3 dark:border-slate-700 dark:bg-slate-800/65">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-100">{item.clinic}</p>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-300">ETA {item.eta} | {item.phone}</p>
                <button className="mt-2 rounded-lg bg-rose-500 px-3 py-1 text-[11px] font-semibold text-white">Alert Center</button>
              </div>
            ))}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

export default EmergencyPanel
