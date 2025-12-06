'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface NGO {
  id: string
  name: string
}

interface Issue {
  id: string
  title: string
  description: string
  category: string
  state: string
  status: string
  priority: string
  ngoId: string | null
  ngo: NGO | null
  createdAt: string
  updatedAt: string
}

const malaysianStates = [
  'Johor', 'Kedah', 'Kelantan', 'Kuala Lumpur', 'Labuan', 'Malacca',
  'Negeri Sembilan', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Putrajaya',
  'Sabah', 'Sarawak', 'Selangor', 'Terengganu'
]

const categories = [
  'Disaster Relief', 'Environment', 'Poverty Relief', 'Education',
  'Marine Conservation', 'Women Rights', 'Elderly Care', 'Children Welfare',
  'Healthcare', 'Community Development', 'Other'
]

const statuses = [
  { value: 'open', label: 'Open', color: 'amber' },
  { value: 'in_progress', label: 'In Progress', color: 'sky' },
  { value: 'resolved', label: 'Resolved', color: 'emerald' }
]

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' }
]

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: 'all',
    state: 'all',
    category: 'all',
    priority: 'all'
  })
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    fetchIssues()
  }, [filters])

  async function fetchIssues() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== 'all') params.append(key, value)
      })
      
      const response = await fetch(`/api/issues?${params}`)
      const data = await response.json()
      setIssues(data)
    } catch (error) {
      console.error('Error fetching issues:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateIssueStatus(id: string, newStatus: string) {
    setUpdatingId(id)
    try {
      const response = await fetch(`/api/issues/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        const updatedIssue = await response.json()
        setIssues(issues.map(issue => 
          issue.id === id ? updatedIssue : issue
        ))
      }
    } catch (error) {
      console.error('Error updating issue:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Community Issues</h1>
          <p className="text-slate-600">
            Track and manage issues affecting communities across Malaysia
          </p>
        </div>
        <Link href="/issues/create" className="btn-primary whitespace-nowrap">
          + Report New Issue
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <h3 className="font-semibold text-slate-700 mb-4">Filter Issues</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="select-field"
            >
              <option value="all">All Statuses</option>
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">State</label>
            <select
              value={filters.state}
              onChange={(e) => setFilters({ ...filters, state: e.target.value })}
              className="select-field"
            >
              <option value="all">All States</option>
              {malaysianStates.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="select-field"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="select-field"
            >
              <option value="all">All Priorities</option>
              {priorities.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-slate-600">
        Showing <span className="font-semibold text-sky-700">{issues.length}</span> issue{issues.length !== 1 ? 's' : ''}
      </div>

      {/* Issues List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : issues.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No Issues Found</h3>
          <p className="text-slate-500 mb-4">Try adjusting your filters or report a new issue</p>
          <Link href="/issues/create" className="btn-primary inline-block">
            Report New Issue
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {issues.map((issue, index) => (
            <div 
              key={issue.id} 
              className="card animate-fade-in"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Main content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`status-badge status-${issue.status}`}>
                      {issue.status.replace('_', ' ')}
                    </span>
                    <span className={`status-badge priority-${issue.priority}`}>
                      {issue.priority}
                    </span>
                    <span className="text-xs text-slate-400">
                      #{issue.id.slice(-6)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {issue.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                    {issue.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      📍 {issue.state}
                    </span>
                    <span className="flex items-center gap-1">
                      🏷️ {issue.category}
                    </span>
                    {issue.ngo && (
                      <span className="flex items-center gap-1">
                        🏢 {issue.ngo.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      📅 {formatDate(issue.createdAt)}
                    </span>
                  </div>
                </div>
                
                {/* Status update */}
                <div className="lg:w-48 flex-shrink-0">
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Update Status
                  </label>
                  <select
                    value={issue.status}
                    onChange={(e) => updateIssueStatus(issue.id, e.target.value)}
                    disabled={updatingId === issue.id}
                    className={`select-field text-sm ${updatingId === issue.id ? 'opacity-50' : ''}`}
                  >
                    {statuses.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  {updatingId === issue.id && (
                    <p className="text-xs text-sky-600 mt-1">Updating...</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

