import { motion } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"
import Button from "../ui/Button"

type CameraPreviewProps = {
  onReady?: () => void
  metrics?: {
    eyeContact: number
    attention: number
    emotionSignals: number
    gestureAnalysis: number
  }
  onRecordingComplete?: (payload: { videoUrl: string; durationSec: number }) => void
}

const CameraPreview = ({ onReady, metrics, onRecordingComplete }: CameraPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const recordingStartRef = useRef<number>(0)

  const [error, setError] = useState<string | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null)
  const [recordingDuration, setRecordingDuration] = useState(0)

  const resolvedMetrics = useMemo(
    () => ({
      eyeContact: metrics?.eyeContact ?? 73,
      attention: metrics?.attention ?? 79,
      emotionSignals: metrics?.emotionSignals ?? 71,
      gestureAnalysis: metrics?.gestureAnalysis ?? 68,
    }),
    [metrics],
  )

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsStreaming(true)
        onReady?.()
      }
      setError(null)
    } catch {
      setError("Camera access was denied or unavailable on this device.")
    }
  }

  const startRecording = () => {
    const stream = videoRef.current?.srcObject as MediaStream | null
    if (!stream) {
      setError("Start camera before recording.")
      return
    }

    chunksRef.current = []
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" })
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data)
    }

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" })
      const url = URL.createObjectURL(blob)
      setRecordingUrl(url)
      const duration = Math.max(1, Math.round((Date.now() - recordingStartRef.current) / 1000))
      setRecordingDuration(duration)
      onRecordingComplete?.({ videoUrl: url, durationSec: duration })
      setIsRecording(false)
    }

    mediaRecorderRef.current = recorder
    recordingStartRef.current = Date.now()
    recorder.start(300)
    setIsRecording(true)
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
  }

  useEffect(() => {
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream | null
      stream?.getTracks().forEach((track) => track.stop())
      if (recordingUrl) URL.revokeObjectURL(recordingUrl)
    }
  }, [recordingUrl])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-950/90 dark:border-slate-700">
      <video ref={videoRef} autoPlay playsInline muted className="h-[360px] w-full object-cover sm:h-[440px]" />

      {!isStreaming && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
          <div className="text-center">
            <p className="mb-3 text-sm text-slate-200">Enable camera for live behavior signal simulation.</p>
            <Button onClick={startCamera}>Grant Camera Access</Button>
            {error && <p className="mt-3 text-xs text-rose-300">{error}</p>}
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ x: [0, 8, 0], y: [0, -4, 0] }}
          transition={{ duration: 2.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute left-[36%] top-[24%] h-32 w-28 rounded-xl border-2 border-cyan-300/80"
        />

        <div className="absolute left-[45%] top-[40%] h-20 w-20 rounded-full bg-cyan-400/20 blur-xl" />
        <div className="absolute left-[56%] top-[50%] h-16 w-16 rounded-full bg-emerald-400/20 blur-xl" />
        <div className="absolute left-[38%] top-[56%] h-14 w-14 rounded-full bg-indigo-400/20 blur-xl" />

        <div className="absolute bottom-4 left-4 rounded-md bg-slate-950/80 px-3 py-2 text-xs text-cyan-100">
          Face detected | Eye contact {resolvedMetrics.eyeContact}% | Attention {resolvedMetrics.attention}%
        </div>
      </div>

      {isStreaming && (
        <div className="absolute top-3 right-3 flex gap-2">
          {!isRecording ? (
            <Button onClick={startRecording} className="shadow-[0_0_18px_rgba(14,165,233,0.38)]">Start Recording</Button>
          ) : (
            <Button onClick={stopRecording} className="bg-rose-500 text-white hover:bg-rose-400">Stop Recording</Button>
          )}
        </div>
      )}

      {recordingUrl && (
        <div className="border-t border-slate-700/70 bg-slate-900/80 p-3">
          <p className="mb-2 text-xs text-cyan-200">Recorded Preview ({recordingDuration}s)</p>
          <video src={recordingUrl} controls className="h-44 w-full rounded-xl bg-slate-950 object-contain" />
        </div>
      )}
    </div>
  )
}

export default CameraPreview
