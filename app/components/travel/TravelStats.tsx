import { Link } from '@remix-run/react'

interface TravelStatsProps {
  stats: {
    total: number
    scheduled: number
    confirmed: number
    inTransit: number
    arrived: number
    cancelled: number
  }
}

export function TravelStats({ stats }: TravelStatsProps) {
  const statCards = [
    {
      name: 'Total Travels',
      value: stats.total,
      color: 'bg-primary-500',
      href: '/travel',
    },
    {
      name: 'Scheduled',
      value: stats.scheduled,
      color: 'bg-blue-500',
      href: '/travel?status=SCHEDULED',
    },
    {
      name: 'Confirmed',
      value: stats.confirmed,
      color: 'bg-green-500',
      href: '/travel?status=CONFIRMED',
    },
    {
      name: 'In Transit',
      value: stats.inTransit,
      color: 'bg-yellow-500',
      href: '/travel?status=IN_TRANSIT',
    },
    {
      name: 'Arrived',
      value: stats.arrived,
      color: 'bg-success-500',
      href: '/travel?status=ARRIVED',
    },
    {
      name: 'Cancelled',
      value: stats.cancelled,
      color: 'bg-error-500',
      href: '/travel?status=CANCELLED',
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
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
