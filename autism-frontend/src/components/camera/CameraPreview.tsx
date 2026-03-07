import { useEffect, useRef, useState } from "react"
import Button from "../ui/Button"

type CameraPreviewProps = {
  onReady?: () => void
}

const CameraPreview = ({ onReady }: CameraPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)

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
    } catch {
      setError("Camera access was denied or unavailable on this device.")
    }
  }

  useEffect(() => {
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream | null
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [])

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
        <div className="absolute top-[16%] left-[18%] h-24 w-24 rounded-xl border border-cyan-300/70" />
        <div className="absolute top-[21%] right-[20%] h-20 w-20 rounded-xl border border-sky-300/70" />
        <div className="absolute bottom-4 left-4 rounded-md bg-slate-950/80 px-3 py-2 text-xs text-cyan-100">Face and gaze placeholder overlay</div>
      </div>
    </div>
  )
}

export default CameraPreview
