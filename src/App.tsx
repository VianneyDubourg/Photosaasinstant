import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.setAttribute('href', `https://vlogo.fr${pathname}`)
  }, [pathname])
  return null
}
import { supabase } from './lib/supabase'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import GalleryPage from './pages/GalleryPage'
import PhotoPage from './pages/PhotoPage'
import SuccessPage from './pages/SuccessPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminPhotosPage from './pages/admin/AdminPhotosPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminLeadsPage from './pages/admin/AdminLeadsPage'
import SlideshowPage from './pages/SlideshowPage'
import BrochurePage from './pages/BrochurePage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import RefundPage from './pages/RefundPage'
import NotFoundPage from './pages/NotFoundPage'

function ProtectedSlideshow() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session))
  }, [])
  if (authed === null) return null
  if (!authed) return <Navigate to="/admin/login" replace />
  return <SlideshowPage />
}

export default function App() {
  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route path="/slideshow" element={<ProtectedSlideshow />} />
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/photos" element={<GalleryPage />} />
        <Route path="/photo/:id" element={<PhotoPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/brochure" element={<BrochurePage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/refund" element={<RefundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="photos" element={<AdminPhotosPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="leads" element={<AdminLeadsPage />} />
      </Route>
    </Routes>
    </>
  )
}
