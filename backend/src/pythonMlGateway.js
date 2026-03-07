const PY_ML_BASE_URL = process.env.PY_ML_BASE_URL ?? "http://127.0.0.1:8001"
const PY_ML_ENABLED = process.env.PY_ML_ENABLED === "true"
const PY_ML_TIMEOUT_MS = Number(process.env.PY_ML_TIMEOUT_MS || 2500)

const withTimeout = async (url, payload) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), PY_ML_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    if (!response.ok) {
      const raw = await response.text()
      throw new Error(`Python ML request failed (${response.status}): ${raw}`)
    }

    return await response.json()
  } finally {
    clearTimeout(timer)
  }
}

const mapFrameToPython = (frame, index = 0) => ({
  frame_index: Number(frame.frameIndex ?? index),
  eye_contact: Number(frame.eyeContact ?? 0),
  attention_span: Number(frame.attentionSpan ?? 0),
  emotion_signals: Number(frame.emotionSignals ?? 0),
  gesture_analysis: Number(frame.gestureAnalysis ?? 0),
  confidence: Number(frame.confidence ?? 70),
  image_base64: typeof frame.imageBase64 === "string" ? frame.imageBase64 : undefined,
})

const mapPythonToNode = (result) => ({
  modelVersion: String(result.model_version ?? "python-opencv-behavior-v1"),
  riskScore: Number(result.risk_score ?? 50),
  riskLabel: result.risk_label === "high" || result.risk_label === "moderate" ? result.risk_label : "low",
  featureAverages: {
    eyeContact: Number(result.feature_averages?.eye_contact ?? 0),
    attentionSpan: Number(result.feature_averages?.attention_span ?? 0),
    emotionSignals: Number(result.feature_averages?.emotion_signals ?? 0),
    gestureAnalysis: Number(result.feature_averages?.gesture_analysis ?? 0),
    confidence: Number(result.feature_averages?.confidence ?? 0),
  },
  recommendations: Array.isArray(result.recommendations) ? result.recommendations.map(String) : [],
  policy: String(result.policy ?? "Screening support only. Not a medical diagnosis."),
  windowSize: Number(result.window_size ?? 0),
  sessionKey: typeof result.session_key === "string" ? result.session_key : undefined,
})

export const isPythonMlEnabled = () => PY_ML_ENABLED

export const scoreWithPythonWindow = async (frames, sessionKey) => {
  if (!PY_ML_ENABLED) return null

  const payload = {
    session_key: sessionKey,
    frames: frames.map((frame, index) => mapFrameToPython(frame, index)),
  }

  const result = await withTimeout(`${PY_ML_BASE_URL}/predict/window`, payload)
  return mapPythonToNode(result)
}

export const scoreWithPythonLive = async (sessionKey, frame) => {
  if (!PY_ML_ENABLED) return null

  const payload = {
    session_key: sessionKey,
    frame: mapFrameToPython(frame),
  }

  const result = await withTimeout(`${PY_ML_BASE_URL}/predict/live`, payload)
  return mapPythonToNode(result)
}
