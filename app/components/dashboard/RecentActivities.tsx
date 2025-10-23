import { Link } from '@remix-run/react'
import { Suspense } from 'react'

interface RecentActivitiesProps {
  data: Promise<Array<{
    id: string
    employeeId: string
    firstName: string
    lastName: string
    status: string
    createdAt: string
  }>>
}

function ActivityItem({ activity }: { activity: any }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REGISTERED':
        return 'bg-primary-100 text-primary-800'
      case 'DOCUMENT_PENDING':
        return 'bg-warning-100 text-warning-800'
      case 'SKILL_ASSESSED':
        return 'bg-success-100 text-success-800'
      case 'READY_FOR_DEPLOYMENT':
        return 'bg-secondary-100 text-secondary-800'
      case 'DEPLOYED':
        return 'bg-success-100 text-success-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">
              {activity.firstName[0]}{activity.lastName[0]}
            </span>
          </div>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">
            {activity.firstName} {activity.lastName}
          </p>
          <p className="text-xs text-gray-500">ID: {activity.employeeId}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`badge ${getStatusColor(activity.status)}`}>
          {activity.status.replace('_', ' ')}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(activity.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}

function ActivitiesList({ data }: RecentActivitiesProps) {
  const activities = data as any[]

  if (activities.length === 0) {
    return (
      <div className="text-center py-6">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No recent registrations</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by registering a new employee.</p>
        <div className="mt-6">
          <Link
            to="/employee-management/registration"
            className="btn-primary btn-sm"
          >
            Register Employee
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
      <div className="pt-3">
        <Link
          to="/employee-management"
          className="text-sm text-primary-600 hover:text-primary-500 font-medium"
        >
          View all employees →
        </Link>
      </div>
    </div>
  )
}

export function RecentActivities({ data }: RecentActivitiesProps) {
  return (
    <Suspense fallback={
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    }>
      <ActivitiesList data={data} />
    </Suspense>
  )
}
