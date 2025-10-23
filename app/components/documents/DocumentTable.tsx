import { Link } from '@remix-run/react'
import { Suspense } from 'react'

interface DocumentTableProps {
  data: Promise<{
    documents: Array<{
      id: string
      type: string
      name: string
      fileSize: number
      status: string
      uploadedAt: string
      verifiedAt?: string
      employee?: {
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
    case 'PENDING':
      return 'bg-warning-100 text-warning-800'
    case 'VERIFIED':
      return 'bg-success-100 text-success-800'
    case 'REJECTED':
      return 'bg-error-100 text-error-800'
    case 'EXPIRED':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'PASSPORT':
      return (
        <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    case 'NATIONAL_ID':
      return (
        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      )
    case 'MEDICAL_CERTIFICATE':
      return (
        <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    default:
      return (
        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
  }
}

function DocumentRow({ document }: { document: any }) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="table-cell">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {getTypeIcon(document.type)}
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {document.name}
            </div>
            <div className="text-sm text-gray-500">
              {document.type.replace('_', ' ')}
            </div>
          </div>
        </div>
      </td>
      <td className="table-cell">
        {document.employee ? (
          <div>
            <div className="text-sm font-medium text-gray-900">
              {document.employee.firstName} {document.employee.lastName}
            </div>
            <div className="text-sm text-gray-500">
              ID: {document.employee.employeeId}
            </div>
          </div>
        ) : (
          <span className="text-sm text-gray-500">No employee</span>
        )}
      </td>
      <td className="table-cell">
        <span className="text-sm text-gray-900">
          {formatFileSize(document.fileSize)}
        </span>
      </td>
      <td className="table-cell">
        <span className={`badge ${getStatusColor(document.status)}`}>
          {document.status}
        </span>
      </td>
      <td className="table-cell">
        <span className="text-sm text-gray-900">
          {new Date(document.uploadedAt).toLocaleDateString()}
        </span>
      </td>
      <td className="table-cell">
        <div className="flex items-center space-x-2">
          <Link
            to={`/documents/${document.id}`}
            className="text-primary-600 hover:text-primary-500 text-sm font-medium"
          >
            View
          </Link>
          <Link
            to={`/documents/${document.id}/verify`}
            className="text-secondary-600 hover:text-secondary-500 text-sm font-medium"
          >
            Verify
          </Link>
        </div>
      </td>
    </tr>
  )
}

function DocumentTableContent({ data }: DocumentTableProps) {
  const { documents, total } = data as any

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by uploading a document.</p>
        <div className="mt-6">
          <Link
            to="/documents/upload"
            className="btn-primary"
          >
            Upload Document
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{documents.length}</span> of{' '}
          <span className="font-medium">{total}</span> documents
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Document</th>
              <th className="table-header-cell">Employee</th>
              <th className="table-header-cell">Size</th>
              <th className="table-header-cell">Status</th>
              <th className="table-header-cell">Upload Date</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {documents.map((document: any) => (
              <DocumentRow key={document.id} document={document} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function DocumentTable({ data }: DocumentTableProps) {
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
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    }>
      <DocumentTableContent data={data} />
    </Suspense>
  )
}
