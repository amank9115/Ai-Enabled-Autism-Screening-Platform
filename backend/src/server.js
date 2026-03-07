import bcrypt from "bcryptjs"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import { nanoid } from "nanoid"

import {
  ChildModel,
  MessageModel,
  PreScreeningProfileModel,
  ScreeningSessionModel,
  SessionHistoryModel,
  UserModel,
  connectDatabase,
} from "./db.js"
import { scoreCameraScreening } from "./ml.js"

dotenv.config()

const mongoUri = process.env.MONGODB_URI

const app = express()
const port = Number(process.env.PORT || 4000)

const normalizeEmail = (value) => String(value ?? "").trim().toLowerCase()
const normalizePhone = (value) => String(value ?? "").trim()
const normalizeText = (value) => String(value ?? "").trim()

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  }),
)
app.use(express.json({ limit: "2mb" }))

const behaviorTimeline = [
  { t: "00:00", eyeContact: 62, attention: 58, emotionSignals: 64, gestureAnalysis: 56 },
  { t: "00:30", eyeContact: 67, attention: 61, emotionSignals: 66, gestureAnalysis: 59 },
  { t: "01:00", eyeContact: 71, attention: 65, emotionSignals: 68, gestureAnalysis: 63 },
]

const emotionTimeline = [
  { t: "00:00", calm: 52, stress: 35, curious: 48 },
  { t: "00:30", calm: 56, stress: 32, curious: 52 },
  { t: "01:00", calm: 60, stress: 28, curious: 58 },
  { t: "01:30", calm: 63, stress: 24, curious: 60 },
]

const weeklyProgress = [
  { week: "W1", engagement: 52, eyeContact: 49, languageResponse: 45 },
  { week: "W2", engagement: 58, eyeContact: 55, languageResponse: 50 },
  { week: "W3", engagement: 63, eyeContact: 61, languageResponse: 57 },
  { week: "W4", engagement: 69, eyeContact: 66, languageResponse: 61 },
]

const liveInferenceWindows = new Map()

const asyncHandler =
  (handler) =>
  (req, res, next) =>
    Promise.resolve(handler(req, res, next)).catch(next)

app.get("/api/v1/health", (_req, res) => {
  res.json({ ok: true, service: "manassaathi-backend", timestamp: new Date().toISOString() })
})

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "manassaathi-backend",
    message: "Backend is running. Use /api/v1/health for health check.",
  })
})

app.get("/api", (_req, res) => {
  res.json({
    ok: true,
    message: "API root. Use /api/v1/health and other /api/v1/* routes.",
  })
})

app.get("/api/v1/analysis/live-behavior", (_req, res) => {
  res.json(behaviorTimeline)
})

app.get("/api/v1/analysis/emotion-timeline", (_req, res) => {
  res.json(emotionTimeline)
})

app.get("/api/v1/analysis/weekly-progress", (_req, res) => {
  res.json(weeklyProgress)
})

app.get(
  "/api/v1/analysis/child-profiles",
  asyncHandler(async (_req, res) => {
    const rows = await ChildModel.find({}, { _id: 0, __v: 0 }).sort({ updatedAt: -1 }).lean()
    res.json(rows)
  }),
)

app.get(
  "/api/v1/analysis/session-history",
  asyncHandler(async (_req, res) => {
    const rows = await SessionHistoryModel.find({}, { _id: 0, __v: 0 }).sort({ date: -1 }).lean()
    res.json(rows)
  }),
)

app.get(
  "/api/v1/analysis/messages",
  asyncHandler(async (_req, res) => {
    const rows = await MessageModel.find({}, { _id: 0, __v: 0 }).sort({ at: -1 }).lean()
    res.json(rows)
  }),
)

