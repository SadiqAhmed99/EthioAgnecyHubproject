import { Outlet, useLoaderData } from '@remix-run/react';
import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { DashboardStats } from '~/components/dashboard/DashboardStats';
import { QuickActions } from '~/components/dashboard/QuickActions';
import { RecentActivities } from '~/components/dashboard/RecentActivities';
import { TodaysDepartures } from '~/components/dashboard/TodaysDepartures';
import { requireUser } from '~/middleware/authMiddleware.server';
import { employeeService } from '~/services/employee/employeeService.server';
import { documentService } from '~/services/documents/documentService.server';
import { travelService } from '~/services/travel/travelService.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  
  // Load dashboard data in parallel
  const [employeeStats, documentStats, travelStats, recentEmployees] = await Promise.all([
    employeeService.getEmployeeStats(),
    documentService.getDocumentStats(),
    travelService.getTravelStats(),
    employeeService.getRecentEmployees(5),
  ]);

  return json({
    user,
    stats: {
      employees: employeeStats,
      documents: documentStats,
      travel: travelStats,
    },
    recentEmployees,
  });
}

export default function DashboardLayout() {
  const { user, stats, recentEmployees } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user.firstName}! Here's what's happening today.
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActions userRole={user.role} />
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <RecentActivities employees={recentEmployees} />
        </div>
      </div>

      {/* Today's Departures */}
      <TodaysDepartures />

      {/* Nested Routes */}
      <Outlet />
    </div>
  );
}
