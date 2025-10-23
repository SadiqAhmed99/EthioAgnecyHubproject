import { json, defer } from '@remix-run/node'
import { useLoaderData, Link } from '@remix-run/react'
import { requireAuth } from '~/middleware/authMiddleware.server'
import { prisma } from '~/lib/prisma.server'
import { DashboardStats } from '~/components/dashboard/DashboardStats'
import { RecentActivities } from '~/components/dashboard/RecentActivities'
import { QuickActions } from '~/components/dashboard/QuickActions'
import { TodaysDepartures } from '~/components/dashboard/TodaysDepartures'

export async function loader({ request }: { request: Request }) {
  const user = await requireAuth(request)

  // Get critical data immediately
  const [
    totalEmployees,
    activeDeployments,
    pendingDocuments,
    urgentTasks,
  ] = await Promise.all([
    prisma.employee.count({
      where: { agencyId: user.agencyId },
    }),
    prisma.employee.count({
      where: { 
        agencyId: user.agencyId,
        status: 'DEPLOYED'
      },
    }),
    prisma.document.count({
      where: { 
        agencyId: user.agencyId,
        status: 'PENDING'
      },
    }),
    prisma.employee.count({
      where: { 
        agencyId: user.agencyId,
        status: 'DOCUMENT_PENDING'
      },
    }),
  ])

  // Defer non-critical data for streaming
  const recentRegistrations = prisma.employee.findMany({
    where: { agencyId: user.agencyId },
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      employeeId: true,
      firstName: true,
      lastName: true,
      status: true,
      createdAt: true,
    },
  })

  const todaysDepartures = prisma.travel.findMany({
    where: {
      employee: { agencyId: user.agencyId },
      departureDate: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lt: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    },
    include: {
      employee: {
        select: {
          id: true,
          employeeId: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  })

  const systemAlerts = prisma.auditLog.findMany({
    where: {
      action: { contains: 'ERROR' },
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      },
    },
    take: 5,
    orderBy: { createdAt: 'desc' },
  })

  return defer({
    user,
    stats: {
      totalEmployees,
      activeDeployments,
      pendingDocuments,
      urgentTasks,
    },
    recentRegistrations,
    todaysDepartures,
    systemAlerts,
  })
}

export default function Dashboard() {
  const { user, stats, recentRegistrations, todaysDepartures, systemAlerts } = useLoaderData<typeof loader>()

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user.firstName}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your agency today.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last login</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <DashboardStats stats={stats} />

      {/* Quick Actions */}
      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registrations */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Registrations</h2>
          </div>
          <div className="p-6">
            <RecentActivities data={recentRegistrations} />
          </div>
        </div>

        {/* Today's Departures */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Today's Departures</h2>
          </div>
          <div className="p-6">
            <TodaysDepartures data={todaysDepartures} />
          </div>
        </div>
      </div>

      {/* System Alerts */}
      {systemAlerts.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">System Alerts</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start p-3 bg-error-50 border border-error-200 rounded-md">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-error-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-error-800">{alert.action}</p>
                    <p className="text-xs text-error-600">{new Date(alert.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
