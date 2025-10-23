import { Link } from '@remix-run/react'

interface InstitutionStatsProps {
  stats: {
    total: number
    government: number
    embassy: number
    bank: number
    medical: number
    insurance: number
    other: number
  }
}

export function InstitutionStats({ stats }: InstitutionStatsProps) {
  const statCards = [
    {
      name: 'Total Institutions',
      value: stats.total,
      color: 'bg-primary-500',
      href: '/institutions',
    },
    {
      name: 'Government',
      value: stats.government,
      color: 'bg-blue-500',
      href: '/institutions?type=GOVERNMENT',
    },
    {
      name: 'Embassies',
      value: stats.embassy,
      color: 'bg-green-500',
      href: '/institutions?type=EMBASSY',
    },
    {
      name: 'Banks',
      value: stats.bank,
      color: 'bg-yellow-500',
      href: '/institutions?type=BANK',
    },
    {
      name: 'Medical',
      value: stats.medical,
      color: 'bg-red-500',
      href: '/institutions?type=MEDICAL',
    },
    {
      name: 'Insurance',
      value: stats.insurance,
      color: 'bg-purple-500',
      href: '/institutions?type=INSURANCE',
    },
    {
      name: 'Other',
      value: stats.other,
      color: 'bg-gray-500',
      href: '/institutions?type=OTHER',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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