app.post(
  "/api/v1/screening/child-profile",
  asyncHandler(async (req, res) => {
    const body = req.body ?? {}

    const payload = {
      childName: normalizeText(body.childName),
      age: normalizeText(body.age),
      dateOfBirth: normalizeText(body.dateOfBirth),
      gender: normalizeText(body.gender || "Prefer not to say"),
      parentName: normalizeText(body.parentName),
      parentPhone: normalizePhone(body.parentPhone),
      parentEmail: normalizeEmail(body.parentEmail),
      homeAddress: normalizeText(body.homeAddress),
      city: normalizeText(body.city),
      state: normalizeText(body.state),
      emergencyContact: normalizeText(body.emergencyContact),
      medicalNotes: normalizeText(body.medicalNotes),
      location: {
        lat: typeof body.location?.lat === "number" ? body.location.lat : null,
        lng: typeof body.location?.lng === "number" ? body.location.lng : null,
        capturedAt: body.location?.capturedAt ? normalizeText(body.location.capturedAt) : null,
      },
    }

    const required = [
      payload.childName,
      payload.age,
      payload.dateOfBirth,
      payload.parentName,
      payload.parentPhone,
      payload.parentEmail,
      payload.homeAddress,
      payload.city,
      payload.state,
      payload.emergencyContact,
    ]

    if (required.some((value) => !value)) {
      res.status(400).json({ success: false, message: "Please complete all required child profile fields." })
      return
    }

    const saved = await PreScreeningProfileModel.create({
      id: `cp-${nanoid(10)}`,
      ...payload,
    })

    await ChildModel.create({
      id: `CH-${nanoid(6)}`,
      name: saved.childName,
      age: saved.age,
      lastSession: new Date().toISOString().slice(0, 10),
      riskLevel: "Pending Screening",
    })

    res.status(201).json({
      success: true,
      profile: {
        id: saved.id,
        childName: saved.childName,
        parentName: saved.parentName,
        parentEmail: saved.parentEmail,
        createdAt: saved.createdAt,
      },
    })
  }),
)

app.post(
  "/api/v1/ml/camera-screening",
  asyncHandler(async (req, res) => {
    const { userId, frames } = req.body ?? {}

    if (!Array.isArray(frames) || frames.length === 0) {
      res.status(400).json({ success: false, message: "frames array is required." })
      return
    }

    const normalizedFrames = frames.map((frame, index) => ({
      frameIndex: index,
      eyeContact: Number(frame.eyeContact ?? 0),
      attentionSpan: Number(frame.attentionSpan ?? 0),
      emotionSignals: Number(frame.emotionSignals ?? 0),
      gestureAnalysis: Number(frame.gestureAnalysis ?? 0),
      confidence: Number(frame.confidence ?? 70),
    }))

    const scoring = scoreCameraScreening(normalizedFrames)
    const sessionId = `sess-${nanoid(10)}`

    await ScreeningSessionModel.create({
      id: sessionId,
      userId: userId ?? null,
      source: "camera",
      modelVersion: scoring.modelVersion,
      riskScore: scoring.riskScore,
      riskLabel: scoring.riskLabel,
      summary: scoring.featureAverages,
      recommendations: scoring.recommendations,
      metrics: normalizedFrames,
    })

    res.json({
      success: true,
      sessionId,
      status: "completed",
      modelVersion: scoring.modelVersion,
      riskScore: scoring.riskScore,
      riskLabel: scoring.riskLabel,
      featureAverages: scoring.featureAverages,
      recommendations: scoring.recommendations,
      datasetContext: scoring.datasetContext,
      policy: "Screening support only. Not a medical diagnosis.",
    })
  }),
)

