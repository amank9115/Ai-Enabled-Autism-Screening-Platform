import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

export type UserRole = "parent" | "doctor"

type User = {
  name: string
  role: UserRole
}

type AuthContextValue = {
  user: User | null
  login: (name: string, role: UserRole) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  const value = useMemo(
    () => ({
      user,
      login: (name: string, role: UserRole) => setUser({ name, role }),
      logout: () => setUser(null),
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
