import { Form, Link } from '@remix-run/react'
import { useState } from 'react'

interface DocumentFiltersProps {
  searchParams: Record<string, string>
}

export function DocumentFilters({ searchParams }: DocumentFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            {isExpanded ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-6">
          <Form method="get" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Document Type Filter */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Document Type
                </label>
                <select
                  name="type"
                  id="type"
                  defaultValue={searchParams.type || ''}
                  className="mt-1 form-select"
                >
                  <option value="">All Types</option>
                  <option value="NATIONAL_ID">National ID</option>
                  <option value="PASSPORT">Passport</option>
                  <option value="BIRTH_CERTIFICATE">Birth Certificate</option>
                  <option value="MEDICAL_CERTIFICATE">Medical Certificate</option>
                  <option value="EDUCATIONAL_CERTIFICATE">Educational Certificate</option>
                  <option value="SKILL_CERTIFICATE">Skill Certificate</option>
                  <option value="POLICE_CLEARANCE">Police Clearance</option>
                  <option value="EMPLOYMENT_CONTRACT">Employment Contract</option>
                  <option value="VISA">Visa</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  defaultValue={searchParams.status || ''}
                  className="mt-1 form-select"
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="EXPIRED">Expired</option>
                </select>
              </div>

              {/* Employee Filter */}
              <div>
                <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                  Employee
                </label>
                <input
                  type="text"
                  name="employeeId"
                  id="employeeId"
                  defaultValue={searchParams.employeeId || ''}
                  placeholder="Employee ID or name"
                  className="mt-1 form-input"
                />
              </div>

              {/* Date Range */}
              <div>
                <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700">
                  Upload Date From
                </label>
                <input
                  type="date"
                  name="dateFrom"
                  id="dateFrom"
                  defaultValue={searchParams.dateFrom || ''}
                  className="mt-1 form-input"
                />
              </div>
            </div>

            {/* Date Range To */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700">
                  Upload Date To
                </label>
                <input
                  type="date"
                  name="dateTo"
                  id="dateTo"
                  defaultValue={searchParams.dateTo || ''}
                  className="mt-1 form-input"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                type="submit"
                className="btn-primary"
              >
                Apply Filters
              </button>
              <Link
                to="/documents"
                className="btn-outline"
              >
                Clear Filters
              </Link>
            </div>
          </Form>
        </div>
      )}
    </div>
  )
}
