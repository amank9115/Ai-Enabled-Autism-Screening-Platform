import Container from "../components/common/Container"
import FeatureCard from "../components/common/FeatureCard"
import SectionHeader from "../components/common/SectionHeader"
import StatCard from "../components/common/StatCard"

const LandingPage = () => {
  return (
    <div className="space-y-20 pb-20">
      <section className="relative overflow-hidden bg-linear-to-br from-sky-50 via-white to-blue-50">
        <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />

        <Container>
          <div className="grid gap-12 py-20 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                AI-Powered Early Neurodevelopment Care
              </p>
              <h1 className="mt-6 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                NEUROLYTIX-AI helps clinicians and caregivers surface early
                neurodevelopment risk signals with calm, explainable intelligence.
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                We do not diagnose. We illuminate patterns, reduce uncertainty,
                and guide proactive support through transparent AI and clinical
                collaboration.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button className="rounded-full bg-slate-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5">
                  Request Pilot
                </button>
                <button className="rounded-full border border-slate-200 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                  View Platform
                </button>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <StatCard
                  label="Signal Engine"
                  value="120+"
                  detail="Behavioral and attention markers monitored"
                />
                <StatCard
                  label="Explainability"
                  value="95%"
                  detail="Clinician-rated clarity in pilot summaries"
                />
                <StatCard
                  label="Access"
                  value="Low-bandwidth"
                  detail="Offline-first kits for remote sites"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Live Care Map
                </p>
                <div className="mt-4 rounded-2xl bg-slate-900 px-4 py-6 text-white">
                  <p className="text-sm font-semibold">Family Support Rhythm</p>
                  <p className="mt-2 text-xs text-slate-200">
                    AI highlights emerging attention patterns and suggests
                    intervention timing.
                  </p>
                  <div className="mt-4 grid gap-3">
                    {["Engagement micro-signals", "Co-regulation cues", "Sensory load markers"].map(
                      (item) => (
                        <div
                          key={item}
                          className="rounded-xl bg-white/10 px-3 py-2 text-xs"
                        >
                          {item}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Clinician Console
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    "Confidence indicators calibrated per cohort",
                    "Explainable summaries for shared decision making",
                    "Bias checks with demographic parity monitoring",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <SectionHeader
            eyebrow="How It Works"
            title="A transparent, clinician-led loop that turns signals into action."
            subtitle="NEUROLYTIX-AI blends structured caregiver input, multi-modal observations, and explainable AI to surface risk patterns while keeping human oversight front and center."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Capture",
                description:
                  "Caregivers and clinicians collect structured observations, brief videos, and environmental context with guided prompts.",
                accent: "sky",
              },
              {
                title: "Interpret",
                description:
                  "Our AI interprets attention, engagement, and co-regulation signals and explains why each insight matters.",
                accent: "indigo",
              },
              {
                title: "Act",
                description:
                  "Clinicians receive a prioritized care map, risk-informed guidance, and tailored support pathways.",
                accent: "emerald",
              },
            ].map((card) => (
              <FeatureCard key={card.title} {...card} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container>
          <div className="grid gap-12 py-16 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Trust Layer
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-slate-900">
                Ethical AI, built for healthcare governance.
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>Human-in-the-loop review at every decision stage.</li>
                <li>No diagnosis output, only risk context and actionability.</li>
                <li>Bias, drift, and data quality monitoring dashboards.</li>
                <li>Informed consent and data minimization by design.</li>
              </ul>
            </div>
            <div>
              <SectionHeader
                eyebrow="Platform Highlights"
                title="Designed for clinical integrity, compassionate care, and global reach."
                subtitle="From high-resource hospitals to low-bandwidth community clinics, NEUROLYTIX-AI is built to maintain trust, clarity, and measurable impact."
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: "Behavioral intelligence engine",
                    description:
                      "Multi-signal modeling across attention, engagement, and sensory regulation.",
                    accent: "sky",
                  },
                  {
                    title: "Explainable insights",
                    description:
                      "Natural-language summaries with confidence indicators clinicians can audit.",
                    accent: "indigo",
                  },
                  {
                    title: "Caregiver dashboards",
                    description:
                      "Clear progress stories without medical jargon or alarmism.",
                    accent: "emerald",
                  },
                  {
                    title: "Offline support",
                    description:
                      "Lightweight mobile flows optimized for rural and remote clinics.",
                    accent: "violet",
                  },
                ].map((card) => (
                  <FeatureCard key={card.title} {...card} />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <SectionHeader
            eyebrow="Impact"
            title="Early signals unlock earlier care, better outcomes, and stronger caregiver confidence."
            subtitle="Our mission is to close the gap between first concern and specialist support with technology that respects clinical autonomy."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "Time to action",
                value: "4x faster",
                detail: "Pilot programs reduced time-to-care planning.",
              },
              {
                label: "Caregiver confidence",
                value: "89%",
                detail: "Reported feeling more informed and supported.",
              },
              {
                label: "Clinical alignment",
                value: "92%",
                detail: "Clinicians agreed AI insights were actionable.",
              },
            ].map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-slate-900">
        <Container>
          <div className="flex flex-col gap-8 py-16 text-white lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">
                Ready to partner
              </p>
              <h3 className="mt-4 text-3xl font-semibold">
                Bring NEUROLYTIX-AI into your clinical pathway.
              </h3>
              <p className="mt-3 text-sm text-slate-200">
                We collaborate with hospitals, government health agencies, and
                care networks to deploy ethical AI for early screening support.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:-translate-y-0.5">
                Schedule a demo
              </button>
              <button className="rounded-full border border-white/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white/10">
                Download overview
              </button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}

export default LandingPage

