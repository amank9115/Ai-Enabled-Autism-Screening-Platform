import Container from "../components/common/Container"
import SectionHeader from "../components/common/SectionHeader"

const RoadmapPage = () => {
  return (
    <div className="space-y-16 pb-20">
      <section className="bg-linear-to-br from-sky-50 via-white to-blue-50 py-16">
        <Container>
          <SectionHeader
            eyebrow="Future Roadmap"
            title="Advancing care intelligence responsibly."
            subtitle="Our roadmap balances scientific rigor, ethical safeguards, and real-world healthcare impact."
          />
        </Container>
      </section>

      <section>
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                phase: "Now",
                items: [
                  "Expanded multimodal screening",
                  "Clinician calibration program",
                  "Caregiver support ecosystem",
                ],
              },
              {
                phase: "Next",
                items: [
                  "Digital twin simulations for care scenarios",
                  "Longitudinal outcome tracking",
                  "Adaptive care pathway recommendations",
                ],
              },
              {
                phase: "Future",
                items: [
                  "Global research collaborations",
                  "Federated learning for privacy",
                  "Population health intelligence dashboards",
                ],
              },
            ].map((phase) => (
              <div
                key={phase.phase}
                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {phase.phase}
                </p>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {phase.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}

export default RoadmapPage