app.post(
  "/api/v1/ml/live-inference",
  asyncHandler(async (req, res) => {
    const { sessionKey, frame } = req.body ?? {}
    if (typeof sessionKey !== "string" || !sessionKey.trim()) {
      res.status(400).json({ success: false, message: "sessionKey is required." })
      return
    }

    if (!frame || typeof frame !== "object") {
      res.status(400).json({ success: false, message: "frame is required." })
      return
    }

    const normalizedFrame = {
      frameIndex: Number(frame.frameIndex ?? Date.now()),
      eyeContact: Number(frame.eyeContact ?? 0),
      attentionSpan: Number(frame.attentionSpan ?? 0),
      emotionSignals: Number(frame.emotionSignals ?? 0),
      gestureAnalysis: Number(frame.gestureAnalysis ?? 0),
      confidence: Number(frame.confidence ?? 70),
    }

    const key = sessionKey.trim()
    const existing = liveInferenceWindows.get(key) ?? []
    existing.push(normalizedFrame)
    const windowFrames = existing.slice(-45)
    liveInferenceWindows.set(key, windowFrames)

    const scoring = scoreCameraScreening(windowFrames)
    res.json({
      success: true,
      sessionKey: key,
      modelVersion: scoring.modelVersion,
      riskScore: scoring.riskScore,
      riskLabel: scoring.riskLabel,
      featureAverages: scoring.featureAverages,
      windowSize: windowFrames.length,
      recommendations: scoring.recommendations,
      datasetContext: scoring.datasetContext,
      policy: "Live screening support only. Not a medical diagnosis.",
    })
  }),
)

app.post("/api/v1/ml/inference", (req, res) => {
  const { sessionId } = req.body ?? {}
  res.json({
    sessionId: sessionId ?? `session-${Date.now()}`,
    status: "running",
    explanation: [
      "Use /api/v1/ml/camera-screening for live camera metric scoring.",
      "Attach Python model service in this handler when ready.",
    ],
  })
})

app.post("/api/v1/auth/email-otp", (req, res) => {
  const email = normalizeEmail(req.body?.email)
  if (!email || !email.includes("@")) {
    res.status(400).json({ success: false, message: "Please enter a valid email." })
    return
  }
  res.json({ success: true, target: email })
})

app.post("/api/v1/auth/phone-otp", (req, res) => {
  const { phone } = req.body ?? {}
  if (typeof phone !== "string" || phone.length < 8) {
    res.status(400).json({ success: false, message: "Please enter a valid phone number." })
    return
  }
  res.json({ success: true, target: phone })
})

app.post("/api/v1/auth/verify-otp", (req, res) => {
  const { otp } = req.body ?? {}
  if (typeof otp !== "string" || otp.length !== 6) {
    res.status(400).json({ success: false, message: "OTP must be 6 digits." })
    return
  }
  res.json({ success: true })
})

app.post(
  "/api/v1/auth/otp-login",
  asyncHandler(async (req, res) => {
    const { role, name } = req.body ?? {}
    const email = normalizeEmail(req.body?.email)
    const phone = normalizePhone(req.body?.phone)
    if (!role || (!email && !phone)) {
      res.status(400).json({ success: false, message: "Role and email or phone are required." })
      return
    }

    const query = email ? { email, role } : { phone, role }
    const safeName = typeof name === "string" && name.trim() ? name.trim() : email ? String(email).split("@")[0] : "User"
    let user = await UserModel.findOne(query)

    if (!user) {
      user = await UserModel.create({
        id: `u-${nanoid(10)}`,
        name: safeName,
        email: email ?? `${nanoid(8)}@otp.local`,
        phone: phone ?? "0000000000",
        passwordHash: bcrypt.hashSync(nanoid(24), 10),
        role,
        provider: "otp",
      })
    } else if (!user.name && safeName) {
      user.name = safeName
      await user.save()
    }

    res.json({
      success: true,
      user: { id: user.id, name: user.name, role: user.role, email: user.email },
    })
  }),
)

