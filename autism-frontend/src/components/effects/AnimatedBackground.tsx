import { motion, useMotionValue, useSpring } from "framer-motion"
import { useEffect } from "react"

const AnimatedBackground = () => {
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const x1 = useSpring(pointerX, { stiffness: 40, damping: 20, mass: 1.2 })
  const y1 = useSpring(pointerY, { stiffness: 40, damping: 20, mass: 1.2 })
  const x2 = useSpring(pointerX, { stiffness: 24, damping: 18, mass: 1.6 })
  const y2 = useSpring(pointerY, { stiffness: 24, damping: 18, mass: 1.6 })

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let raf = 0
    let nextX = 0
    let nextY = 0

    const flush = () => {
      pointerX.set(nextX)
      pointerY.set(nextY)
      raf = 0
    }

    const onMove = (event: MouseEvent) => {
      nextX = (event.clientX / window.innerWidth - 0.5) * 56
      nextY = (event.clientY / window.innerHeight - 0.5) * 56
      if (!raf) raf = requestAnimationFrame(flush)
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    return () => {
      window.removeEventListener("mousemove", onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [pointerX, pointerY])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute top-[-16rem] left-[-14rem] h-[36rem] w-[36rem] rounded-full bg-sky-400/20 blur-3xl will-change-transform dark:bg-sky-500/20"
        style={{ x: x1, y: y1 }}
      />
      <motion.div
        className="absolute right-[-14rem] bottom-[-18rem] h-[40rem] w-[40rem] rounded-full bg-emerald-400/20 blur-3xl will-change-transform dark:bg-emerald-500/16"
        style={{ x: x2, y: y2 }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.15),transparent_45%)]" />
    </div>
  )
}

export default AnimatedBackground
