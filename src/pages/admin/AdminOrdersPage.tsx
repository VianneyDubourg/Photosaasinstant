import { useOrders } from '../../hooks/useOrders'
import { Loader2 } from 'lucide-react'

export default function AdminOrdersPage() {
  const { data: orders = [], isLoading } = useOrders()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-accent-light" size={24} />
        </div>
      ) : (
        <div className="bg-night-800 border border-white/10 rounded-xl overflow-hidden">
          {orders.length === 0 ? (
            <p className="text-white/40 text-sm text-center py-8">No orders yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/50 text-left">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Photo</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 text-white/60">
                      {new Date(order.created_at).toLocaleString('en-AU')}
                    </td>
                    <td className="px-4 py-3 text-white/60">{order.buyer_email ?? '—'}</td>
                    <td className="px-4 py-3 text-white/50 font-mono text-xs">{order.photo_id.slice(0, 8)}…</td>
                    <td className="px-4 py-3 text-right">
                      {(order.amount_total / 100).toFixed(2)} {order.currency.toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        order.status === 'paid'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
