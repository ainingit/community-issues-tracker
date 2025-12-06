'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Project {
  id: string
  title: string
  description: string
  status: string
  startDate: string
  endDate: string | null
  budget: number | null
  beneficiaries: number | null
  location: string | null
}

interface VolunteerCall {
  id: string
  title: string
  description: string
  volunteersNeeded: number
  volunteersRegistered: number
  skills: string | null
  location: string
  startDate: string
  endDate: string | null
  status: string
}

interface ImpactReport {
  id: string
  title: string
  testimony: string
  photoUrl: string | null
  reporterName: string | null
  location: string | null
  verified: boolean
  createdAt: string
}

interface NGO {
  id: string
  name: string
  description: string
  website: string | null
  email: string | null
  phone: string | null
  state: string
  focusAreas: string
  address: string | null
  latitude: number | null
  longitude: number | null
  lastActivityAt: string
  createdAt: string
  projects: Project[]
  volunteerCalls: VolunteerCall[]
  impactReports: ImpactReport[]
  _count: {
    issues: number
  }
}

function getActivityStatus(lastActivityAt: string): { status: 'active' | 'warning' | 'inactive', label: string, color: string, bgColor: string, description: string } {
  const daysSinceActivity = Math.floor((Date.now() - new Date(lastActivityAt).getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysSinceActivity <= 14) {
    return {
      status: 'active',
      label: 'Active',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-100',
      description: `Last updated ${daysSinceActivity} day${daysSinceActivity !== 1 ? 's' : ''} ago`
    }
  } else if (daysSinceActivity <= 60) {
    return {
      status: 'warning',
      label: 'Needs Update',
      color: 'text-amber-700',
      bgColor: 'bg-amber-100',
      description: `No updates for ${daysSinceActivity} days`
    }
  } else {
    return {
      status: 'inactive',
      label: 'Inactive',
      color: 'text-red-700',
      bgColor: 'bg-red-100',
      description: `No updates for ${daysSinceActivity} days`
    }
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    maximumFractionDigits: 0
  }).format(amount)
}

