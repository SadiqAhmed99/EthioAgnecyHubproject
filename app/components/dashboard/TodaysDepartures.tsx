import { Link } from '@remix-run/react'
import { Suspense } from 'react'

interface TodaysDeparturesProps {
  data: Promise<Array<{
    id: string
    flightNumber?: string
    departureDate?: string
    departureAirport?: string
    arrivalAirport?: string
    status: string
    employee: {
      id: string
      employeeId: string
      firstName: string
      lastName: string
    }
  }>>
}

function DepartureItem({ departure }: { departure: any }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-primary-100 text-primary-800'
      case 'CONFIRMED':
        return 'bg-success-100 text-success-800'
      case 'IN_TRANSIT':
        return 'bg-warning-100 text-warning-800'
      case 'ARRIVED':
        return 'bg-success-100 text-success-800'
      case 'CANCELLED':
        return 'bg-error-100 text-error-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'TBD'
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">
            {departure.employee.firstName} {departure.employee.lastName}
          </p>
          <p className="text-xs text-gray-500">
            {departure.flightNumber ? `Flight ${departure.flightNumber}` : 'No flight number'}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {formatTime(departure.departureDate)}
          </p>
          <p className="text-xs text-gray-500">
            {departure.departureAirport || 'TBD'} → {departure.arrivalAirport || 'TBD'}
          </p>
        </div>
        <span className={`badge ${getStatusColor(departure.status)}`}>
          {departure.status.replace('_', ' ')}
        </span>
      </div>
    </div>
  )
}

function DeparturesList({ data }: TodaysDeparturesProps) {
  const departures = data as any[]

  if (departures.length === 0) {
    return (
      <div className="text-center py-6">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No departures today</h3>
        <p className="mt-1 text-sm text-gray-500">No employees are scheduled to depart today.</p>
        <div className="mt-6">
          <Link
            to="/travel/schedule"
            className="btn-primary btn-sm"
          >
            Schedule Travel
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {departures.map((departure) => (
        <DepartureItem key={departure.id} departure={departure} />
      ))}
      <div className="pt-3">
        <Link
          to="/travel"
          className="text-sm text-primary-600 hover:text-primary-500 font-medium"
        >
          View all travel →
        </Link>
      </div>
    </div>
  )
}

export function TodaysDepartures({ data }: TodaysDeparturesProps) {
  return (
    <Suspense fallback={
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="space-y-1">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    }>
      <DeparturesList data={data} />
    </Suspense>
  )
}
