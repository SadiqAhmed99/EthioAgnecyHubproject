import { json, defer } from '@remix-run/node'
import { useLoaderData, Link, useSearchParams } from '@remix-run/react'
import { requireAuth } from '~/middleware/authMiddleware.server'
import { prisma } from '~/lib/prisma.server'

export async function loader({ request }: { request: Request }) {
  const user = await requireAuth(request)
  const url = new URL(request.url)
  const searchParams = Object.fromEntries(url.searchParams)

  // Get critical data immediately
  const [
    totalEmployees,
    totalDocuments,
    totalTravels,
    totalHajjUmrah,
    recentRegistrations,
    monthlyStats,
  ] = await Promise.all([
    prisma.employee.count({ where: { agencyId: user.agencyId } }),
    prisma.document.count({ where: { agencyId: user.agencyId } }),
    prisma.travel.count({ where: { employee: { agencyId: user.agencyId } } }),
    prisma.hajjUmrah.count({ where: { employee: { agencyId: user.agencyId } } }),
    prisma.employee.findMany({
      where: { agencyId: user.agencyId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, firstName: true, lastName: true, createdAt: true },
    }),
    // This would be calculated from actual data
    {
      registrations: 45,
      deployments: 23,
      documents: 67,
      approvals: 34,
    },
  ])

  const stats = {
    totalEmployees,
    totalDocuments,
    totalTravels,
    totalHajjUmrah,
    recentRegistrations,
    monthlyStats,
  }

  return defer({
    user,
    stats,
    searchParams,
  })
}

export default function ReportingAnalytics() {
  const { user, stats, searchParams } = useLoaderData<typeof loader>()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reporting & Analytics</h1>
          <p className="text-gray-600">Comprehensive reports and data insights</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/reporting-analytics/overview"
            className="btn-primary"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics Overview
          </Link>
          <Link
            to="/reporting-analytics/export"
            className="btn-outline"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Data
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Employees</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalEmployees}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Documents</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalDocuments}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Travels</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalTravels}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Hajj & Umrah</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalHajjUmrah}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Statistics */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">This Month's Statistics</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.monthlyStats.registrations}</div>
              <div className="text-sm text-gray-500">New Registrations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.monthlyStats.deployments}</div>
              <div className="text-sm text-gray-500">Deployments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.monthlyStats.documents}</div>
              <div className="text-sm text-gray-500">Documents Processed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.monthlyStats.approvals}</div>
              <div className="text-sm text-gray-500">Approvals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Employee Reports */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Employee Reports</h2>
            <p className="text-sm text-gray-500">Employee-related analytics</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <Link
                to="/reporting-analytics/employee-reports"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
              >
                <svg className="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Employee Analytics</h3>
                  <p className="text-xs text-gray-500">Registration trends and demographics</p>
                </div>
              </Link>
              
              <Link
                to="/reporting-analytics/skill-analysis"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
              >
                <svg className="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Skill Analysis</h3>
                  <p className="text-xs text-gray-500">Skills distribution and trends</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Document Reports */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Document Reports</h2>
            <p className="text-sm text-gray-500">Document processing analytics</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <Link
                to="/reporting-analytics/document-reports"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
              >
                <svg className="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Document Processing</h3>
                  <p className="text-xs text-gray-500">Verification rates and timelines</p>
                </div>
              </Link>
              
              <Link
                to="/reporting-analytics/visa-tracking"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
              >
                <svg className="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Visa Tracking</h3>
                  <p className="text-xs text-gray-500">Visa processing statistics</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Financial Reports */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Financial Reports</h2>
            <p className="text-sm text-gray-500">Financial analytics and insights</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <Link
                to="/reporting-analytics/financial-reports"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
              >
                <svg className="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Revenue Analytics</h3>
                  <p className="text-xs text-gray-500">Income and expense tracking</p>
                </div>
              </Link>
              
              <Link
                to="/reporting-analytics/commission-tracking"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
              >
                <svg className="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Commission Tracking</h3>
                  <p className="text-xs text-gray-500">Agent commission reports</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
