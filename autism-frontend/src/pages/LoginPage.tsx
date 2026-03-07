import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import AuthMethodTabs from "../components/auth/AuthMethodTabs"
import OtpInput from "../components/auth/OtpInput"
import RoleToggle from "../components/auth/RoleToggle"
import ToastStack, { type ToastItem } from "../components/ui/ToastStack"
import { useAuth } from "../context/AuthContext"
import { useOtpAuth } from "../hooks/useOtpAuth"
import { authApi, type AuthMethod, type AuthRole } from "../services/authApi"

type Mode = "login" | "register"

const bgShift = {
  initial: { backgroundPosition: "0% 50%" },
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: { duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "linear" as const },
  },
}

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [searchParams] = useSearchParams()
  const initialMode: Mode = searchParams.get("mode") === "register" ? "register" : "login"

  const [mode, setMode] = useState<Mode>(initialMode)
  const [role, setRole] = useState<AuthRole>("parent")
  const [method, setMethod] = useState<AuthMethod>("password")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState("+91")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [authSuccess, setAuthSuccess] = useState(false)

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const smoothX = useSpring(pointerX, { stiffness: 80, damping: 18 })
  const smoothY = useSpring(pointerY, { stiffness: 80, damping: 18 })

  const { otp, otpSent, otpValues, timer, canResend, setOtpValues, startOtp, resetOtp } = useOtpAuth()

  useEffect(() => {
    let raf = 0
    const onMove = (event: MouseEvent) => {
      const nx = (event.clientX / window.innerWidth - 0.5) * 24
      const ny = (event.clientY / window.innerHeight - 0.5) * 24
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        pointerX.set(nx)
        pointerY.set(ny)
      })
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    return () => {
      window.removeEventListener("mousemove", onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [pointerX, pointerY])

  const subtitle = useMemo(() => {
    if (role === "parent") return "Guided screening access for families and caregivers."
    return "Clinical workflow access for doctors and specialists."
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

  const sendOtp = async () => {
    setLoading(true)
    try {
      if (method === "emailOtp") {
        await authApi.sendEmailOtp(email)
      } else {
        await authApi.sendPhoneOtp(`${countryCode}${phone}`)
      }
      startOtp()
      pushToast("info", "OTP sent successfully")
    } catch (error) {
      pushToast("error", error instanceof Error ? error.message : "Unable to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const verifyOtpLogin = async () => {
    setLoading(true)
    try {
      await authApi.verifyOtp(otp)
      const result = await authApi.loginWithOtp({
        email: method === "emailOtp" ? email.trim() : undefined,
        phone: method === "phoneOtp" ? `${countryCode}${phone}` : undefined,
        role,
        name: name.trim() || undefined,
      })
      login(result.user.name, result.user.role)
      setAuthSuccess(true)
      pushToast("success", "Verification successful")
      setTimeout(() => routeAfterAuth(result.user.role), 550)
    } catch (error) {
      pushToast("error", error instanceof Error ? error.message : "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  const register = async () => {
    setLoading(true)
    try {
      const result = await authApi.registerUser({
        name,
        email,
        phone: `${countryCode}${phone}`,
        password,
        confirmPassword,
        role,
      })
      login(result.user.name, result.user.role)
      setAuthSuccess(true)
      pushToast("success", "Registration completed")
      setTimeout(() => routeAfterAuth(result.user.role), 550)
    } catch (error) {
      pushToast("error", error instanceof Error ? error.message : "Registration failed")
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

  const onMethodChange = (nextMethod: AuthMethod) => {
    setMethod(nextMethod)
    resetOtp()
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
          className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/65 p-6 backdrop-blur-2xl dark:border-slate-700 dark:bg-slate-900/55"
        >
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-sky-400/25 blur-2xl"
          />
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute right-0 bottom-0 h-44 w-44 rounded-full bg-emerald-400/20 blur-2xl"
          />

          <p className="text-xs tracking-[0.2em] text-sky-600 uppercase dark:text-sky-300">AI Behavioral Care</p>
          <h1 className="mt-2 max-w-md text-4xl font-semibold text-slate-800 dark:text-slate-100">
            Secure onboarding for smarter early autism support.
          </h1>
          <p className="mt-3 max-w-md text-sm text-slate-600 dark:text-slate-300">
            ManasSaathi AI helps parents and doctors move from concern to informed action with responsible AI guidance.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-950/50">
              <p className="text-xs text-slate-500 dark:text-slate-300">AI Insight</p>
              <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-100">Emotion + attention trend analysis</p>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-950/50">
              <p className="text-xs text-slate-500 dark:text-slate-300">Healthcare Ready</p>
              <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-100">Parent-doctor collaborative workflow</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-950/55">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-sky-500/20 to-emerald-500/20">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-sky-600 dark:text-sky-300" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 13.5C4 10 6.7 7 10 7C12.6 7 14.8 8.8 15.5 11.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M14 16.5C14.9 17.5 16.2 18 17.6 18C19.9 18 21.8 16.1 21.8 13.8C21.8 11.5 19.9 9.6 17.6 9.6C16 9.6 14.6 10.4 13.9 11.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="8.6" cy="14.3" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-300">Trusted Screening Experience</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">Secure. Calm. Clinical.</p>
              </div>
            </div>
          </div>
        </motion.aside>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.16)] backdrop-blur-2xl dark:border-slate-700 dark:bg-slate-900/55"
        >
          <p className="text-xs tracking-[0.18em] text-sky-600 uppercase dark:text-sky-300">Secure Access</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-800 dark:text-slate-100">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{subtitle}</p>

          <div className="mt-4 space-y-3">
            <RoleToggle value={role} onChange={setRole} />

            <div className="flex rounded-xl border border-slate-200/80 bg-white/60 p-1 dark:border-slate-700 dark:bg-slate-900/55">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 rounded-lg py-2 text-sm transition ${
                  mode === "login" ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "text-slate-500 dark:text-slate-300"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setMode("register")}
                className={`flex-1 rounded-lg py-2 text-sm transition ${
                  mode === "register" ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "text-slate-500 dark:text-slate-300"
                }`}
              >
                Register
              </button>
            </div>

            <AnimatePresence mode="wait">
              {mode === "login" ? (
                <motion.div key="login" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                  <AuthMethodTabs value={method} onChange={onMethodChange} />

                  {method === "password" && (
                    <>
                      <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Display name (optional)"
                        className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-300/40 dark:border-slate-600 dark:bg-slate-900/65 dark:text-slate-200"
                      />
                      <input
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Email"
                        className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-300/40 dark:border-slate-600 dark:bg-slate-900/65 dark:text-slate-200"
                      />
                      <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Password"
                        className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-300/40 dark:border-slate-600 dark:bg-slate-900/65 dark:text-slate-200"
                      />
                      <button
                        onClick={submitPasswordLogin}
                        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-sky-500/25"
                      >
                        {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />}
                        {loading ? "Signing in..." : authSuccess ? "Success" : "Sign in securely"}
                      </button>
                      <button
                        onClick={googleLogin}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-200"
                      >
                        Continue with Google
                      </button>
                    </>
                  )}

                  {(method === "emailOtp" || method === "phoneOtp") && (
                    <>
                      <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Display name (optional)"
                        className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-300/40 dark:border-slate-600 dark:bg-slate-900/65 dark:text-slate-200"
                      />

                      {method === "emailOtp" ? (
                        <input
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="Email"
                          className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-300/40 dark:border-slate-600 dark:bg-slate-900/65 dark:text-slate-200"
                        />
                      ) : (
                        <div className="flex gap-2">
                          <select
                            value={countryCode}
                            onChange={(event) => setCountryCode(event.target.value)}
                            className="rounded-xl border border-slate-300 bg-white/80 px-2 text-sm text-slate-700 outline-none dark:border-slate-600 dark:bg-slate-900/65 dark:text-slate-200"
                          >
                            <option value="+91">+91</option>
                            <option value="+1">+1</option>
                            <option value="+44">+44</option>
                          </select>
                          <input
                            value={phone}
                            onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))}
                            placeholder="Phone number"
                            className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-300/40 dark:border-slate-600 dark:bg-slate-900/65 dark:text-slate-200"
                          />
                        </div>
                      )}

                      {!otpSent ? (
                        <button
                          onClick={sendOtp}
                          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-sky-500/25"
                        >
                          {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />}
                          {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <OtpInput values={otpValues} onChange={setOtpValues} />
                          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-300">
                            <span>{canResend ? "You can resend OTP now" : `Resend OTP in ${timer}s`}</span>
                            <button disabled={!canResend || loading} onClick={sendOtp} className="font-semibold text-sky-600 disabled:opacity-40 dark:text-sky-300">
                              Resend
                            </button>
                          </div>
                          <button
                            onClick={verifyOtpLogin}
                            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-sky-500/25"
                          >
                            {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />}
                            {loading ? "Verifying..." : authSuccess ? "Success" : "Verify and continue"}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div key="register" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Full name"
                    className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-300/40 dark:border-slate-600 dark:bg-slate-900/65 dark:text-slate-200"
                  />
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email"
                    className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-300/40 dark:border-slate-600 dark:bg-slate-900/65 dark:text-slate-200"
                  />
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(event) => setCountryCode(event.target.value)}
                      className="rounded-xl border border-slate-300 bg-white/80 px-2 text-sm text-slate-700 outline-none dark:border-slate-600 dark:bg-slate-900/65 dark:text-slate-200"
                    >
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                    </select>
                    <input
                      value={phone}
                      onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))}
                      placeholder="Phone number"
                      className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-300/40 dark:border-slate-600 dark:bg-slate-900/65 dark:text-slate-200"
                    />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-300/40 dark:border-slate-600 dark:bg-slate-900/65 dark:text-slate-200"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm password"
                    className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-300/40 dark:border-slate-600 dark:bg-slate-900/65 dark:text-slate-200"
                  />
                  <button
                    onClick={register}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-sky-500/25"
                  >
                    {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />}
                    {loading ? "Creating account..." : authSuccess ? "Success" : "Create secure account"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default LoginPage


