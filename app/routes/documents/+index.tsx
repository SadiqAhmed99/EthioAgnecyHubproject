import { json, defer } from '@remix-run/node'
import { useLoaderData, Link, useSearchParams } from '@remix-run/react'
import { requireAuth } from '~/middleware/authMiddleware.server'
import { DocumentService } from '~/services/documents/documentService.server'
import { DocumentTable } from '~/components/documents/DocumentTable'
import { DocumentFilters } from '~/components/documents/DocumentFilters'
import { DocumentStats } from '~/components/documents/DocumentStats'

export async function loader({ request }: { request: Request }) {
  const user = await requireAuth(request)
  const url = new URL(request.url)
  const searchParams = Object.fromEntries(url.searchParams)

  // Get critical data immediately
  const stats = await DocumentService.getDocumentStats(user.agencyId!)

  // Defer search results for streaming
  const searchResults = DocumentService.searchDocuments(
    {
      ...searchParams,
      page: parseInt(searchParams.page || '1'),
      limit: parseInt(searchParams.limit || '20'),
    },
    user.agencyId!
  )

  return defer({
    user,
    stats,
    searchResults,
    searchParams,
  })
}

export default function Documents() {
  const { user, stats, searchResults, searchParams } = useLoaderData<typeof loader>()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
          <p className="text-gray-600">Manage employee documents and verification</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/documents/upload"
            className="btn-primary"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Document
          </Link>
          <Link
            to="/documents/visa"
            className="btn-outline"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Visa Processing
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <DocumentStats stats={stats} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          to="/documents?status=PENDING"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-warning-100 rounded-md flex items-center justify-center">
                <svg className="h-5 w-5 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Pending Verification</p>
              <p className="text-lg font-semibold text-warning-600">{stats.pending}</p>
            </div>
          </div>
        </Link>

        <Link
          to="/documents?status=VERIFIED"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-success-100 rounded-md flex items-center justify-center">
                <svg className="h-5 w-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Verified</p>
              <p className="text-lg font-semibold text-success-600">{stats.verified}</p>
            </div>
          </div>
        </Link>

        <Link
          to="/documents?status=REJECTED"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-error-100 rounded-md flex items-center justify-center">
                <svg className="h-5 w-5 text-error-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Rejected</p>
              <p className="text-lg font-semibold text-error-600">{stats.rejected}</p>
            </div>
          </div>
        </Link>

        <Link
          to="/documents?status=EXPIRED"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-gray-100 rounded-md flex items-center justify-center">
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Expired</p>
              <p className="text-lg font-semibold text-gray-600">{stats.expired}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Filters */}
      <DocumentFilters searchParams={searchParams} />

      {/* Document Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Documents</h2>
        </div>
        <div className="p-6">
          <DocumentTable data={searchResults} />
        </div>
      </div>
    </div>
  )
}
