'use client'

import { useState, useEffect } from 'react'

interface NGO {
  id: string
  name: string
  description: string
  website: string | null
  email: string | null
  phone: string | null
  state: string
  focusAreas: string
  _count: {
    issues: number
  }
}

const malaysianStates = [
  'Johor', 'Kedah', 'Kelantan', 'Kuala Lumpur', 'Labuan', 'Malacca',
  'Negeri Sembilan', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Putrajaya',
  'Sabah', 'Sarawak', 'Selangor', 'Terengganu'
]

export default function NGOsPage() {
  const [ngos, setNgos] = useState<NGO[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedState, setSelectedState] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchNGOs()
  }, [selectedState, searchQuery])

  async function fetchNGOs() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedState !== 'all') params.append('state', selectedState)
      if (searchQuery) params.append('search', searchQuery)
      
      const response = await fetch(`/api/ngos?${params}`)
      const data = await response.json()
      setNgos(data)
    } catch (error) {
      console.error('Error fetching NGOs:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Malaysian NGOs</h1>
        <p className="text-slate-600">
          Discover and connect with non-governmental organizations working across Malaysia
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Search NGOs
            </label>
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="md:w-64">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Filter by State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="select-field"
            >
              <option value="all">All States</option>
              {malaysianStates.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-slate-600">
        Found <span className="font-semibold text-sky-700">{ngos.length}</span> NGO{ngos.length !== 1 ? 's' : ''}
      </div>

      {/* NGO Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-slate-100 rounded w-full mb-2"></div>
              <div className="h-4 bg-slate-100 rounded w-2/3 mb-4"></div>
              <div className="h-8 bg-slate-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : ngos.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No NGOs Found</h3>
          <p className="text-slate-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ngos.map((ngo, index) => (
            <div 
              key={ngo.id} 
              className="card group animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-sky-700 transition-colors">
                  {ngo.name}
                </h3>
                <span className="flex-shrink-0 ml-2 bg-sky-100 text-sky-700 px-2 py-0.5 rounded text-xs font-medium">
                  {ngo._count.issues} issue{ngo._count.issues !== 1 ? 's' : ''}
                </span>
              </div>
              
              <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                {ngo.description}
              </p>
              
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                <span>📍</span>
                <span>{ngo.state}</span>
              </div>
              
              <div className="flex flex-wrap gap-1.5 mb-4">
                {ngo.focusAreas.split(',').map((area) => (
                  <span 
                    key={area} 
                    className="px-2 py-0.5 bg-gradient-to-r from-teal-50 to-sky-50 text-teal-700 rounded text-xs font-medium border border-teal-100"
                  >
                    {area.trim()}
                  </span>
                ))}
              </div>
              
              <div className="border-t border-slate-100 pt-4 mt-auto space-y-2">
                {ngo.website && (
                  <a 
                    href={ngo.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-sky-700 hover:text-sky-800 transition-colors"
                  >
                    <span>🌐</span>
                    <span className="truncate">{ngo.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}
                {ngo.email && (
                  <a 
                    href={`mailto:${ngo.email}`}
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    <span>✉️</span>
                    <span className="truncate">{ngo.email}</span>
                  </a>
                )}
                {ngo.phone && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span>📞</span>
                    <span>{ngo.phone}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

