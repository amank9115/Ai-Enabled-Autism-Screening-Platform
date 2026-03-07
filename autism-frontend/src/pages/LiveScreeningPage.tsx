import { useSimulatedMetrics } from "../hooks/useSimulatedMetrics"
import AnalysisOverlay from "../components/ai/AnalysisOverlay"
import CameraPreview from "../components/camera/CameraPreview"
import GlassCard from "../components/ui/GlassCard"
import RiskIndicatorMeter from "../components/charts/RiskIndicatorMeter"

const LiveScreeningPage = () => {
  const { metrics, riskSignal } = useSimulatedMetrics()

  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 lg:grid-cols-[1.35fr_1fr] lg:px-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-white">Live Camera Behavior Analysis</h1>
        <p className="text-sm text-slate-300">
          Real-time WebRTC preview with simulated AI overlays for gaze, attention, emotion, and gesture features.
        </p>
        <CameraPreview />
      </div>
      <div className="space-y-4">
        <AnalysisOverlay metrics={metrics} riskSignal={riskSignal} />
        <GlassCard title="Session Notes">
          <ul className="space-y-2 text-sm text-slate-300">
            <li>- Joint attention holds strongest during toy interaction windows.</li>
            <li>- Social cue response latency increased in final minute.</li>
            <li>- Suggest running another baseline in a quieter setting.</li>
          </ul>
        </GlassCard>
        <GlassCard>
          <RiskIndicatorMeter score={riskSignal} />
        </GlassCard>
      </div>
    </section>
  )
}

export default LiveScreeningPage