app.post(
  "/api/v1/auth/login",
  asyncHandler(async (req, res) => {
    const { password, role, name } = req.body ?? {}
    const email = normalizeEmail(req.body?.email)
    if (!email || !password || !role) {
      res.status(400).json({ success: false, message: "Missing required fields." })
      return
    }

    let user = await UserModel.findOne({ email, role }).lean()
    if (!user) {
      // Auto-provision local account on first email/password login.
      const id = `u-${nanoid(10)}`
      const hash = bcrypt.hashSync(String(password), 10)
      const created = await UserModel.create({
        id,
        name: typeof name === "string" && name.trim() ? name.trim() : String(email).split("@")[0],
        email,
        phone: "0000000000",
        passwordHash: hash,
        role,
        provider: "local",
      })
      user = created.toObject()
    } else if (user.provider === "google") {
      res.status(401).json({ success: false, message: "Use Google sign-in for this account." })
      return
    }

    const match = bcrypt.compareSync(String(password), user.passwordHash)
    if (!match) {
      res.status(401).json({ success: false, message: "Invalid credentials." })
      return
    }

    res.json({ success: true, user: { id: user.id, name: user.name, role: user.role, email: user.email } })
  }),
)

app.post(
  "/api/v1/auth/google",
  asyncHandler(async (req, res) => {
    const { name, role } = req.body ?? {}
    const email = normalizeEmail(req.body?.email)
    if (!email || !role) {
      res.status(400).json({ success: false, message: "Email and role are required." })
      return
    }

    const safeName = typeof name === "string" && name.trim() ? name.trim() : String(email).split("@")[0]
    let user = await UserModel.findOne({ email, role })

    if (!user) {
      user = await UserModel.create({
        id: `u-${nanoid(10)}`,
        name: safeName,
        email,
        phone: "0000000000",
        passwordHash: bcrypt.hashSync(nanoid(24), 10),
        role,
        provider: "google",
      })
    } else if (user.provider !== "google") {
      user.provider = "google"
      if (!user.name) {
        user.name = safeName
      }
      await user.save()
    }

    res.json({
      success: true,
      user: { id: user.id, name: user.name, role: user.role, email: user.email },
    })
  }),
)

app.post(
  "/api/v1/auth/register",
  asyncHandler(async (req, res) => {
    const { name, password, confirmPassword, role } = req.body ?? {}
    const email = normalizeEmail(req.body?.email)
    const phone = normalizePhone(req.body?.phone)
    if (!name || !email || !phone || !password || !confirmPassword || !role) {
      res.status(400).json({ success: false, message: "Please complete all required fields." })
      return
    }
    if (password !== confirmPassword) {
      res.status(400).json({ success: false, message: "Passwords do not match." })
      return
    }
    if (String(password).length < 6) {
      res.status(400).json({ success: false, message: "Password must be at least 6 characters." })
      return
    }

    const existing = await UserModel.findOne({ email }).lean()
    if (existing) {
      res.status(409).json({ success: false, message: "Email already registered." })
      return
    }

    const id = `u-${nanoid(10)}`
    const hash = bcrypt.hashSync(String(password), 10)
    await UserModel.create({
      id,
      name,
      email,
      phone,
      passwordHash: hash,
      role,
      provider: "local",
    })

    res.status(201).json({ success: true, user: { id, name, email, role } })
  }),
)

app.get(
  "/api/v1/ml/sessions/:sessionId",
  asyncHandler(async (req, res) => {
    const { sessionId } = req.params
    const session = await ScreeningSessionModel.findOne({ id: sessionId }, { _id: 0, __v: 0 }).lean()
    if (!session) {
      res.status(404).json({ success: false, message: "Session not found." })
      return
    }
    res.json({ success: true, ...session })
  }),
)

app.use((err, _req, res, _next) => {
  const message = err instanceof Error ? err.message : "Internal server error"
  res.status(500).json({ success: false, message })
})

app.use((_req, res) => {
  res.status(404).json({ ok: false, message: "Endpoint not found" })
})

const startServer = async () => {
  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing in backend/.env")
  }
  await connectDatabase(mongoUri)
  app.listen(port, () => {
    console.log(`ManasSaathi backend running on http://localhost:${port}`)
  })
}

startServer().catch((error) => {
  console.error("Failed to start backend:", error)
  console.error(
    "Hints: verify Atlas Network Access (allow your IP), verify DB user/password, and set MONGO_TLS_ALLOW_INVALID=true only for local TLS debugging.",
  )
  process.exit(1)
})
