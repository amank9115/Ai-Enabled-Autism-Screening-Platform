import { fetchJson } from "../api/client"

export type AuthRole = "parent" | "doctor"
export type AuthMethod = "password" | "emailOtp" | "phoneOtp"

type AuthUser = {
  id: string
  name: string
  role: AuthRole
  email: string
}

export const authApi = {
  sendEmailOtp: async (email: string) => {
    return fetchJson<{ success: boolean; target: string }>("/auth/email-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  },
  sendPhoneOtp: async (phone: string) => {
    return fetchJson<{ success: boolean; target: string }>("/auth/phone-otp", {
      method: "POST",
      body: JSON.stringify({ phone }),
    })
  },
  verifyOtp: async (otp: string) => {
    return fetchJson<{ success: boolean }>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ otp }),
    })
  },
  loginWithOtp: async (payload: { email?: string; phone?: string; role: AuthRole; name?: string }) => {
    return fetchJson<{ success: boolean; user: AuthUser }>("/auth/otp-login", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },
  loginWithPassword: async (email: string, password: string, role: AuthRole, name?: string) => {
    return fetchJson<{ success: boolean; user: AuthUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, role, name }),
    })
  },
  loginWithGoogle: async (payload: { email: string; name?: string; role: AuthRole }) => {
    return fetchJson<{ success: boolean; user: AuthUser }>("/auth/google", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },
  registerUser: async (payload: {
    name: string
    email: string
    phone: string
    password: string
    confirmPassword: string
    role: AuthRole
  }) => {
    return fetchJson<{ success: boolean; user: AuthUser }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },
}
