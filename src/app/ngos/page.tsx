'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface NGO {
  id: string
  name: string
  description: string
  website: string | null
  email: string | null
  phone: string | null
  state: string
  focusAreas: string
  lastActivityAt: string
  _count: {
    issues: number
  }
}

const malaysianStates = [
  'Johor', 'Kedah', 'Kelantan', 'Kuala Lumpur', 'Labuan', 'Malacca',
  'Negeri Sembilan', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Putrajaya',
  'Sabah', 'Sarawak', 'Selangor', 'Terengganu'
]

function getActivityStatus(lastActivityAt: string): { status: 'active' | 'warning' | 'inactive', label: string, icon: string, bgColor: string, textColor: string } {
  const daysSinceActivity = Math.floor((Date.now() - new Date(lastActivityAt).getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysSinceActivity <= 14) {
    return {
      status: 'active',
      label: 'Active',
      icon: '🟢',
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-700'
    }
  } else if (daysSinceActivity <= 60) {
    return {
      status: 'warning',
      label: `${daysSinceActivity}d ago`,
      icon: '🟠',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-700'
    }
  } else {
    return {
      status: 'inactive',
      label: `${daysSinceActivity}d ago`,
      icon: '🔴',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700'
    }
  }
}

export default function NGOsPage() {
  const [ngos, setNgos] = useState<NGO[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedState, setSelectedState] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activityFilter, setActivityFilter] = useState('all')

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

  // Filter by activity status client-side
  const filteredNGOs = activityFilter === 'all' 
    ? ngos 
    : ngos.filter(ngo => {
        const status = getActivityStatus(ngo.lastActivityAt)
        return status.status === activityFilter
      })

  // Count by status
  const statusCounts = {
    active: ngos.filter(ngo => getActivityStatus(ngo.lastActivityAt).status === 'active').length,
    warning: ngos.filter(ngo => getActivityStatus(ngo.lastActivityAt).status === 'warning').length,
    inactive: ngos.filter(ngo => getActivityStatus(ngo.lastActivityAt).status === 'inactive').length,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Malaysian NGOs</h1>
        <p className="text-slate-600">
          Discover and connect with non-governmental organizations working across Malaysia. 
          Click on any NGO to view their projects, volunteer opportunities, and impact reports.
        </p>
      </div>

      {/* Activity Status Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <button 
          onClick={() => setActivityFilter(activityFilter === 'active' ? 'all' : 'active')}
          className={`card text-center transition-all ${activityFilter === 'active' ? 'ring-2 ring-emerald-500' : ''}`}
        >
          <div className="text-2xl mb-1">🟢</div>
          <div className="text-2xl font-bold text-emerald-600">{statusCounts.active}</div>
          <div className="text-xs text-slate-500">Active NGOs</div>
        </button>
        <button 
          onClick={() => setActivityFilter(activityFilter === 'warning' ? 'all' : 'warning')}
          className={`card text-center transition-all ${activityFilter === 'warning' ? 'ring-2 ring-amber-500' : ''}`}
        >
          <div className="text-2xl mb-1">🟠</div>
          <div className="text-2xl font-bold text-amber-600">{statusCounts.warning}</div>
          <div className="text-xs text-slate-500">Need Updates</div>
        </button>
        <button 
          onClick={() => setActivityFilter(activityFilter === 'inactive' ? 'all' : 'inactive')}
          className={`card text-center transition-all ${activityFilter === 'inactive' ? 'ring-2 ring-red-500' : ''}`}
        >
          <div className="text-2xl mb-1">🔴</div>
          <div className="text-2xl font-bold text-red-600">{statusCounts.inactive}</div>
          <div className="text-xs text-slate-500">Inactive</div>
        </button>
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
        {activityFilter !== 'all' && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-slate-600">Filtering by:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              activityFilter === 'active' ? 'bg-emerald-100 text-emerald-700' :
              activityFilter === 'warning' ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>
              {activityFilter === 'active' ? '🟢 Active' : 
               activityFilter === 'warning' ? '🟠 Needs Update' : 
               '🔴 Inactive'}
            </span>
            <button 
              onClick={() => setActivityFilter('all')}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="mb-4 text-slate-600">
        Found <span className="font-semibold text-sky-700">{filteredNGOs.length}</span> NGO{filteredNGOs.length !== 1 ? 's' : ''}
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
      ) : filteredNGOs.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No NGOs Found</h3>
          <p className="text-slate-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNGOs.map((ngo, index) => {
            const activityStatus = getActivityStatus(ngo.lastActivityAt)
            
            return (
              <Link
                key={ngo.id}
                href={`/ngos/${ngo.id}`}
                className="card group animate-fade-in hover:shadow-lg cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-sky-700 transition-colors">
                    {ngo.name}
                  </h3>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${activityStatus.bgColor} ${activityStatus.textColor}`}>
                      {activityStatus.icon} {activityStatus.label}
                    </span>
                  </div>
                </div>
                
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {ngo.description}
                </p>
                
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                  <span>📍</span>
                  <span>{ngo.state}</span>
                  <span className="mx-1">•</span>
                  <span className="text-sky-600">{ngo._count.issues} issues</span>
                </div>
                
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {ngo.focusAreas.split(',').slice(0, 3).map((area) => (
                    <span 
                      key={area} 
                      className="px-2 py-0.5 bg-gradient-to-r from-teal-50 to-sky-50 text-teal-700 rounded text-xs font-medium border border-teal-100"
                    >
                      {area.trim()}
                    </span>
                  ))}
                </div>
                
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Click to view details</span>
                  <span className="text-sky-600 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
