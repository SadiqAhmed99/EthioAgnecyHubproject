import { Link } from '@remix-run/react'
import { Suspense } from 'react'

interface TravelTableProps {
  data: Promise<{
    travels: Array<{
      id: string
      flightNumber?: string
      departureDate?: string
      arrivalDate?: string
      departureAirport?: string
      arrivalAirport?: string
      status: string
      createdAt: string
      employee: {
        id: string
        firstName: string
        lastName: string
        employeeId: string
      }
    }>
    total: number
  }>
}

function getStatusColor(status: string) {
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

function TravelRow({ travel }: { travel: any }) {
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'TBD'
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="table-cell">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {travel.employee.firstName} {travel.employee.lastName}
            </div>
            <div className="text-sm text-gray-500">ID: {travel.employee.employeeId}</div>
          </div>
        </div>
      </td>
      <td className="table-cell">
        <span className="text-sm text-gray-900">
          {travel.flightNumber || 'TBD'}
        </span>
      </td>
      <td className="table-cell">
        <span className="text-sm text-gray-900">
          {formatDateTime(travel.departureDate)}
        </span>
      </td>
      <td className="table-cell">
        <span className="text-sm text-gray-900">
          {formatDateTime(travel.arrivalDate)}
        </span>
      </td>
      <td className="table-cell">
        <div className="text-sm text-gray-900">
          <div>{travel.departureAirport || 'TBD'}</div>
          <div className="text-gray-500">→ {travel.arrivalAirport || 'TBD'}</div>
        </div>
      </td>
      <td className="table-cell">
        <span className={`badge ${getStatusColor(travel.status)}`}>
          {travel.status.replace('_', ' ')}
        </span>
      </td>
      <td className="table-cell">
        <div className="flex items-center space-x-2">
          <Link
            to={`/travel/${travel.id}`}
            className="text-primary-600 hover:text-primary-500 text-sm font-medium"
          >
            View
          </Link>
          <Link
            to={`/travel/${travel.id}/edit`}
            className="text-secondary-600 hover:text-secondary-500 text-sm font-medium"
          >
            Edit
          </Link>
        </div>
      </td>
    </tr>
  )
}

function TravelTableContent({ data }: TravelTableProps) {
  const { travels, total } = data as any

  if (travels.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No travel records found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by scheduling travel for an employee.</p>
        <div className="mt-6">
          <Link
            to="/travel/schedule"
            className="btn-primary"
          >
            Schedule Travel
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{travels.length}</span> of{' '}
          <span className="font-medium">{total}</span> travel records
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Employee</th>
              <th className="table-header-cell">Flight</th>
              <th className="table-header-cell">Departure</th>
              <th className="table-header-cell">Arrival</th>
              <th className="table-header-cell">Route</th>
              <th className="table-header-cell">Status</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {travels.map((travel: any) => (
              <TravelRow key={travel.id} travel={travel} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function TravelTable({ data }: TravelTableProps) {
  return (
    <Suspense fallback={
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/6"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    }>
      <TravelTableContent data={data} />
    </Suspense>
  )
}
