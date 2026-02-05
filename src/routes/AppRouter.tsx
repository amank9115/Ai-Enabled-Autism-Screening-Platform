import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import RootLayout from "../layouts/RootLayout"
import AboutPage from "../pages/AboutPage"
import CaregiversPage from "../pages/CaregiversPage"
import CliniciansPage from "../pages/CliniciansPage"
import FeaturesPage from "../pages/FeaturesPage"
import HowItWorksPage from "../pages/HowItWorksPage"
import ImpactPage from "../pages/ImpactPage"
import LandingPage from "../pages/LandingPage"
import NotFoundPage from "../pages/NotFoundPage"
import RoadmapPage from "../pages/RoadmapPage"
import TechnologyPage from "../pages/TechnologyPage"

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/technology" element={<TechnologyPage />} />
          <Route path="/caregivers" element={<CaregiversPage />} />
          <Route path="/clinicians" element={<CliniciansPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
