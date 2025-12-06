'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface NGO {
  id: string
  name: string
  state: string
  focusAreas: string
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

const priorities = [
  { value: 'low', label: 'Low', description: 'Minor issue, not urgent' },
  { value: 'medium', label: 'Medium', description: 'Moderate impact, needs attention' },
  { value: 'high', label: 'High', description: 'Significant impact, urgent' },
  { value: 'critical', label: 'Critical', description: 'Severe impact, immediate action needed' }
]

export default function CreateIssuePage() {
  const router = useRouter()
  const [ngos, setNgos] = useState<NGO[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    state: '',
    priority: 'medium',
    ngoId: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchNGOs()
  }, [])

  async function fetchNGOs() {
    try {
      const response = await fetch('/api/ngos')
      const data = await response.json()
      setNgos(data)
    } catch (error) {
      console.error('Error fetching NGOs:', error)
    }
  }

  function validate() {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 30) {
      newErrors.description = 'Description must be at least 30 characters'
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }
    
    if (!formData.state) {
      newErrors.state = 'Please select a state'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!validate()) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ngoId: formData.ngoId || null
        })
      })
      
      if (response.ok) {
        router.push('/issues')
      } else {
        throw new Error('Failed to create issue')
      }
    } catch (error) {
      console.error('Error creating issue:', error)
      setErrors({ submit: 'Failed to create issue. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  // Filter NGOs based on selected state
  const filteredNGOs = formData.state
    ? ngos.filter(ngo => ngo.state === formData.state || ngo.focusAreas.toLowerCase().includes(formData.category.toLowerCase()))
    : ngos

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Report New Issue</h1>
        <p className="text-slate-600">
          Help us identify and track community issues across Malaysia
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 text-sm font-bold">1</span>
            Basic Information
          </h2>
          
          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Issue Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Flash Flood Damage in Taman Sri Muda"
              className={`input-field ${errors.title ? 'border-red-300 focus:ring-red-500' : ''}`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide details about the issue, including location specifics, number of people affected, and any immediate needs..."
              rows={5}
              className={`input-field resize-none ${errors.description ? 'border-red-300 focus:ring-red-500' : ''}`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
            <p className="mt-1 text-xs text-slate-400">
              {formData.description.length}/30 minimum characters
            </p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 text-sm font-bold">2</span>
            Location & Category
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* State */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className={`select-field ${errors.state ? 'border-red-300 focus:ring-red-500' : ''}`}
              >
                <option value="">Select a state</option>
                {malaysianStates.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && (
                <p className="mt-1 text-sm text-red-500">{errors.state}</p>
              )}
            </div>
            
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`select-field ${errors.category ? 'border-red-300 focus:ring-red-500' : ''}`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">{errors.category}</p>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 text-sm font-bold">3</span>
            Priority & Assignment
          </h2>
          
          {/* Priority */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Priority Level
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: p.value })}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    formData.priority === p.value
                      ? 'border-sky-500 bg-sky-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className={`status-badge priority-${p.value} mb-1`}>
                    {p.label}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">{p.description}</p>
                </button>
              ))}
            </div>
          </div>
          
          {/* NGO Assignment */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Assign to NGO (Optional)
            </label>
            <select
              value={formData.ngoId}
              onChange={(e) => setFormData({ ...formData, ngoId: e.target.value })}
              className="select-field"
            >
              <option value="">No specific NGO</option>
              {filteredNGOs.map((ngo) => (
                <option key={ngo.id} value={ngo.id}>
                  {ngo.name} ({ngo.state})
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-400">
              {formData.state && `Showing NGOs in ${formData.state} and related to ${formData.category || 'all categories'}`}
            </p>
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Submitting...' : 'Submit Issue'}
          </button>
        </div>
      </form>
    </div>
  )
}

