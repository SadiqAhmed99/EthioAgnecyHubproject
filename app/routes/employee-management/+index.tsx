import { json, defer } from '@remix-run/node'
import { useLoaderData, Link, useSearchParams } from '@remix-run/react'
import { requireAuth } from '~/middleware/authMiddleware.server'
import { EmployeeService } from '~/services/employee/employeeService.server'
import { EmployeeTable } from '~/components/employee/EmployeeTable'
import { EmployeeFilters } from '~/components/employee/EmployeeFilters'
import { EmployeeStats } from '~/components/employee/EmployeeStats'

export async function loader({ request }: { request: Request }) {
  const user = await requireAuth(request)
  const url = new URL(request.url)
  const searchParams = Object.fromEntries(url.searchParams)

  // Get critical data immediately
  const stats = await EmployeeService.getEmployeeStats(user.agencyId!)

  // Defer search results for streaming
  const searchResults = EmployeeService.searchEmployees(
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

export default function EmployeeManagement() {
  const { user, stats, searchResults, searchParams } = useLoaderData<typeof loader>()
  const [urlSearchParams] = useSearchParams()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600">Manage employee registrations and profiles</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/employee-management/registration"
            className="btn-primary"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Register Employee
          </Link>
          <Link
            to="/employee-management/cv-upload"
            className="btn-outline"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload CV
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <EmployeeStats stats={stats} />

      {/* Filters */}
      <EmployeeFilters searchParams={searchParams} />

      {/* Employee Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Employees</h2>
        </div>
        <div className="p-6">
          <EmployeeTable data={searchResults} />
        </div>
      </div>
    </div>
  )
}
