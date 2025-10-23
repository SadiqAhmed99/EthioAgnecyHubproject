import { Link } from '@remix-run/react'
import { Suspense } from 'react'

interface HajjUmrahTableProps {
  data: Promise<{
    hajjUmrah: Array<{
      id: string
      type: string
      year: number
      groupNumber?: string
      status: string
      registrationDate: string
      departureDate?: string
      returnDate?: string
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
    case 'REGISTERED':
      return 'bg-primary-100 text-primary-800'
    case 'DOCUMENT_PENDING':
      return 'bg-warning-100 text-warning-800'
    case 'APPROVED':
      return 'bg-success-100 text-success-800'
    case 'DEPARTED':
      return 'bg-orange-100 text-orange-800'
    case 'RETURNED':
      return 'bg-indigo-100 text-indigo-800'
    case 'CANCELLED':
      return 'bg-error-100 text-error-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getTypeIcon(type: string) {
  if (type === 'HAJJ') {
    return (
      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    )
  } else {
    return (
      <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    )
  }
}

function HajjUmrahRow({ hajjUmrah }: { hajjUmrah: any }) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBD'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="table-cell">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {getTypeIcon(hajjUmrah.type)}
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {hajjUmrah.employee.firstName} {hajjUmrah.employee.lastName}
            </div>
            <div className="text-sm text-gray-500">ID: {hajjUmrah.employee.employeeId}</div>
          </div>
        </div>
      </td>
      <td className="table-cell">
        <span className="text-sm text-gray-900">
          {hajjUmrah.type}
        </span>
      </td>
      <td className="table-cell">
        <span className="text-sm text-gray-900">
          {hajjUmrah.year}
        </span>
      </td>
      <td className="table-cell">
        <span className="text-sm text-gray-900">
          {hajjUmrah.groupNumber || 'N/A'}
        </span>
      </td>
      <td className="table-cell">
        <span className="text-sm text-gray-900">
          {formatDate(hajjUmrah.departureDate)}
        </span>
      </td>
      <td className="table-cell">
        <span className="text-sm text-gray-900">
          {formatDate(hajjUmrah.returnDate)}
        </span>
      </td>
      <td className="table-cell">
        <span className={`badge ${getStatusColor(hajjUmrah.status)}`}>
          {hajjUmrah.status.replace('_', ' ')}
        </span>
      </td>
      <td className="table-cell">
        <div className="flex items-center space-x-2">
          <Link
            to={`/hajj-umrah/${hajjUmrah.id}`}
            className="text-primary-600 hover:text-primary-500 text-sm font-medium"
          >
            View
          </Link>
          <Link
            to={`/hajj-umrah/${hajjUmrah.id}/edit`}
            className="text-secondary-600 hover:text-secondary-500 text-sm font-medium"
          >
            Edit
          </Link>
        </div>
      </td>
    </tr>
  )
}

function HajjUmrahTableContent({ data }: HajjUmrahTableProps) {
  const { hajjUmrah, total } = data as any

  if (hajjUmrah.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No pilgrimage records found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by registering a pilgrim.</p>
        <div className="mt-6">
          <Link
            to="/hajj-umrah/pilgrim-detail"
            className="btn-primary"
          >
            Register Pilgrim
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{hajjUmrah.length}</span> of{' '}
          <span className="font-medium">{total}</span> pilgrimage records
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Pilgrim</th>
              <th className="table-header-cell">Type</th>
              <th className="table-header-cell">Year</th>
              <th className="table-header-cell">Group</th>
              <th className="table-header-cell">Departure</th>
              <th className="table-header-cell">Return</th>
              <th className="table-header-cell">Status</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {hajjUmrah.map((hajjUmrah: any) => (
              <HajjUmrahRow key={hajjUmrah.id} hajjUmrah={hajjUmrah} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function HajjUmrahTable({ data }: HajjUmrahTableProps) {
  return (
    <Suspense fallback={
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/6"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    }>
      <HajjUmrahTableContent data={data} />
    </Suspense>
  )
}
