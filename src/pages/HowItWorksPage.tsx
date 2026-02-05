import Container from "../components/common/Container"
import FeatureCard from "../components/common/FeatureCard"
import SectionHeader from "../components/common/SectionHeader"

const HowItWorksPage = () => {
  return (
    <div className="space-y-16 pb-20">
      <section className="bg-linear-to-br from-sky-50 via-white to-blue-50 py-16">
        <Container>
          <SectionHeader
            eyebrow="How It Works"
            title="A step-by-step care intelligence flow built for clarity."
            subtitle="Every signal is traceable, every recommendation is explainable, and every decision stays in the hands of clinical teams."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Structured intake",
                description:
                  "Guided caregiver questionnaires, clinician observations, and environmental context capture early signals consistently.",
                accent: "sky",
              },
              {
                title: "Multimodal analysis",
                description:
                  "Video, audio, and interaction markers are analyzed with attention and engagement models designed for transparency.",
                accent: "indigo",
              },
              {
                title: "Explainable outputs",
                description:
                  "Clinicians receive insight summaries, confidence ranges, and supporting evidence for each signal.",
                accent: "emerald",
              },
            ].map((card) => (
              <FeatureCard key={card.title} {...card} />
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <SectionHeader
            eyebrow="Clinical Loop"
            title="Human oversight is embedded in every step."
            subtitle="NEUROLYTIX-AI does not replace clinicians. It amplifies their ability to see patterns early and coordinate long-term care."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-4">
            {[
              "Caregiver narrative + consent",
              "Clinician screening & triage",
              "AI signal interpretation",
              "Care pathway recommendations",
            ].map((step, index) => (
              <div
                key={step}
                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Step {index + 1}
                </p>
                <p className="mt-3 text-base font-semibold text-slate-900">
                  {step}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Clear handoffs ensure caregivers always know what happens next.
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}

export default HowItWorksPage

