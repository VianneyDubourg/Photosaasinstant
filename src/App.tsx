import { Routes, Route } from 'react-router-dom'
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

export default function App() {
  return (
    <Routes>
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
