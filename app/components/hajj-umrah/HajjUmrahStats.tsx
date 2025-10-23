import { Link } from '@remix-run/react'

interface HajjUmrahStatsProps {
  stats: {
    total: number
    hajj: number
    umrah: number
    registered: number
    documentPending: number
    approved: number
    departed: number
    returned: number
    cancelled: number
  }
}

export function HajjUmrahStats({ stats }: HajjUmrahStatsProps) {
  const statCards = [
    {
      name: 'Total Pilgrims',
      value: stats.total,
      color: 'bg-primary-500',
      href: '/hajj-umrah',
    },
    {
      name: 'Hajj',
      value: stats.hajj,
      color: 'bg-green-500',
      href: '/hajj-umrah?type=HAJJ',
    },
    {
      name: 'Umrah',
      value: stats.umrah,
      color: 'bg-blue-500',
      href: '/hajj-umrah?type=UMRAH',
    },
    {
      name: 'Registered',
      value: stats.registered,
      color: 'bg-purple-500',
      href: '/hajj-umrah?status=REGISTERED',
    },
    {
      name: 'Document Pending',
      value: stats.documentPending,
      color: 'bg-warning-500',
      href: '/hajj-umrah?status=DOCUMENT_PENDING',
    },
    {
      name: 'Approved',
      value: stats.approved,
      color: 'bg-success-500',
      href: '/hajj-umrah?status=APPROVED',
    },
    {
      name: 'Departed',
      value: stats.departed,
      color: 'bg-orange-500',
      href: '/hajj-umrah?status=DEPARTED',
    },
    {
      name: 'Returned',
      value: stats.returned,
      color: 'bg-indigo-500',
      href: '/hajj-umrah?status=RETURNED',
    },
    {
      name: 'Cancelled',
      value: stats.cancelled,
      color: 'bg-error-500',
      href: '/hajj-umrah?status=CANCELLED',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-4">
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
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
