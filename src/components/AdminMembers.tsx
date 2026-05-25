'use client';

export default function AdminMembers({ members }: { members: any[] }) {
  const fmt = (d: string) => new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  const active = members.filter(m => m.status === 'active').length;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(74,191,176,0.1), rgba(74,191,176,0.05))', border: '1px solid rgba(74,191,176,0.2)' }}>
          <p className="text-3xl font-bold" style={{ color: '#4ABFB0' }}>{active}</p>
          <p className="text-sm font-semibold mt-1" style={{ color: '#1a2e44' }}>Active Members</p>
        </div>
        <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(123,79,166,0.1), rgba(123,79,166,0.05))', border: '1px solid rgba(123,79,166,0.2)' }}>
          <p className="text-3xl font-bold" style={{ color: '#7B4FA6' }}>{members.length}</p>
          <p className="text-sm font-semibold mt-1" style={{ color: '#1a2e44' }}>Total Subscriptions</p>
        </div>
        <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(26,46,68,0.08), rgba(26,46,68,0.04))', border: '1px solid rgba(26,46,68,0.1)' }}>
          <p className="text-3xl font-bold" style={{ color: '#1a2e44' }}>${(active * 39).toLocaleString()}</p>
          <p className="text-sm font-semibold mt-1" style={{ color: '#1a2e44' }}>Est. Monthly Revenue</p>
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(74,191,176,0.2)' }}>
        <table className="w-full text-sm">
          <thead><tr style={{ background: 'rgba(74,191,176,0.08)' }}><th className="text-left px-4 py-3 font-semibold text-xs" style={{ color: '#1a2e44' }}>User ID</th><th className="text-left px-4 py-3 font-semibold text-xs" style={{ color: '#1a2e44' }}>Status</th><th className="text-left px-4 py-3 font-semibold text-xs" style={{ color: '#1a2e44' }}>Renews</th><th className="text-left px-4 py-3 font-semibold text-xs" style={{ color: '#1a2e44' }}>Joined</th></tr></thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={m.id} style={{ background: i % 2 === 0 ? '#fff' : 'rgba(74,191,176,0.02)', borderTop: '1px solid rgba(74,191,176,0.1)' }}>
                <td className="px-4 py-3 font-mono text-xs" style={{ color: '#4a5568' }}>{m.user_id?.slice(0, 16)}...</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: m.status === 'active' ? 'rgba(74,191,176,0.12)' : 'rgba(255,0,0,0.08)', color: m.status === 'active' ? '#4ABFB0' : '#ef4444' }}>{m.status}</span></td>
                <td className="px-4 py-3 text-xs" style={{ color: '#4a5568' }}>{m.current_period_end ? fmt(m.current_period_end) : '-'}</td>
                <td className="px-4 py-3 text-xs" style={{ color: '#4a5568' }}>{fmt(m.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {members.length === 0 && <p className="text-sm text-center py-8" style={{ color: '#4a5568' }}>No members yet.</p>}
      </div>
    </div>
  );
}
