import { Link } from '@remix-run/react'

interface AgentStatsProps {
  stats: {
    total: number
    active: number
    inactive: number
    training: number
    suspended: number
    averagePerformance: number
  }
}

export function AgentStats({ stats }: AgentStatsProps) {
  const statCards = [
    {
      name: 'Total Agents',
      value: stats.total,
      color: 'bg-primary-500',
      href: '/agents',
    },
    {
      name: 'Active',
      value: stats.active,
      color: 'bg-green-500',
      href: '/agents?status=ACTIVE',
    },
    {
      name: 'Inactive',
      value: stats.inactive,
      color: 'bg-gray-500',
      href: '/agents?status=INACTIVE',
    },
    {
      name: 'Training',
      value: stats.training,
      color: 'bg-blue-500',
      href: '/agents?status=TRAINING',
    },
    {
      name: 'Suspended',
      value: stats.suspended,
      color: 'bg-red-500',
      href: '/agents?status=SUSPENDED',
    },
    {
      name: 'Avg Performance',
      value: `${stats.averagePerformance}%`,
      color: 'bg-yellow-500',
      href: '/agents/performance',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 w-0 flex-1">
                <dl>
                  <dt className="text-xs font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stat.value}
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
