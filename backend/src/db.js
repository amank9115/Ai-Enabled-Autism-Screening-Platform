import bcrypt from "bcryptjs"
import mongoose from "mongoose"

const { Schema } = mongoose

const UserSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ["parent", "doctor"] },
    provider: { type: String, required: true, default: "local" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } },
)

const ChildSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  age: { type: String, required: true },
  lastSession: { type: String, required: true },
  riskLevel: { type: String, required: true },
})

const SessionHistorySchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  childName: { type: String, required: true },
  date: { type: String, required: true },
  duration: { type: String, required: true },
  attentionAverage: { type: Number, required: true },
  riskScore: { type: Number, required: true },
  status: { type: String, required: true },
})

const MessageSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  from: { type: String, required: true, enum: ["parent", "doctor"] },
  name: { type: String, required: true },
  message: { type: String, required: true },
  at: { type: String, required: true },
})

const ScreeningMetricSchema = new Schema(
  {
    frameIndex: { type: Number, required: true },
    eyeContact: { type: Number, required: true },
    attentionSpan: { type: Number, required: true },
    emotionSignals: { type: Number, required: true },
    gestureAnalysis: { type: Number, required: true },
    confidence: { type: Number, required: true },
  },
  { _id: false },
)

const ScreeningSessionSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, default: null },
    source: { type: String, required: true },
    modelVersion: { type: String, required: true },
    riskScore: { type: Number, required: true },
    riskLabel: { type: String, required: true },
    summary: {
      eyeContact: Number,
      attentionSpan: Number,
      emotionSignals: Number,
      gestureAnalysis: Number,
    },
    recommendations: [{ type: String }],
    metrics: [ScreeningMetricSchema],
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } },
)

const PreScreeningProfileSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    childName: { type: String, required: true },
    age: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, required: true },
    parentName: { type: String, required: true },
    parentPhone: { type: String, required: true },
    parentEmail: { type: String, required: true, index: true },
    homeAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    medicalNotes: { type: String, default: "" },
    location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
      capturedAt: { type: String, default: null },
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } },
)

export const UserModel = mongoose.model("User", UserSchema)
export const ChildModel = mongoose.model("Child", ChildSchema)
export const SessionHistoryModel = mongoose.model("SessionHistory", SessionHistorySchema)
export const MessageModel = mongoose.model("Message", MessageSchema)
export const ScreeningSessionModel = mongoose.model("ScreeningSession", ScreeningSessionSchema)
export const PreScreeningProfileModel = mongoose.model("PreScreeningProfile", PreScreeningProfileSchema)

const seedDataIfEmpty = async () => {
  if (process.env.SEED_DEMO_DATA !== "true") {
    return
  }

  const userCount = await UserModel.countDocuments()
  if (userCount === 0) {
    const defaultHash = bcrypt.hashSync("password123", 10)
    await UserModel.insertMany([
      {
        id: "u-parent-1",
        name: "Meera Sharma",
        email: "meera@manassaathi.ai",
        phone: "9999988888",
        passwordHash: defaultHash,
        role: "parent",
        provider: "local",
      },
      {
        id: "u-doctor-1",
        name: "Dr. Rao",
        email: "rao@manassaathi.ai",
        phone: "9999977777",
        passwordHash: defaultHash,
        role: "doctor",
        provider: "local",
      },
    ])
  }

  const childCount = await ChildModel.countDocuments()
  if (childCount === 0) {
    await ChildModel.insertMany([
      { id: "CH-102", name: "Aarav", age: "4y", lastSession: "2026-03-03", riskLevel: "Moderate" },
      { id: "CH-108", name: "Sara", age: "3y", lastSession: "2026-03-04", riskLevel: "Low" },
      { id: "CH-119", name: "Ishaan", age: "5y", lastSession: "2026-03-05", riskLevel: "High" },
    ])
  }

  const sessionCount = await SessionHistoryModel.countDocuments()
  if (sessionCount === 0) {
    await SessionHistoryModel.insertMany([
      {
        id: "S-2001",
        childName: "Aarav",
        date: "2026-03-03",
        duration: "12m",
        attentionAverage: 66,
        riskScore: 42,
        status: "Reviewed",
      },
      {
        id: "S-2002",
        childName: "Sara",
        date: "2026-03-04",
        duration: "10m",
        attentionAverage: 72,
        riskScore: 28,
        status: "Reviewed",
      },
      {
        id: "S-2003",
        childName: "Ishaan",
        date: "2026-03-05",
        duration: "14m",
        attentionAverage: 54,
        riskScore: 64,
        status: "Pending",
      },
    ])
  }

  const messageCount = await MessageModel.countDocuments()
  if (messageCount === 0) {
    await MessageModel.insertMany([
      {
        id: "m-1",
        from: "parent",
        name: "Meera",
        message: "Uploaded week 5 home session.",
        at: "2026-03-06 10:30",
      },
      {
        id: "m-2",
        from: "doctor",
        name: "Dr. Rao",
        message: "Received. Reviewing now.",
        at: "2026-03-06 11:10",
      },
    ])
  }
}

export const connectDatabase = async (mongoUri) => {
  const isLocalMongo = mongoUri.startsWith("mongodb://127.0.0.1") || mongoUri.startsWith("mongodb://localhost")
  const useTls = !isLocalMongo

  const baseOptions = {
    serverSelectionTimeoutMS: 10000,
    tls: useTls,
    family: Number(process.env.MONGO_IP_FAMILY || 4),
    tlsAllowInvalidCertificates: useTls && process.env.MONGO_TLS_ALLOW_INVALID === "true",
    tlsAllowInvalidHostnames: useTls && process.env.MONGO_TLS_ALLOW_INVALID === "true",
  }

  try {
    await mongoose.connect(mongoUri, baseOptions)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    const isTlsAlert = message.includes("ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR")
    if (!useTls || !isTlsAlert || process.env.MONGO_TLS_ALLOW_INVALID === "true") {
      throw error
    }

    // Fallback for environments with strict TLS interception (dev only).
    await mongoose.connect(mongoUri, {
      ...baseOptions,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
    })
  }

  await seedDataIfEmpty()
}
