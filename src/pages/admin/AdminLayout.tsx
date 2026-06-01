import { useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Camera, LayoutDashboard, Images, ShoppingBag, LogOut } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

export default function AdminLayout() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate('/admin/login', { replace: true })
      } else {
        setUser(data.session.user)
      }
      setChecking(false)
    })
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  if (checking) return null

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
      isActive ? 'bg-accent/20 text-accent-light' : 'text-white/60 hover:text-white hover:bg-white/5'
    }`

  return (
    <div className="min-h-screen flex bg-night-950">
      {/* Sidebar */}
      <aside className="w-56 border-r border-white/10 bg-night-900 flex flex-col">
        <div className="flex items-center gap-2 px-4 h-16 border-b border-white/10">
          <Camera className="text-accent-light" size={18} />
          <span className="font-bold text-sm text-gradient">Admin</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavLink to="/admin" end className={navClass}>
            <LayoutDashboard size={16} /> Dashboard
          </NavLink>
          <NavLink to="/admin/photos" className={navClass}>
            <Images size={16} /> Photos
          </NavLink>
          <NavLink to="/admin/orders" className={navClass}>
            <ShoppingBag size={16} /> Orders
          </NavLink>
        </nav>
        <div className="p-3 border-t border-white/10">
          <p className="text-white/30 text-xs px-3 mb-2 truncate">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 w-full transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
