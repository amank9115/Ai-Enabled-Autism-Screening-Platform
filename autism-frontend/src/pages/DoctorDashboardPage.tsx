import { useEffect, useState } from "react"
import AttentionHeatmap from "../components/charts/AttentionHeatmap"
import SessionComparisonChart from "../components/charts/SessionComparisonChart"
import GlassCard from "../components/ui/GlassCard"
import { analysisApi } from "../services/api/analysisApi"
import type { ChildProfile, SessionSummary } from "../types"

const sessionComparisonData = [
  { label: "Baseline", attention: 61, engagement: 57 },
  { label: "Week 2", attention: 68, engagement: 63 },
  { label: "Week 4", attention: 73, engagement: 69 },
  { label: "Week 5", attention: 77, engagement: 72 },
]

const DoctorDashboardPage = () => {
  const [patients, setPatients] = useState<ChildProfile[]>([])
  const [sessions, setSessions] = useState<SessionSummary[]>([])

  useEffect(() => {
    const load = async () => {
      const [profiles, history] = await Promise.all([
        analysisApi.getChildProfiles(),
        analysisApi.getSessionHistory(),
      ])
      setPatients(profiles)
      setSessions(history)
    }
    void load()
  }, [])

  return (
    <section className="mx-auto max-w-7xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-3xl font-semibold text-white">Doctor / Clinic Dashboard</h1>
        <p className="mt-2 text-sm text-slate-300">Patient-centric behavioral intelligence for screening review and recommendation planning.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard title="Patient List">
          <div className="space-y-2">
            {patients.map((child) => (
              <div key={child.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm">
                <div>
                  <p className="font-medium text-slate-100">{child.name}</p>
                  <p className="text-xs text-slate-400">{child.id} | {child.age} | Last session {child.lastSession}</p>
                </div>
                <span className="rounded-md bg-white/10 px-2 py-1 text-xs text-cyan-100">{child.riskLevel}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="AI Explanation Panel">
          <ul className="space-y-3 text-sm text-slate-300">
            <li>- Primary factors: reduced response consistency to social cue prompts.</li>
            <li>- Confidence note: higher noise in home-session segment 03:10 to 04:00.</li>
            <li>- Explainability: attention drop coincides with abrupt environment shift.</li>
          </ul>
        </GlassCard>

        <GlassCard title="Session History" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-slate-400">
                <tr>
                  <th className="px-3 py-2">Session</th>
                  <th className="px-3 py-2">Child</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Duration</th>
                  <th className="px-3 py-2">Attention Avg</th>
                  <th className="px-3 py-2">Risk</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id} className="border-t border-white/10 text-slate-200">
                    <td className="px-3 py-2">{session.id}</td>
                    <td className="px-3 py-2">{session.childName}</td>
                    <td className="px-3 py-2">{session.date}</td>
                    <td className="px-3 py-2">{session.duration}</td>
                    <td className="px-3 py-2">{session.attentionAverage}%</td>
                    <td className="px-3 py-2">{session.riskScore}%</td>
                    <td className="px-3 py-2">{session.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard title="Session Comparison">
          <SessionComparisonChart data={sessionComparisonData} />
        </GlassCard>

        <GlassCard title="Attention Heatmap">
          <AttentionHeatmap />
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard title="Video Review Interface">
          <div className="h-48 rounded-xl border border-white/15 bg-slate-950/80 p-3 text-sm text-slate-300">
            Timestamp markers: [00:42] gaze aversion spike, [02:11] gesture mirroring detected, [03:25] sustained social engagement.
          </div>
        </GlassCard>
        <GlassCard title="Recommendation Panel">
          <ul className="space-y-2 text-sm text-slate-300">
            <li>- Initiate social communication enrichment protocol.</li>
            <li>- Schedule 2-week follow-up comparative screening.</li>
            <li>- Coordinate speech and occupational therapy intake.</li>
          </ul>
        </GlassCard>
      </div>
    </section>
  )
}

export default DoctorDashboardPage
