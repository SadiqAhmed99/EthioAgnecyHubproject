import { Link } from '@remix-run/react'
import { Suspense } from 'react'

interface EmployeeTableProps {
  data: Promise<{
    employees: Array<{
      id: string
      employeeId: string
      firstName: string
      lastName: string
      gender: string
      phone: string
      status: string
      registrationDate: string
      createdAt: string
    }>
    total: number
  }>
}

function getStatusColor(status: string) {
  switch (status) {
    case 'REGISTERED':
      return 'bg-primary-100 text-primary-800'
    case 'DOCUMENT_PENDING':
      return 'bg-warning-100 text-warning-800'
    case 'SKILL_ASSESSED':
      return 'bg-success-100 text-success-800'
    case 'READY_FOR_DEPLOYMENT':
      return 'bg-secondary-100 text-secondary-800'
    case 'DEPLOYED':
      return 'bg-success-100 text-success-800'
    case 'RETURNED':
      return 'bg-orange-100 text-orange-800'
    case 'SUSPENDED':
      return 'bg-error-100 text-error-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function EmployeeRow({ employee }: { employee: any }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="table-cell">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {employee.firstName[0]}{employee.lastName[0]}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {employee.firstName} {employee.lastName}
            </div>
            <div className="text-sm text-gray-500">ID: {employee.employeeId}</div>
          </div>
        </div>
      </td>
      <td className="table-cell">
        <span className="text-sm text-gray-900 capitalize">
          {employee.gender.toLowerCase()}
        </span>
      </td>
      <td className="table-cell">
        <span className="text-sm text-gray-900">{employee.phone}</span>
      </td>
      <td className="table-cell">
        <span className={`badge ${getStatusColor(employee.status)}`}>
          {employee.status.replace('_', ' ')}
        </span>
      </td>
      <td className="table-cell">
        <span className="text-sm text-gray-900">
          {new Date(employee.registrationDate).toLocaleDateString()}
        </span>
      </td>
      <td className="table-cell">
        <div className="flex items-center space-x-2">
          <Link
            to={`/employee-management/${employee.id}`}
            className="text-primary-600 hover:text-primary-500 text-sm font-medium"
          >
            View
          </Link>
          <Link
            to={`/employee-management/${employee.id}/edit`}
            className="text-secondary-600 hover:text-secondary-500 text-sm font-medium"
          >
            Edit
          </Link>
        </div>
      </td>
    </tr>
  )
}

function EmployeeTableContent({ data }: EmployeeTableProps) {
  const { employees, total } = data as any

  if (employees.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by registering a new employee.</p>
        <div className="mt-6">
          <Link
            to="/employee-management/registration"
            className="btn-primary"
          >
            Register Employee
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{employees.length}</span> of{' '}
          <span className="font-medium">{total}</span> employees
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Employee</th>
              <th className="table-header-cell">Gender</th>
              <th className="table-header-cell">Phone</th>
              <th className="table-header-cell">Status</th>
              <th className="table-header-cell">Registration Date</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {employees.map((employee: any) => (
              <EmployeeRow key={employee.id} employee={employee} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function EmployeeTable({ data }: EmployeeTableProps) {
  return (
    <Suspense fallback={
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/6"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    }>
      <EmployeeTableContent data={data} />
    </Suspense>
  )
}
