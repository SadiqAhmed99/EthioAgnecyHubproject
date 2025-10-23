import { json, defer } from '@remix-run/node'
import { useLoaderData, Link, useSearchParams } from '@remix-run/react'
import { requireAuth } from '~/middleware/authMiddleware.server'
import { TravelService } from '~/services/travel/travelService.server'
import { TravelTable } from '~/components/travel/TravelTable'
import { TravelStats } from '~/components/travel/TravelStats'
import { TodaysDepartures } from '~/components/travel/TodaysDepartures'

export async function loader({ request }: { request: Request }) {
  const user = await requireAuth(request)
  const url = new URL(request.url)
  const searchParams = Object.fromEntries(url.searchParams)

  // Get critical data immediately
  const stats = await TravelService.getTravelStats(user.agencyId!)

  // Defer search results and today's departures for streaming
  const searchResults = TravelService.searchTravels(
    {
      ...searchParams,
      page: parseInt(searchParams.page || '1'),
      limit: parseInt(searchParams.limit || '20'),
    },
    user.agencyId!
  )

  const todaysDepartures = TravelService.getTodaysDepartures(user.agencyId!)

  return defer({
    user,
    stats,
    searchResults,
    todaysDepartures,
    searchParams,
  })
}

export default function Travel() {
  const { user, stats, searchResults, todaysDepartures, searchParams } = useLoaderData<typeof loader>()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Travel Management</h1>
          <p className="text-gray-600">Manage employee travel and departures</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/travel/schedule"
            className="btn-primary"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Schedule Travel
          </Link>
          <Link
            to="/travel/ticket"
            className="btn-outline"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Book Tickets
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <TravelStats stats={stats} />

      {/* Today's Departures */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Today's Departures</h2>
          <p className="text-sm text-gray-500">Employees departing today</p>
        </div>
        <div className="p-6">
          <TodaysDepartures data={todaysDepartures} />
        </div>
      </div>

      {/* Travel Records */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Travel Records</h2>
        </div>
        <div className="p-6">
          <TravelTable data={searchResults} />
        </div>
      </div>
    </div>
  )
}
