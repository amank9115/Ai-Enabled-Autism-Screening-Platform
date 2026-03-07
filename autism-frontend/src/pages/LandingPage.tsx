import { motion } from "framer-motion"
import HeroSection from "../components/story/HeroSection"
import NarrativeBlocks from "../components/story/NarrativeBlocks"
import StoryFlowSection from "../components/story/StoryFlowSection"
import GlassCard from "../components/ui/GlassCard"

const LandingPage = () => {
  return (
    <>
      <HeroSection />
      <StoryFlowSection />
      <NarrativeBlocks />

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid gap-4 md:grid-cols-3"
        >
          <GlassCard title="94%">
            <p className="text-sm text-slate-300">session continuity across home-clinic workflows</p>
          </GlassCard>
          <GlassCard title="Explainable AI">
            <p className="text-sm text-slate-300">clinician-facing confidence and factor-level behavior traces</p>
          </GlassCard>
          <GlassCard title="Privacy First">
            <p className="text-sm text-slate-300">consent-aware upload flows and role-based review access</p>
          </GlassCard>
        </motion.div>
      </section>
    </>
  )
}

export default LandingPage
