import { Link } from '@remix-run/react'

interface EmployeeStatsProps {
  stats: {
    total: number
    registered: number
    documentPending: number
    skillAssessed: number
    readyForDeployment: number
    deployed: number
    returned: number
    suspended: number
  }
}

export function EmployeeStats({ stats }: EmployeeStatsProps) {
  const statCards = [
    {
      name: 'Total Employees',
      value: stats.total,
      color: 'bg-primary-500',
      href: '/employee-management',
    },
    {
      name: 'Registered',
      value: stats.registered,
      color: 'bg-blue-500',
      href: '/employee-management?status=REGISTERED',
    },
    {
      name: 'Document Pending',
      value: stats.documentPending,
      color: 'bg-warning-500',
      href: '/employee-management?status=DOCUMENT_PENDING',
    },
    {
      name: 'Skill Assessed',
      value: stats.skillAssessed,
      color: 'bg-purple-500',
      href: '/employee-management?status=SKILL_ASSESSED',
    },
    {
      name: 'Ready for Deployment',
      value: stats.readyForDeployment,
      color: 'bg-green-500',
      href: '/employee-management?status=READY_FOR_DEPLOYMENT',
    },
    {
      name: 'Deployed',
      value: stats.deployed,
      color: 'bg-success-500',
      href: '/employee-management?status=DEPLOYED',
    },
    {
      name: 'Returned',
      value: stats.returned,
      color: 'bg-orange-500',
      href: '/employee-management?status=RETURNED',
    },
    {
      name: 'Suspended',
      value: stats.suspended,
      color: 'bg-error-500',
      href: '/employee-management?status=SUSPENDED',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {statCards.map((stat) => (
        <Link
          key={stat.name}
          to={stat.href}
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
        >
          <div className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`${stat.color} p-2 rounded-md`}>
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 w-0 flex-1">
                <dl>
                  <dt className="text-xs font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stat.value.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
