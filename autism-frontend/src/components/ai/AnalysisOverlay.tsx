type AnalysisOverlayProps = {
  metrics: {
    eyeContact: number
    attention: number
    emotionSignals: number
    gestureAnalysis: number
    confidence: number
  }
  riskSignal: number
}

const Meter = ({ label, value }: { label: string; value: number }) => (
  <div>
    <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2 rounded-full bg-white/10">
      <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${value}%` }} />
    </div>
  </div>
)

const AnalysisOverlay = ({ metrics, riskSignal }: AnalysisOverlayProps) => {
  return (
    <section className="grid gap-3 rounded-2xl border border-white/15 bg-white/[0.04] p-4 backdrop-blur-xl">
      <h3 className="text-sm font-semibold tracking-wide text-cyan-100 uppercase">AI Behavior Analysis</h3>
      <Meter label="Eye Contact Detection" value={metrics.eyeContact} />
      <Meter label="Attention Span Tracking" value={metrics.attention} />
      <Meter label="Emotion Signals" value={metrics.emotionSignals} />
      <Meter label="Gesture Analysis" value={metrics.gestureAnalysis} />
      <div className="rounded-lg border border-white/10 bg-slate-950/60 p-3 text-xs text-slate-200">
        Confidence: <strong>{metrics.confidence}%</strong> | Risk Indicator: <strong>{riskSignal}%</strong>
      </div>
    </section>
  )
}

export default AnalysisOverlay
