export type AuthRole = "parent" | "doctor"
export type AuthMethod = "password" | "emailOtp" | "phoneOtp"
export type SocialProvider = "google" | "facebook"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const authApi = {
  sendEmailOtp: async (email: string) => {
    await wait(900)
    if (!email.includes("@")) throw new Error("Please enter a valid email.")
    return { success: true, target: email }
  },
  sendPhoneOtp: async (phone: string) => {
    await wait(900)
    if (phone.length < 8) throw new Error("Please enter a valid phone number.")
    return { success: true, target: phone }
  },
  verifyOtp: async (otp: string) => {
    await wait(850)
    if (otp.length !== 6) throw new Error("OTP must be 6 digits.")
    return { success: true }
  },
  loginWithPassword: async (_email: string, password: string, _role: AuthRole) => {
    await wait(900)
    if (password.length < 6) throw new Error("Password must be at least 6 characters.")
    return { success: true }
  },
  loginWithSocial: async (_provider: SocialProvider, _role: AuthRole) => {
    await wait(850)
    return { success: true }
  },
  resetPassword: async (payload: { target: string; otp: string; newPassword: string }) => {
    await wait(900)
    if (payload.otp.length !== 6) throw new Error("OTP must be 6 digits.")
    if (payload.newPassword.length < 6) throw new Error("Password must be at least 6 characters.")
    return { success: true }
  },
  registerUser: async (payload: {
    name: string
    email: string
    phone: string
    password: string
    confirmPassword: string
    role: AuthRole
  }) => {
    await wait(1050)
    if (!payload.name || !payload.email || !payload.phone) throw new Error("Please complete all required fields.")
    if (payload.password !== payload.confirmPassword) throw new Error("Passwords do not match.")
    if (payload.password.length < 6) throw new Error("Password must be at least 6 characters.")
    return { success: true }
  },
}
