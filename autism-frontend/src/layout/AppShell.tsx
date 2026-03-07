import { Outlet } from "react-router-dom"
import AnimatedBackground from "../components/effects/AnimatedBackground"
import CustomCursor from "../components/effects/CustomCursor"
import Footer from "../components/layout/Footer"
import GlassNavbar from "../components/layout/GlassNavbar"

const AppShell = () => {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-400">
      <AnimatedBackground />
      <CustomCursor />
      <GlassNavbar />
      <main className="pt-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default AppShell
