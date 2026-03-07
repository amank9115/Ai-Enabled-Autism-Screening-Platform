import { useEffect, useState } from "react"
import BehaviorRadarChart from "../components/charts/BehaviorRadarChart"
import EmotionTimelineChart from "../components/charts/EmotionTimelineChart"
import RiskIndicatorMeter from "../components/charts/RiskIndicatorMeter"
import WeeklyProgressChart from "../components/charts/WeeklyProgressChart"
import GlassCard from "../components/ui/GlassCard"
import { analysisApi } from "../services/api/analysisApi"
import type { EmotionPoint, WeeklyProgress } from "../types"

const ParentDashboardPage = () => {
  const [emotionData, setEmotionData] = useState<EmotionPoint[]>([])
  const [weeklyData, setWeeklyData] = useState<WeeklyProgress[]>([])

  useEffect(() => {
    const load = async () => {
      const [emotion, weekly] = await Promise.all([
        analysisApi.getEmotionTimeline(),
        analysisApi.getWeeklyProgress(),
      ])
      setEmotionData(emotion)
      setWeeklyData(weekly)
    }
    void load()
  }, [])

  return (
    <section className="mx-auto max-w-7xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-3xl font-semibold text-white">Parent Care Dashboard</h1>
        <p className="mt-2 text-sm text-slate-300">
          Upload videos, run AI screening sessions, track development, and share clinician-ready reports.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard title="Upload Behavior Video" subtitle="Secure home-session intake">
          <input
            type="file"
            accept="video/*"
            className="block w-full rounded-xl border border-white/15 bg-slate-950/70 p-2 text-sm text-slate-300"
          />
          <button className="mt-3 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-slate-950">
            Run AI Screening Session
          </button>
        </GlassCard>
        <GlassCard title="Weekly Report" subtitle="Simple signal summary for families">
          <p className="text-sm text-slate-300">Engagement improved by 6% this week. Recommended: more turn-taking play and imitation tasks.</p>
          <div className="mt-3 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">Risk level trend: Moderating</div>
        </GlassCard>
        <GlassCard title="Share with Clinician" subtitle="Send structured report package">
          <textarea
            className="h-28 w-full rounded-xl border border-white/15 bg-slate-950/70 p-2 text-sm text-slate-300"
            defaultValue="Please review week 5 behavior report before our Tuesday consultation."
          />
          <button className="mt-3 w-full rounded-xl border border-cyan-200/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
            Send Report to Doctor
          </button>
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard title="Behavior Radar">
          <BehaviorRadarChart eyeContact={72} attention={78} emotionStability={70} gestureScore={66} adaptability={69} />
        </GlassCard>
        <GlassCard title="Emotion Timeline">
          <EmotionTimelineChart data={emotionData} />
        </GlassCard>
        <GlassCard title="Development Progress Timeline" className="lg:col-span-2">
          <WeeklyProgressChart data={weeklyData} />
        </GlassCard>
        <GlassCard title="Risk Indicator" className="lg:col-span-2">
          <RiskIndicatorMeter score={34} />
        </GlassCard>
      </div>
    </section>
  )
}

export default ParentDashboardPage
