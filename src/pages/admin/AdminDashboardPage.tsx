import { usePhotos } from '../../hooks/usePhotos'
import { useOrders } from '../../hooks/useOrders'
import { Images, ShoppingBag, DollarSign, TrendingUp, Calendar, Clock } from 'lucide-react'

export default function AdminDashboardPage() {
  const { data: photos = [] } = usePhotos()
  const { data: orders = [] } = useOrders()

  const paidOrders = orders.filter((o) => o.status === 'paid')
  const revenue = paidOrders.reduce((acc, o) => acc + o.amount_total, 0)

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(startOfToday)
  startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay())

  const todayOrders = paidOrders.filter(o => new Date(o.created_at) >= startOfToday)
  const weekOrders = paidOrders.filter(o => new Date(o.created_at) >= startOfWeek)
  const todayRevenue = todayOrders.reduce((acc, o) => acc + o.amount_total, 0)
  const weekRevenue = weekOrders.reduce((acc, o) => acc + o.amount_total, 0)

  const stats = [
    { icon: Images, label: 'Active Photos', value: photos.length },
    { icon: ShoppingBag, label: 'Total Orders', value: paidOrders.length },
    { icon: DollarSign, label: 'Total Revenue', value: `${(revenue / 100).toFixed(2)} AUD` },
    { icon: TrendingUp, label: 'Conversion', value: photos.length > 0 ? `${((paidOrders.length / photos.length) * 100).toFixed(1)}%` : '—' },
  ]

  const periodStats = [
    { icon: Clock, label: 'Sales today', orders: todayOrders.length, revenue: todayRevenue },
    { icon: Calendar, label: 'Sales this week', orders: weekOrders.length, revenue: weekRevenue },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-night-800 border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-3">
              <Icon size={15} />
              {label}
            </div>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Period stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {periodStats.map(({ icon: Icon, label, orders: cnt, revenue: rev }) => (
          <div key={label} className="bg-night-800 border border-white/10 rounded-xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center">
                <Icon size={16} className="text-accent-light" />
              </div>
              <div>
                <p className="text-white/50 text-xs">{label}</p>
                <p className="text-white font-semibold">{cnt} order{cnt !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <p className="text-accent-light font-bold text-lg">{(rev / 100).toFixed(2)} AUD</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="bg-night-800 border border-white/10 rounded-xl overflow-hidden">
          {paidOrders.length === 0 ? (
            <p className="text-white/40 text-sm text-center py-8">No orders yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/50">
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-right px-4 py-3">Amount</th>
                  <th className="text-right px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {paidOrders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 text-white/60">
                      {new Date(order.created_at).toLocaleDateString('en-AU')}
                    </td>
                    <td className="px-4 py-3 text-white/60">{order.buyer_email ?? '—'}</td>
                    <td className="px-4 py-3 text-right">
                      {(order.amount_total / 100).toFixed(2)} {order.currency.toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
