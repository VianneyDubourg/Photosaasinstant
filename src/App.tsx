import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
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
import SlideshowPage from './pages/SlideshowPage'

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
    <Routes>
      <Route path="/slideshow" element={<ProtectedSlideshow />} />
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/photos" element={<GalleryPage />} />
        <Route path="/photo/:id" element={<PhotoPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Route>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="photos" element={<AdminPhotosPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
      </Route>
    </Routes>
  )
}
