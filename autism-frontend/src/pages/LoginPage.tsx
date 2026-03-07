import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion"
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import RoleToggle from "../components/auth/RoleToggle"
import GuestDemoButton from "../components/guest/GuestDemoButton"
import ToastStack, { type ToastItem } from "../components/ui/ToastStack"
import { useAuth } from "../context/AuthContext"
import { authApi, type AuthRole } from "../services/authApi"

type Mode = "login" | "register"

const bgShift = {
  initial: { backgroundPosition: "0% 50%" },
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: { duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "linear" as const },
  },
}

const EyeFollowFace = ({ eyeX, eyeY, protect }: { eyeX: ReturnType<typeof useSpring>; eyeY: ReturnType<typeof useSpring>; protect: boolean }) => {
  return (
    <div className="relative mx-auto h-40 w-40">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-200 to-emerald-200" />
      <div className="absolute left-[32px] top-[56px] h-9 w-9 rounded-full bg-white">
        <motion.div className="absolute left-2 top-2 h-4 w-4 rounded-full bg-slate-900" style={{ x: eyeX, y: eyeY }} />
      </div>
      <div className="absolute right-[32px] top-[56px] h-9 w-9 rounded-full bg-white">
        <motion.div className="absolute left-2 top-2 h-4 w-4 rounded-full bg-slate-900" style={{ x: eyeX, y: eyeY }} />
      </div>
      <div className="absolute left-1/2 top-[105px] h-2 w-10 -translate-x-1/2 rounded-full bg-slate-600" />

      <motion.div
        className="absolute left-4 top-[52px] h-12 w-10 rounded-full bg-amber-100/90"
        animate={{ y: protect ? 16 : -12, rotate: protect ? -10 : 8 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
      />
      <motion.div
        className="absolute right-4 top-[52px] h-12 w-10 rounded-full bg-amber-100/90"
        animate={{ y: protect ? 16 : -12, rotate: protect ? 10 : -8 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
      />
    </div>
  )
}

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, enterGuestMode } = useAuth()
  const [searchParams] = useSearchParams()
  const initialMode: Mode = searchParams.get("mode") === "register" ? "register" : "login"

  const [mode, setMode] = useState<Mode>(initialMode)
  const [role, setRole] = useState<AuthRole>("parent")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState("+91")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [authSuccess, setAuthSuccess] = useState(false)

  const [passwordTyping, setPasswordTyping] = useState(false)
  const typingTimer = useRef<number | null>(null)

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const smoothX = useSpring(pointerX, { stiffness: 80, damping: 18 })
  const smoothY = useSpring(pointerY, { stiffness: 80, damping: 18 })

  const eyeXRaw = useMotionValue(0)
  const eyeYRaw = useMotionValue(0)
  const eyeX = useSpring(eyeXRaw, { stiffness: 230, damping: 24 })
  const eyeY = useSpring(eyeYRaw, { stiffness: 230, damping: 24 })

  useEffect(() => {
    let raf = 0
    const onMove = (event: MouseEvent) => {
      const nx = (event.clientX / window.innerWidth - 0.5) * 24
      const ny = (event.clientY / window.innerHeight - 0.5) * 24
      const ex = Math.max(-2.5, Math.min(2.5, (event.clientX / window.innerWidth - 0.5) * 6))
      const ey = Math.max(-2.5, Math.min(2.5, (event.clientY / window.innerHeight - 0.5) * 6))
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        pointerX.set(nx)
        pointerY.set(ny)
        eyeXRaw.set(ex)
        eyeYRaw.set(ey)
      })
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    return () => {
      window.removeEventListener("mousemove", onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [pointerX, pointerY, eyeXRaw, eyeYRaw])

  const subtitle = useMemo(() => {
    if (role === "parent") return "Safe access for parents and caregivers."
    return "Secure workspace for doctors and clinicians."
  }, [role])

  const pushToast = (type: ToastItem["type"], message: string) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((current) => [...current, { id, type, message }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id))
    }, 2600)
  }

  const routeAfterAuth = (userRole: AuthRole) => {
    navigate(userRole === "parent" ? "/parent-dashboard" : "/doctor-dashboard")
  }

  const markTyping = () => {
    setPasswordTyping(true)
    if (typingTimer.current) window.clearTimeout(typingTimer.current)
    typingTimer.current = window.setTimeout(() => setPasswordTyping(false), 700)
  }

  const submitPasswordLogin = async () => {
    setLoading(true)
    try {
      const result = await authApi.loginWithPassword(email, password, role, name.trim() || undefined)
      login(result.user.name, result.user.role)
      setAuthSuccess(true)
      pushToast("success", "Login successful")
      setTimeout(() => routeAfterAuth(result.user.role), 550)
    } catch (error) {
      pushToast("error", error instanceof Error ? error.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const googleLogin = async () => {
    if (!email.trim()) {
      pushToast("error", "Enter your email to continue with Google.")
      return
    }

    setLoading(true)
    try {
      const result = await authApi.loginWithGoogle({
        email: email.trim(),
        name: name.trim() || undefined,
        role,
      })
      login(result.user.name, result.user.role)
      setAuthSuccess(true)
      pushToast("success", "Google sign-in successful")
      setTimeout(() => routeAfterAuth(result.user.role), 550)
    } catch (error) {
      pushToast("error", error instanceof Error ? error.message : "Google sign-in failed")
    } finally {
      setLoading(false)
    }
  }

  const registerUser = async () => {
    setLoading(true)
    try {
      await authApi.registerUser({
        name,
        email,
        phone: `${countryCode}${phone}`,
        password,
        confirmPassword,
        role,
      })
      setAuthSuccess(true)
      pushToast("success", "Registration completed. Please login.")
      setMode("login")
    } catch (error) {
      pushToast("error", error instanceof Error ? error.message : "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (mode === "register") {
      void registerUser()
      return
    }
    void submitPasswordLogin()
  }

  const enterDemo = () => {
    enterGuestMode()
    navigate("/demo")
  }

  return (
    <section className="relative mx-auto min-h-[calc(100vh-10rem)] max-w-7xl overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <ToastStack toasts={toasts} />

      <motion.div
        {...bgShift}
        className="absolute inset-0 -z-20 rounded-3xl bg-[linear-gradient(120deg,rgba(56,189,248,0.18),rgba(16,185,129,0.15),rgba(59,130,246,0.14),rgba(99,102,241,0.16))] bg-[length:220%_220%]"
      />

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.aside
          style={{ x: smoothX, y: smoothY }}
          className="relative flex items-center justify-center overflow-hidden rounded-3xl border border-slate-200/70 bg-white/65 p-6 backdrop-blur-2xl"
        >
          <div className="w-full">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }} className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-sky-400/25 blur-2xl" />
            <motion.div animate={{ y: [0, 9, 0] }} transition={{ duration: 5.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }} className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-emerald-400/20 blur-2xl" />

            <p className="text-xs tracking-[0.2em] text-sky-600 uppercase">AI Behavioral Care</p>
            <h1 className="mt-2 max-w-md text-4xl font-semibold text-slate-800">Secure onboarding for early autism support.</h1>
            <p className="mt-3 max-w-md text-sm text-slate-600">Email/password and Google sign-in are supported.</p>

            <div className="mt-6">
              <EyeFollowFace eyeX={eyeX} eyeY={eyeY} protect={passwordTyping} />
            </div>
          </div>
        </motion.aside>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.16)] backdrop-blur-2xl"
        >
          <form onSubmit={handleSubmit}>
            <p className="text-xs tracking-[0.18em] text-sky-600 uppercase">Secure Access</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-800">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
            <p className="mt-1 text-sm text-slate-600">{subtitle}</p>

            <div className="mt-4 space-y-3">
              <RoleToggle value={role} onChange={setRole} />

              <div className="flex rounded-xl border border-slate-200/80 bg-white/60 p-1">
                <button type="button" onClick={() => setMode("login")} className={`flex-1 rounded-lg py-2 text-sm transition ${mode === "login" ? "bg-slate-900 text-white" : "text-slate-600"}`}>Login</button>
                <button type="button" onClick={() => setMode("register")} className={`flex-1 rounded-lg py-2 text-sm transition ${mode === "register" ? "bg-slate-900 text-white" : "text-slate-600"}`}>Register</button>
              </div>

              <AnimatePresence mode="wait">
                {mode === "login" ? (
                  <motion.div key="login" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Display name (optional)"
                      className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-300/40"
                    />
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Email"
                      className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-300/40"
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value)
                        markTyping()
                      }}
                      placeholder="Password"
                      className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-300/40"
                    />

                    <button type="submit" className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-sky-500/25">
                      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />}
                      {loading ? "Signing in..." : authSuccess ? "Success" : "Sign in securely"}
                    </button>

                    <button
                      type="button"
                      onClick={() => void googleLogin()}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Continue with Google
                    </button>

                    <GuestDemoButton onClick={enterDemo} className="w-full" />
                  </motion.div>
                ) : (
                  <motion.div key="register" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Full name"
                      className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-300/40"
                    />
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Email"
                      className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-300/40"
                    />
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(event) => setCountryCode(event.target.value)}
                        className="rounded-xl border border-slate-300 bg-white/80 px-2 text-sm text-slate-700 outline-none"
                      >
                        <option value="+91">+91</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                      </select>
                      <input
                        value={phone}
                        onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))}
                        placeholder="Phone number"
                        className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-300/40"
                      />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value)
                        markTyping()
                      }}
                      placeholder="Password"
                      className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-300/40"
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => {
                        setConfirmPassword(event.target.value)
                        markTyping()
                      }}
                      placeholder="Confirm password"
                      className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-300/40"
                    />
                    <button type="submit" className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-sky-500/25">
                      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />}
                      {loading ? "Creating account..." : authSuccess ? "Success" : "Create account"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

export default LoginPage
