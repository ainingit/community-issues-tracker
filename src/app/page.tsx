import Link from 'next/link'
import { prisma } from '@/lib/prisma'

async function getStats() {
  const [ngoCount, issueCount, resolvedCount, inProgressCount] = await Promise.all([
    prisma.nGO.count(),
    prisma.issue.count(),
    prisma.issue.count({ where: { status: 'resolved' } }),
    prisma.issue.count({ where: { status: 'in_progress' } })
  ])
  
  return { ngoCount, issueCount, resolvedCount, inProgressCount }
}

async function getRecentIssues() {
  return prisma.issue.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { ngo: true }
  })
}

export default async function HomePage() {
  const stats = await getStats()
  const recentIssues = await getRecentIssues()

  const malaysianStates = [
    'Johor', 'Kedah', 'Kelantan', 'Malacca', 'Negeri Sembilan',
    'Pahang', 'Penang', 'Perak', 'Perlis', 'Sabah',
    'Sarawak', 'Selangor', 'Terengganu', 'Kuala Lumpur', 'Labuan', 'Putrajaya'
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-800 via-sky-700 to-teal-700 text-white p-8 md:p-12 mb-10 shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🇲🇾</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              Malaysia Community Platform
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Community Issues &<br />Impact Tracker
          </h1>
          
          <p className="text-sky-100 text-lg max-w-2xl mb-8 leading-relaxed">
            Connecting Malaysian communities with NGOs to address local issues. 
            Report problems, track progress, and create positive impact together.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link href="/issues/create" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-sky-900 font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl">
              <span>📝</span> Report an Issue
            </Link>
            <Link href="/ngos" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm font-medium px-6 py-3 rounded-xl transition-all border border-white/20">
              <span>🏢</span> View NGOs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="card text-center group hover:border-sky-200">
          <div className="text-3xl mb-2">🏢</div>
          <div className="text-3xl font-bold text-sky-800">{stats.ngoCount}</div>
          <div className="text-slate-500 text-sm font-medium">Registered NGOs</div>
        </div>
        <div className="card text-center group hover:border-amber-200">
          <div className="text-3xl mb-2">📋</div>
          <div className="text-3xl font-bold text-amber-600">{stats.issueCount}</div>
          <div className="text-slate-500 text-sm font-medium">Total Issues</div>
        </div>
        <div className="card text-center group hover:border-blue-200">
          <div className="text-3xl mb-2">🔄</div>
          <div className="text-3xl font-bold text-blue-600">{stats.inProgressCount}</div>
          <div className="text-slate-500 text-sm font-medium">In Progress</div>
        </div>
        <div className="card text-center group hover:border-emerald-200">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-3xl font-bold text-emerald-600">{stats.resolvedCount}</div>
          <div className="text-slate-500 text-sm font-medium">Resolved</div>
        </div>
      </section>

      {/* Recent Issues */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Recent Issues</h2>
          <Link href="/issues" className="text-sky-700 hover:text-sky-800 font-medium flex items-center gap-1">
            View all <span>→</span>
          </Link>
        </div>
        
        <div className="space-y-4">
          {recentIssues.map((issue, index) => (
            <div 
              key={issue.id} 
              className="card flex flex-col sm:flex-row sm:items-center gap-4 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`status-badge status-${issue.status}`}>
                    {issue.status.replace('_', ' ')}
                  </span>
                  <span className={`status-badge priority-${issue.priority}`}>
                    {issue.priority}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-800">{issue.title}</h3>
                <p className="text-slate-500 text-sm mt-1">
                  📍 {issue.state} • {issue.category}
                  {issue.ngo && <span className="ml-2">• 🏢 {issue.ngo.name}</span>}
                </p>
              </div>
              <Link 
                href="/issues" 
                className="btn-secondary text-sm whitespace-nowrap"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* States Coverage */}
      <section className="card">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Coverage Across Malaysia</h2>
        <div className="flex flex-wrap gap-2">
          {malaysianStates.map((state) => (
            <span 
              key={state}
              className="px-3 py-1.5 bg-gradient-to-r from-sky-50 to-teal-50 text-sky-800 rounded-lg text-sm font-medium border border-sky-100"
            >
              {state}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
