import { useLeads } from '../../hooks/useLeads'
import { Loader2, Mail, Building2 } from 'lucide-react'

export default function AdminLeadsPage() {
  const { data: leads = [], isLoading } = useLeads()

  const thisWeek = leads.filter(l => {
    const d = new Date(l.created_at)
    const now = new Date()
    const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
    return d >= weekAgo
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Brochure Leads</h1>
        <div className="flex gap-3 text-sm text-white/50">
          <span><strong className="text-white">{leads.length}</strong> total</span>
          <span>·</span>
          <span><strong className="text-accent-light">{thisWeek.length}</strong> this week</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-accent-light" size={24} />
        </div>
      ) : (
        <div className="bg-night-800 border border-white/10 rounded-xl overflow-hidden">
          {leads.length === 0 ? (
            <p className="text-white/40 text-sm text-center py-8">No leads yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/50 text-left">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Venue</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 text-white/50 whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString('en-AU')}
                    </td>
                    <td className="px-4 py-3 text-white/80">{lead.email}</td>
                    <td className="px-4 py-3 text-white/50">{lead.name ?? '—'}</td>
                    <td className="px-4 py-3">
                      {lead.venue_name ? (
                        <span className="flex items-center gap-1.5 text-accent-light">
                          <Building2 size={12} />
                          {lead.venue_name}
                        </span>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`mailto:${lead.email}?subject=Following up on your PhotoInstant inquiry${lead.venue_name ? ` — ${lead.venue_name}` : ''}`}
                        className="flex items-center gap-1.5 text-accent-light hover:text-white text-xs transition-colors"
                      >
                        <Mail size={13} />
                        Follow up
                      </a>
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
