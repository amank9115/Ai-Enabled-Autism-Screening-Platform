import { motion } from "framer-motion"
import { Link } from "react-router-dom"

const story = [
  {
    id: "problem",
    title: "The Problem",
    phrase: "Early signs are subtle, fragmented, and often delayed in care pathways.",
    image: "https://images.unsplash.com/photo-1584516150909-c43483ee793a?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "technology",
    title: "AI Technology",
    phrase: "Explainable multimodal behavior intelligence built for clinicians and families.",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "features",
    title: "Platform Features",
    phrase: "Live screening, dashboards, timelines, and coordinated care collaboration.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "impact",
    title: "Impact",
    phrase: "Earlier intervention opportunities and stronger long-term developmental support.",
    image: "https://images.unsplash.com/photo-1486825586573-7131f7991bdd?auto=format&fit=crop&w=1400&q=80",
  },
]

const LandingPage = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <header id="hero" className="grid items-center gap-6 pt-16 pb-14 lg:grid-cols-[1.08fr_0.92fr]">
        <div>
          <p className="text-xs tracking-[0.28em] text-sky-500 uppercase dark:text-sky-300">ManasSaathi AI</p>
          <h1 className="mt-3 text-5xl leading-tight font-semibold text-slate-800 dark:text-slate-100 sm:text-6xl">
            A story of earlier clarity,
            <br />
            kinder outcomes.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-slate-500 dark:text-slate-300">
            An AI-enabled autism behavioral intelligence platform designed for trust, transparency, and early care action.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => document.getElementById("problem")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Start The Story
            </button>
            <Link
              to="/auth"
              className="rounded-xl border border-slate-300 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100"
            >
              Join The Platform
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/55"
        >
          <img
            src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1600&q=80"
            alt="AI healthcare interface"
            loading="lazy"
            className="h-64 w-full rounded-2xl object-cover"
          />
          <div className="absolute right-8 bottom-8 rounded-xl border border-white/40 bg-slate-950/65 px-3 py-2 text-xs text-cyan-100">
            Eye Contact 74% | Attention 81% | Emotion 76%
          </div>
        </motion.div>
      </header>

      <div className="space-y-10">
        {story.map((section, index) => (
          <motion.article
            key={section.id}
            id={section.id}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ delay: index * 0.05, duration: 0.55 }}
            className="grid overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur-xl md:grid-cols-[1fr_0.45fr] dark:border-slate-700 dark:bg-slate-900/55"
          >
            <div className="p-8">
              <p className="text-xs tracking-[0.2em] text-sky-500 uppercase dark:text-sky-300">{section.title}</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-800 dark:text-slate-100 sm:text-4xl">{section.phrase}</h2>
            </div>
            <img src={section.image} alt={section.title} loading="lazy" className="h-52 w-full object-cover md:h-full" />
          </motion.article>
        ))}
      </div>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        className="mt-12 rounded-3xl border border-slate-200/70 bg-white/75 p-8 text-center backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/55"
      >
        <p className="text-xs tracking-[0.2em] text-sky-500 uppercase dark:text-sky-300">Final Chapter</p>
        <h3 className="mt-2 text-3xl font-semibold text-slate-800 dark:text-slate-100">Ready to transform screening into early support?</h3>
        <div className="mt-5 flex justify-center gap-3">
          <Link to="/auth" className="rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white">
            Create Account
          </Link>
          <Link
            to="/live-screening"
            className="rounded-xl border border-slate-300 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100"
          >
            Explore Demo
          </Link>
        </div>
      </motion.section>
    </section>
  )
}

export default LandingPage
