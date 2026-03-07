import { useEffect, useMemo, useState } from "react"

type LiveMetrics = {
  eyeContact: number
  attention: number
  emotionSignals: number
  gestureAnalysis: number
  confidence: number
}

const boundedRandom = (base: number, spread: number) => {
  const value = base + (Math.random() * spread * 2 - spread)
  return Math.max(0, Math.min(100, Math.round(value)))
}

export const useSimulatedMetrics = () => {
  const [metrics, setMetrics] = useState<LiveMetrics>({
    eyeContact: 72,
    attention: 78,
    emotionSignals: 66,
    gestureAnalysis: 71,
    confidence: 88,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics((current) => ({
        eyeContact: boundedRandom(current.eyeContact, 6),
        attention: boundedRandom(current.attention, 5),
        emotionSignals: boundedRandom(current.emotionSignals, 7),
        gestureAnalysis: boundedRandom(current.gestureAnalysis, 6),
        confidence: boundedRandom(current.confidence, 3),
      }))
    }, 1300)

    return () => clearInterval(timer)
  }, [])

  const riskSignal = useMemo(() => {
    const protective = (metrics.eyeContact + metrics.attention + metrics.emotionSignals + metrics.gestureAnalysis) / 4
    return Math.max(1, Math.min(99, 100 - Math.round(protective)))
  }, [metrics])

  return { metrics, riskSignal }
}
