import AIAgentChat from "../components/chat/AIAgentChat"
import AttentionHeatmap from "../components/charts/AttentionHeatmap"
import SessionComparisonChart from "../components/charts/SessionComparisonChart"
import GlassCard from "../components/ui/GlassCard"
import { childProfiles, sessionHistory } from "../services/mock/dataset"

const comparison = [
  { label: "Case A", attention: 66, engagement: 61 },
  { label: "Case B", attention: 72, engagement: 70 },
  { label: "Case C", attention: 58, engagement: 55 },
]

const DoctorDashboardPage = () => {
  return (
    <section className="mx-auto max-w-7xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">Doctor Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Professional case overview, patient insights, and AI-assisted recommendation planning.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard title="Patient Overview">
          <div className="space-y-2">
            {childProfiles.map((patient) => (
              <div key={patient.id} className="rounded-xl border border-slate-200/70 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">{patient.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-300">{patient.id} | {patient.age} | {patient.riskLevel}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Recommendations Panel">
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>- Start weekly social reciprocity intervention block.</li>
            <li>- Compare home and clinic attention drift patterns.</li>
            <li>- Flag high-risk sessions for case conference.</li>
          </ul>
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard title="Behavior Session Comparison">
          <SessionComparisonChart data={comparison} />
        </GlassCard>
        <GlassCard title="Attention Heatmap">
          <AttentionHeatmap />
        </GlassCard>
      </div>

      <GlassCard title="Session Reports">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-300">
                <th className="px-3 py-2">Session</th>
                <th className="px-3 py-2">Child</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Risk</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {sessionHistory.map((item) => (
                <tr key={item.id} className="border-t border-slate-200/70 dark:border-slate-700">
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{item.id}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{item.childName}</td>
                  <td className="px-3 py-2 text-slate-500 dark:text-slate-300">{item.date}</td>
                  <td className="px-3 py-2 text-slate-500 dark:text-slate-300">{item.riskScore}%</td>
                  <td className="px-3 py-2 text-slate-500 dark:text-slate-300">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard title="Video Analysis Interface">
          <a href="/video-analysis" className="inline-block rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white">Open Review Workspace</a>
        </GlassCard>
        <AIAgentChat />
      </div>
    </section>
  )
}

export default DoctorDashboardPage
