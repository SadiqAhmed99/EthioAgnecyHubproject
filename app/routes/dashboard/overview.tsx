import { useLoaderData, defer } from '@remix-run/react';
import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { Suspense } from 'react';
import { requireUser } from '~/middleware/authMiddleware.server';
import { employeeService } from '~/services/employee/employeeService.server';
import { documentService } from '~/services/documents/documentService.server';
import { travelService } from '~/services/travel/travelService.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  
  // Load critical data immediately
  const [employeeStats, documentStats] = await Promise.all([
    employeeService.getEmployeeStats(),
    documentService.getDocumentStats(),
  ]);

  // Defer non-critical data for better performance
  const travelStatsPromise = travelService.getTravelStats();
  const recentEmployeesPromise = employeeService.getRecentEmployees(10);
  const expiringDocumentsPromise = documentService.getExpiringDocuments(30);

  return defer({
    user,
    stats: {
      employees: employeeStats,
      documents: documentStats,
    },
    travelStats: travelStatsPromise,
    recentEmployees: recentEmployeesPromise,
    expiringDocuments: expiringDocumentsPromise,
  });
}

export default function DashboardOverview() {
  const { user, stats, travelStats, recentEmployees, expiringDocuments } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">E</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Employees
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.employees.total}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">D</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Verified Documents
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.documents.verified}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Travel Records
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    <Suspense fallback={<span className="animate-pulse">...</span>}>
                      {travelStats.then((data: any) => data.total)}
                    </Suspense>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Tasks
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    <Suspense fallback={<span className="animate-pulse">...</span>}>
                      {recentEmployees.then((data: any) => data.length)}
                    </Suspense>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Employee Status Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Employee Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active</span>
              <span className="font-medium">{stats.employees.active}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="font-medium">{stats.employees.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Inactive</span>
              <span className="font-medium">{stats.employees.inactive}</span>
            </div>
          </div>
        </div>

        {/* Document Status Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Document Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Verified</span>
              <span className="font-medium">{stats.documents.verified}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="font-medium">{stats.documents.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Rejected</span>
              <span className="font-medium">{stats.documents.rejected}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <Suspense fallback={<div className="animate-pulse">Loading recent employees...</div>}>
            <RecentEmployeesList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function RecentEmployeesList() {
  const { recentEmployees } = useLoaderData<typeof loader>();
  
  return (
    <div className="space-y-4">
      {recentEmployees.map((employee: any) => (
        <div key={employee.id} className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {employee.firstName[0]}{employee.lastName[0]}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {employee.firstName} {employee.lastName}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {employee.email}
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              employee.status === 'active' ? 'bg-green-100 text-green-800' :
              employee.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {employee.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
