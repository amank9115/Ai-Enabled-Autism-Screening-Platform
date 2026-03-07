import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

export type UserRole = "parent" | "doctor"

type User = {
  name: string
  role: UserRole
}

const AUTH_STORAGE_KEY = "manassaathi-auth-user"

type AuthContextValue = {
  user: User | null
  login: (name: string, role: UserRole) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw) as User
      if (parsed?.name && (parsed.role === "parent" || parsed.role === "doctor")) return parsed
      return null
    } catch {
      return null
    }
  })

  const value = useMemo(
    () => ({
      user,
      login: (name: string, role: UserRole) => {
        const nextUser = { name, role }
        setUser(nextUser)
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser))
      },
      logout: () => {
        setUser(null)
        localStorage.removeItem(AUTH_STORAGE_KEY)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}
