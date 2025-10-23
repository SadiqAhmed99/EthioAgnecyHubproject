import { json, defer } from '@remix-run/node'
import { useLoaderData, Link, useSearchParams } from '@remix-run/react'
import { requireAuth } from '~/middleware/authMiddleware.server'
import { AgentService } from '~/services/agents/agentService.server'
import { AgentTable } from '~/components/agents/AgentTable'
import { AgentStats } from '~/components/agents/AgentStats'

export async function loader({ request }: { request: Request }) {
  const user = await requireAuth(request)
  const url = new URL(request.url)
  const searchParams = Object.fromEntries(url.searchParams)

  // Get critical data immediately
  const stats = await AgentService.getAgentStats(user.agencyId!)

  // Defer search results for streaming
  const searchResults = AgentService.searchAgents(
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

export default function Agents() {
  const { user, stats, searchResults, searchParams } = useLoaderData<typeof loader>()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agent Management</h1>
          <p className="text-gray-600">Manage agents and track performance</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/agents/agent-detail"
            className="btn-primary"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Agent
          </Link>
          <Link
            to="/agents/onboarding"
            className="btn-outline"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Onboarding
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <AgentStats stats={stats} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          to="/agents?status=ACTIVE"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-green-100 rounded-md flex items-center justify-center">
                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Active Agents</p>
              <p className="text-lg font-semibold text-green-600">{stats.active}</p>
            </div>
          </div>
        </Link>

        <Link
          to="/agents?status=TRAINING"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">In Training</p>
              <p className="text-lg font-semibold text-blue-600">{stats.training}</p>
            </div>
          </div>
        </Link>

        <Link
          to="/agents/performance"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-yellow-100 rounded-md flex items-center justify-center">
                <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Avg Performance</p>
              <p className="text-lg font-semibold text-yellow-600">{stats.averagePerformance}%</p>
            </div>
          </div>
        </Link>

        <Link
          to="/agents?status=SUSPENDED"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-red-100 rounded-md flex items-center justify-center">
                <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Suspended</p>
              <p className="text-lg font-semibold text-red-600">{stats.suspended}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Agent Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Agents</h2>
        </div>
        <div className="p-6">
          <AgentTable data={searchResults} />
        </div>
      </div>
    </div>
  )
}
