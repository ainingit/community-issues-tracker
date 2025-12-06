// Activity flag logic based on last status update
// Green: Updated within 7 days
// Orange: Updated 8-30 days ago
// Red: No updates for 30+ days

export type ActivityStatus = 'active' | 'moderate' | 'inactive'

export interface ActivityInfo {
  status: ActivityStatus
  color: string
  bgColor: string
  label: string
  daysSinceUpdate: number | null
  emoji: string
}

export function getActivityStatus(lastUpdateDate: Date | null): ActivityInfo {
  if (!lastUpdateDate) {
    return {
      status: 'inactive',
      color: 'text-red-700',
      bgColor: 'bg-red-100',
      label: 'No updates',
      daysSinceUpdate: null,
      emoji: '🔴'
    }
  }

  const now = new Date()
  const diffTime = Math.abs(now.getTime() - lastUpdateDate.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays <= 7) {
    return {
      status: 'active',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-100',
      label: diffDays === 0 ? 'Updated today' : `Updated ${diffDays} day${diffDays > 1 ? 's' : ''} ago`,
      daysSinceUpdate: diffDays,
      emoji: '🟢'
    }
  }

  if (diffDays <= 30) {
    return {
      status: 'moderate',
      color: 'text-amber-700',
      bgColor: 'bg-amber-100',
      label: `Updated ${diffDays} days ago`,
      daysSinceUpdate: diffDays,
      emoji: '🟠'
    }
  }

  return {
    status: 'inactive',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    label: `No updates for ${diffDays} days`,
    daysSinceUpdate: diffDays,
    emoji: '🔴'
  }
}

export function getActivityBadgeClasses(status: ActivityStatus): string {
  switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'moderate':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'inactive':
      return 'bg-red-100 text-red-800 border-red-200'
  }
}

