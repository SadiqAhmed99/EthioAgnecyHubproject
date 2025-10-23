import { json, defer } from '@remix-run/node'
import { useLoaderData, Link, useSearchParams } from '@remix-run/react'
import { requireAuth } from '~/middleware/authMiddleware.server'
import { HajjUmrahService } from '~/services/hajj-umrah/hajjUmrahService.server'
import { HajjUmrahTable } from '~/components/hajj-umrah/HajjUmrahTable'
import { HajjUmrahStats } from '~/components/hajj-umrah/HajjUmrahStats'

export async function loader({ request }: { request: Request }) {
  const user = await requireAuth(request)
  const url = new URL(request.url)
  const searchParams = Object.fromEntries(url.searchParams)

  // Get critical data immediately
  const stats = await HajjUmrahService.getHajjUmrahStats(user.agencyId!)

  // Defer search results for streaming
  const searchResults = HajjUmrahService.searchHajjUmrah(
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

export default function HajjUmrah() {
  const { user, stats, searchResults, searchParams } = useLoaderData<typeof loader>()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hajj & Umrah Management</h1>
          <p className="text-gray-600">Manage pilgrimage registrations and travel</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/hajj-umrah/pilgrim-detail"
            className="btn-primary"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Register Pilgrim
          </Link>
          <Link
            to="/hajj-umrah/requirements"
            className="btn-outline"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Requirements
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <HajjUmrahStats stats={stats} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          to="/hajj-umrah?type=HAJJ"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-green-100 rounded-md flex items-center justify-center">
                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Hajj Pilgrims</p>
              <p className="text-lg font-semibold text-green-600">{stats.hajj}</p>
            </div>
          </div>
        </Link>

        <Link
          to="/hajj-umrah?type=UMRAH"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Umrah Pilgrims</p>
              <p className="text-lg font-semibold text-blue-600">{stats.umrah}</p>
            </div>
          </div>
        </Link>

        <Link
          to="/hajj-umrah?status=APPROVED"
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
              <p className="text-sm font-medium text-gray-900">Approved</p>
              <p className="text-lg font-semibold text-success-600">{stats.approved}</p>
            </div>
          </div>
        </Link>

        <Link
          to="/hajj-umrah?status=DEPARTED"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-warning-100 rounded-md flex items-center justify-center">
                <svg className="h-5 w-5 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Departed</p>
              <p className="text-lg font-semibold text-warning-600">{stats.departed}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Pilgrimage Records */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Pilgrimage Records</h2>
        </div>
        <div className="p-6">
          <HajjUmrahTable data={searchResults} />
        </div>
      </div>
    </div>
  )
}
