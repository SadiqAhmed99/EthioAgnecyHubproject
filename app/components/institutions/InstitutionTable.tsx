import { Link } from '@remix-run/react'
import { Suspense } from 'react'

interface InstitutionTableProps {
  data: Promise<{
    institutions: Array<{
      id: string
      name: string
      type: string
      description?: string
      contactEmail?: string
      contactPhone?: string
      address?: string
      createdAt: string
    }>
    total: number
  }>
}

function getTypeColor(type: string) {
  switch (type) {
    case 'GOVERNMENT':
      return 'bg-blue-100 text-blue-800'
    case 'EMBASSY':
      return 'bg-green-100 text-green-800'
    case 'BANK':
      return 'bg-yellow-100 text-yellow-800'
    case 'MEDICAL':
      return 'bg-red-100 text-red-800'
    case 'INSURANCE':
      return 'bg-purple-100 text-purple-800'
    case 'OTHER':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'GOVERNMENT':
      return (
        <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    case 'EMBASSY':
      return (
        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
      )
    case 'BANK':
      return (
        <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    case 'MEDICAL':
      return (
        <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    default:
      return (
        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
  }
}

function InstitutionRow({ institution }: { institution: any }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="table-cell">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {getTypeIcon(institution.type)}
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {institution.name}
            </div>
            <div className="text-sm text-gray-500">
              {institution.description || 'No description'}
            </div>
          </div>
        </div>
      </td>
      <td className="table-cell">
        <span className={`badge ${getTypeColor(institution.type)}`}>
          {institution.type}
        </span>
      </td>
      <td className="table-cell">
        <div className="text-sm text-gray-900">
          {institution.contactEmail || 'N/A'}
        </div>
        <div className="text-sm text-gray-500">
          {institution.contactPhone || 'N/A'}
        </div>
      </td>
      <td className="table-cell">
        <span className="text-sm text-gray-900">
          {institution.address || 'N/A'}
        </span>
      </td>
      <td className="table-cell">
        <span className="text-sm text-gray-900">
          {new Date(institution.createdAt).toLocaleDateString()}
        </span>
      </td>
      <td className="table-cell">
        <div className="flex items-center space-x-2">
          <Link
            to={`/institutions/${institution.id}`}
            className="text-primary-600 hover:text-primary-500 text-sm font-medium"
          >
            View
          </Link>
          <Link
            to={`/institutions/${institution.id}/edit`}
            className="text-secondary-600 hover:text-secondary-500 text-sm font-medium"
          >
            Edit
          </Link>
        </div>
      </td>
    </tr>
  )
}

function InstitutionTableContent({ data }: InstitutionTableProps) {
  const { institutions, total } = data as any

  if (institutions.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No institutions found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by adding a new institution.</p>
        <div className="mt-6">
          <Link
            to="/institutions/institution-detail"
            className="btn-primary"
          >
            Add Institution
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{institutions.length}</span> of{' '}
          <span className="font-medium">{total}</span> institutions
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Institution</th>
              <th className="table-header-cell">Type</th>
              <th className="table-header-cell">Contact</th>
              <th className="table-header-cell">Address</th>
              <th className="table-header-cell">Created</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {institutions.map((institution: any) => (
              <InstitutionRow key={institution.id} institution={institution} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function InstitutionTable({ data }: InstitutionTableProps) {
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
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    }>
      <InstitutionTableContent data={data} />
    </Suspense>
  )
}