export default function NGODetailPage() {
  const params = useParams()
  const [ngo, setNgo] = useState<NGO | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'projects' | 'volunteers' | 'impact'>('projects')

  useEffect(() => {
    if (params.id) {
      fetchNGO(params.id as string)
    }
  }, [params.id])

  async function fetchNGO(id: string) {
    setLoading(true)
    try {
      const response = await fetch(`/api/ngos/${id}`)
      if (response.ok) {
        const data = await response.json()
        setNgo(data)
      }
    } catch (error) {
      console.error('Error fetching NGO:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-slate-100 rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="h-48 bg-slate-100 rounded-xl"></div>
              <div className="h-64 bg-slate-100 rounded-xl"></div>
            </div>
            <div className="h-96 bg-slate-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!ngo) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-slate-700 mb-2">NGO Not Found</h2>
          <p className="text-slate-500 mb-4">The requested NGO could not be found.</p>
          <Link href="/ngos" className="btn-primary inline-block">
            Back to NGOs
          </Link>
        </div>
      </div>
    )
  }

  const activityStatus = getActivityStatus(ngo.lastActivityAt)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link href="/ngos" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6 transition-colors">
        <span>←</span> Back to NGOs
      </Link>

      {/* Header */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">{ngo.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${activityStatus.bgColor} ${activityStatus.color}`}>
                {activityStatus.status === 'active' && '🟢'}
                {activityStatus.status === 'warning' && '🟠'}
                {activityStatus.status === 'inactive' && '🔴'}
                {' '}{activityStatus.label}
              </span>
            </div>
            <p className="text-slate-600 mb-4">{ngo.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {ngo.focusAreas.split(',').map((area) => (
                <span 
                  key={area} 
                  className="px-3 py-1 bg-gradient-to-r from-teal-50 to-sky-50 text-teal-700 rounded-lg text-sm font-medium border border-teal-100"
                >
                  {area.trim()}
                </span>
              ))}
            </div>

            <p className={`text-sm ${activityStatus.color} font-medium`}>
              ⏱️ {activityStatus.description}
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex gap-4 lg:gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-sky-700">{ngo.projects.length}</div>
              <div className="text-xs text-slate-500">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{ngo.volunteerCalls.filter(v => v.status === 'open').length}</div>
              <div className="text-xs text-slate-500">Open Calls</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{ngo.impactReports.length}</div>
              <div className="text-xs text-slate-500">Reports</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{ngo._count.issues}</div>
              <div className="text-xs text-slate-500">Issues</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'projects'
                  ? 'border-sky-600 text-sky-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              🏗️ Projects ({ngo.projects.length})
            </button>
            <button
              onClick={() => setActiveTab('volunteers')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'volunteers'
                  ? 'border-sky-600 text-sky-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              🙋 Volunteer Calls ({ngo.volunteerCalls.length})
            </button>
            <button
              onClick={() => setActiveTab('impact')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'impact'
                  ? 'border-sky-600 text-sky-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              📸 Impact Reports ({ngo.impactReports.length})
            </button>
          </div>

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              {ngo.projects.length === 0 ? (
                <div className="card text-center py-8">
                  <div className="text-3xl mb-2">📋</div>
                  <p className="text-slate-500">No projects listed yet</p>
                </div>
              ) : (
                ngo.projects.map((project) => (
                  <div key={project.id} className="card">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-slate-800">{project.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        project.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                        project.status === 'completed' ? 'bg-sky-100 text-sky-700' :
                        project.status === 'paused' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-3">{project.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      {project.budget && (
                        <div>
                          <span className="text-slate-400">Budget:</span>
                          <div className="font-medium text-slate-700">{formatCurrency(project.budget)}</div>
                        </div>
                      )}
                      {project.beneficiaries && (
                        <div>
                          <span className="text-slate-400">Beneficiaries:</span>
                          <div className="font-medium text-slate-700">{project.beneficiaries.toLocaleString()}</div>
                        </div>
                      )}
                      <div>
                        <span className="text-slate-400">Started:</span>
                        <div className="font-medium text-slate-700">{formatDate(project.startDate)}</div>
                      </div>
                      {project.location && (
                        <div>
                          <span className="text-slate-400">Location:</span>
                          <div className="font-medium text-slate-700">{project.location}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Volunteers Tab */}
          {activeTab === 'volunteers' && (
            <div className="space-y-4">
              {ngo.volunteerCalls.length === 0 ? (
                <div className="card text-center py-8">
                  <div className="text-3xl mb-2">🙋</div>
                  <p className="text-slate-500">No volunteer calls at the moment</p>
                </div>
              ) : (
                ngo.volunteerCalls.map((call) => (
                  <div key={call.id} className="card">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-slate-800">{call.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        call.status === 'open' ? 'bg-emerald-100 text-emerald-700' :
                        call.status === 'filled' ? 'bg-sky-100 text-sky-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {call.status}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-3">{call.description}</p>
                    
                    {/* Progress bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-500">Volunteers registered</span>
                        <span className="font-medium text-slate-700">{call.volunteersRegistered} / {call.volunteersNeeded}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            call.volunteersRegistered >= call.volunteersNeeded ? 'bg-emerald-500' : 'bg-sky-500'
                          }`}
                          style={{ width: `${Math.min((call.volunteersRegistered / call.volunteersNeeded) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <span>📍 {call.location}</span>
                      <span>📅 {formatDate(call.startDate)}</span>
                      {call.skills && (
                        <span>🎯 {call.skills.split(',').slice(0, 2).join(', ')}</span>
                      )}
                    </div>

                    {call.status === 'open' && (
                      <button className="mt-4 btn-primary text-sm w-full md:w-auto">
                        Register as Volunteer
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Impact Reports Tab */}
          {activeTab === 'impact' && (
            <div className="space-y-4">
              {ngo.impactReports.length === 0 ? (
                <div className="card text-center py-8">
                  <div className="text-3xl mb-2">📸</div>
                  <p className="text-slate-500">No impact reports yet</p>
                </div>
              ) : (
                ngo.impactReports.map((report) => (
                  <div key={report.id} className="card">
                    <div className="flex items-start gap-4">
                      {report.photoUrl && (
                        <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                          <img 
                            src={report.photoUrl} 
                            alt={report.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-slate-800">{report.title}</h3>
                          {report.verified && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded font-medium">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 text-sm mb-3 italic">&ldquo;{report.testimony}&rdquo;</p>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                          {report.reporterName && <span>— {report.reporterName}</span>}
                          {report.location && <span>📍 {report.location}</span>}
                          <span>📅 {formatDate(report.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Add report button */}
              <div className="card bg-slate-50 border-dashed border-2 border-slate-200 text-center py-8">
                <div className="text-3xl mb-2">📝</div>
                <p className="text-slate-600 font-medium mb-2">Share Your Experience</p>
                <p className="text-slate-500 text-sm mb-4">Have you been helped by this NGO? Share your story!</p>
                <button className="btn-secondary">Submit Impact Report</button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="card">
            <h3 className="font-semibold text-slate-800 mb-4">📞 Contact Information</h3>
            <div className="space-y-3">
              {ngo.address && (
                <div className="flex items-start gap-3">
                  <span className="text-lg">📍</span>
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wide">Address</div>
                    <div className="text-sm text-slate-700">{ngo.address}</div>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <span className="text-lg">🗺️</span>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">State</div>
                  <div className="text-sm text-slate-700">{ngo.state}</div>
                </div>
              </div>
              {ngo.phone && (
                <div className="flex items-start gap-3">
                  <span className="text-lg">📱</span>
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wide">Phone</div>
                    <div className="text-sm text-slate-700">{ngo.phone}</div>
                  </div>
                </div>
              )}
              {ngo.email && (
                <div className="flex items-start gap-3">
                  <span className="text-lg">✉️</span>
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wide">Email</div>
                    <a href={`mailto:${ngo.email}`} className="text-sm text-sky-700 hover:text-sky-800">
                      {ngo.email}
                    </a>
                  </div>
                </div>
              )}
              {ngo.website && (
                <div className="flex items-start gap-3">
                  <span className="text-lg">🌐</span>
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wide">Website</div>
                    <a 
                      href={ngo.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-sky-700 hover:text-sky-800"
                    >
                      {ngo.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Map placeholder */}
          {ngo.latitude && ngo.longitude && (
            <div className="card">
              <h3 className="font-semibold text-slate-800 mb-4">🗺️ Location</h3>
              <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden relative">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${ngo.latitude},${ngo.longitude}&zoom=15`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                ></iframe>
                <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📍</div>
                    <p className="text-sm text-slate-600">{ngo.state}</p>
                    <a 
                      href={`https://www.google.com/maps?q=${ngo.latitude},${ngo.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-sky-600 hover:text-sky-700 mt-2 inline-block"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Coordinates: {ngo.latitude.toFixed(4)}, {ngo.longitude.toFixed(4)}
              </p>
            </div>
          )}

          {/* Activity Status Card */}
          <div className={`card border-2 ${
            activityStatus.status === 'active' ? 'border-emerald-200 bg-emerald-50' :
            activityStatus.status === 'warning' ? 'border-amber-200 bg-amber-50' :
            'border-red-200 bg-red-50'
          }`}>
            <h3 className="font-semibold text-slate-800 mb-2">📊 Activity Status</h3>
            <div className={`text-2xl font-bold mb-1 ${activityStatus.color}`}>
              {activityStatus.status === 'active' && '🟢 Active'}
              {activityStatus.status === 'warning' && '🟠 Needs Attention'}
              {activityStatus.status === 'inactive' && '🔴 Inactive'}
            </div>
            <p className={`text-sm ${activityStatus.color}`}>
              {activityStatus.description}
            </p>
            {activityStatus.status !== 'active' && (
              <p className="text-xs text-slate-500 mt-3">
                ⚠️ This organization has not updated their project status recently. 
                Consider reaching out to verify their current activities.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
