import { Form, Link } from '@remix-run/react'
import { useState } from 'react'

interface EmployeeFiltersProps {
  searchParams: Record<string, string>
}

export function EmployeeFilters({ searchParams }: EmployeeFiltersProps) {
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
              {/* Search Query */}
              <div>
                <label htmlFor="query" className="block text-sm font-medium text-gray-700">
                  Search
                </label>
                <input
                  type="text"
                  name="query"
                  id="query"
                  defaultValue={searchParams.query || ''}
                  placeholder="Name, ID, phone..."
                  className="mt-1 form-input"
                />
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
                  <option value="REGISTERED">Registered</option>
                  <option value="DOCUMENT_PENDING">Document Pending</option>
                  <option value="SKILL_ASSESSED">Skill Assessed</option>
                  <option value="READY_FOR_DEPLOYMENT">Ready for Deployment</option>
                  <option value="DEPLOYED">Deployed</option>
                  <option value="RETURNED">Returned</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>

              {/* Gender Filter */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  name="gender"
                  id="gender"
                  defaultValue={searchParams.gender || ''}
                  className="mt-1 form-select"
                >
                  <option value="">All Genders</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Skill Category Filter */}
              <div>
                <label htmlFor="skillCategory" className="block text-sm font-medium text-gray-700">
                  Skill Category
                </label>
                <select
                  name="skillCategory"
                  id="skillCategory"
                  defaultValue={searchParams.skillCategory || ''}
                  className="mt-1 form-select"
                >
                  <option value="">All Categories</option>
                  <option value="DOMESTIC_WORK">Domestic Work</option>
                  <option value="CONSTRUCTION">Construction</option>
                  <option value="HEALTHCARE">Healthcare</option>
                  <option value="EDUCATION">Education</option>
                  <option value="TECHNICAL">Technical</option>
                  <option value="PROFESSIONAL">Professional</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700">
                  Registration Date From
                </label>
                <input
                  type="date"
                  name="dateFrom"
                  id="dateFrom"
                  defaultValue={searchParams.dateFrom || ''}
                  className="mt-1 form-input"
                />
              </div>
              <div>
                <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700">
                  Registration Date To
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
                to="/employee-management"
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
