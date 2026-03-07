import { Outlet } from "react-router-dom"
import Footer from "../components/layout/Footer"
import TopNav from "../components/layout/TopNav"

const AppShell = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-70">
        <div className="absolute top-[-12rem] left-[-10rem] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-6rem] bottom-[-10rem] h-[28rem] w-[28rem] rounded-full bg-blue-600/20 blur-3xl" />
      </div>
      <TopNav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default AppShell
