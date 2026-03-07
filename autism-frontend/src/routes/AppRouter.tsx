import { BrowserRouter, Route, Routes } from "react-router-dom"
import AppShell from "../layout/AppShell"
import CollaborationPage from "../pages/CollaborationPage"
import DoctorDashboardPage from "../pages/DoctorDashboardPage"
import LandingPage from "../pages/LandingPage"
import LiveScreeningPage from "../pages/LiveScreeningPage"
import NotFoundPage from "../pages/NotFoundPage"
import ParentDashboardPage from "../pages/ParentDashboardPage"
import VideoAnalysisPage from "../pages/VideoAnalysisPage"

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/live-screening" element={<LiveScreeningPage />} />
          <Route path="/parent" element={<ParentDashboardPage />} />
          <Route path="/doctor" element={<DoctorDashboardPage />} />
          <Route path="/video-analysis" element={<VideoAnalysisPage />} />
          <Route path="/collaboration" element={<CollaborationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
