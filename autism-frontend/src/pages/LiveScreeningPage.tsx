import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import AnalysisOverlay from "../components/ai/AnalysisOverlay"
import LiveMlPanel from "../components/ai/LiveMlPanel"
import CameraPreview from "../components/camera/CameraPreview"
import GlassCard from "../components/ui/GlassCard"
import RiskIndicatorMeter from "../components/charts/RiskIndicatorMeter"
import { useScreening } from "../context/ScreeningContext"
import { useSimulatedMetrics } from "../hooks/useSimulatedMetrics"

const LiveScreeningPage = () => {
  const { metrics, riskSignal } = useSimulatedMetrics()
  const { activeProfile, addSessionForActiveProfile, addRecordingForActiveProfile, raiseEmergencyAlert } = useScreening()
  const [alertLogs, setAlertLogs] = useState<string[]>([])
  const [sessionSaved, setSessionSaved] = useState(false)

  const severeRisk = riskSignal >= 60

  const behaviorIndicators = useMemo(() => {
    const indicators: string[] = []
    if (metrics.eyeContact < 40) indicators.push("Reduced eye contact")
    if (metrics.attention < 40) indicators.push("Attention drift")
    if (metrics.emotionSignals < 45) indicators.push("Emotion volatility")
    if (indicators.length === 0) indicators.push("Stable interactive response")
    return indicators
  }, [metrics])

  if (!activeProfile) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 dark:border-slate-700 dark:bg-slate-900/60">
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Child profile required</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Please complete the child profile form before starting live screening.</p>
          <Link to="/child-profile" className="mt-4 inline-block rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white">Go to Child Profile</Link>
        </div>
      </section>
    )
  }

  const sendEmergencyAlert = (target: string) => {
    const now = new Date().toLocaleTimeString()
    raiseEmergencyAlert(riskSignal)
    setAlertLogs((current) => [`${now}: Alert sent to ${target}`, ...current])
  }

  const saveSession = () => {
    const id = addSessionForActiveProfile(riskSignal)
    if (id) setSessionSaved(true)
  }

  const onRecordingComplete = (payload: { videoUrl: string; durationSec: number }) => {
    addRecordingForActiveProfile({
      riskScore: riskSignal,
      durationSec: payload.durationSec,
      videoUrl: payload.videoUrl,
      metrics: {
        eyeContact: metrics.eyeContact,
        attention: metrics.attention,
        emotionStability: metrics.emotionSignals,
        gestureDetection: metrics.gestureAnalysis,
      },
    })
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 lg:grid-cols-[1.35fr_1fr] lg:px-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">Live Screening Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Child: {activeProfile.childName} | Parent: {activeProfile.parentName} | Location: {activeProfile.city}, {activeProfile.state}
        </p>

        <CameraPreview metrics={metrics} onRecordingComplete={onRecordingComplete} />

        <GlassCard title="Live Metrics Panel">
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200/70 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-900/55">
              Eye Contact Score: <span className="font-semibold">{metrics.eyeContact}%</span>
            </div>
            <div className="rounded-xl border border-slate-200/70 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-900/55">
              Attention Level: <span className="font-semibold">{metrics.attention}%</span>
            </div>
            <div className="rounded-xl border border-slate-200/70 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-900/55">
              Emotion Pattern: <span className="font-semibold">{metrics.emotionSignals}% stable</span>
            </div>
            <div className="rounded-xl border border-slate-200/70 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-900/55">
              Behavior Indicators: <span className="font-semibold">{behaviorIndicators.join(", ")}</span>
            </div>
          </div>
          <button onClick={saveSession} className="mt-3 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white">Save Session to Doctor Queue</button>
          {sessionSaved && <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-300">Session saved for doctor dashboard review.</p>}
        </GlassCard>

        <LiveMlPanel
          eyeContact={metrics.eyeContact}
          attention={metrics.attention}
          emotionStability={metrics.emotionSignals}
          gestureDetection={metrics.gestureAnalysis}
        />
      </div>

      <div className="space-y-4">
        <AnalysisOverlay metrics={metrics} riskSignal={riskSignal} />
        <GlassCard>
          <RiskIndicatorMeter score={riskSignal} />
        </GlassCard>

        {severeRisk && (
          <GlassCard title="Emergency Alert System">
            <p className="text-sm text-rose-600 dark:text-rose-300">Severe risk detected. Trigger emergency communication now.</p>
            <div className="mt-3 grid gap-2">
              <button onClick={() => sendEmergencyAlert(`Parent (${activeProfile.parentPhone})`)} className="rounded-lg bg-rose-500 px-3 py-2 text-xs font-semibold text-white">Alert Parent</button>
              <button onClick={() => sendEmergencyAlert(`Emergency Contact (${activeProfile.emergencyContact})`)} className="rounded-lg bg-rose-500 px-3 py-2 text-xs font-semibold text-white">Alert Emergency Contact</button>
              <button onClick={() => sendEmergencyAlert("Emergency Helpline (112)")} className="rounded-lg bg-rose-700 px-3 py-2 text-xs font-semibold text-white">Alert 112</button>
            </div>
            {alertLogs.length > 0 && (
              <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                {alertLogs.map((log) => (
                  <p key={log}>{log}</p>
                ))}
              </div>
            )}
          </GlassCard>
        )}
      </div>
    </section>
  )
}

export default LiveScreeningPage
