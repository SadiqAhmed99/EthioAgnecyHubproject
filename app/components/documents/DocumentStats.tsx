import { Link } from '@remix-run/react'

interface DocumentStatsProps {
  stats: {
    total: number
    pending: number
    verified: number
    rejected: number
    expired: number
    verificationRate: number
    averageVerificationTime: number
  }
}

export function DocumentStats({ stats }: DocumentStatsProps) {
  const statCards = [
    {
      name: 'Total Documents',
      value: stats.total,
      color: 'bg-primary-500',
      href: '/documents',
    },
    {
      name: 'Pending Verification',
      value: stats.pending,
      color: 'bg-warning-500',
      href: '/documents?status=PENDING',
    },
    {
      name: 'Verified',
      value: stats.verified,
      color: 'bg-success-500',
      href: '/documents?status=VERIFIED',
    },
    {
      name: 'Rejected',
      value: stats.rejected,
      color: 'bg-error-500',
      href: '/documents?status=REJECTED',
    },
    {
      name: 'Expired',
      value: stats.expired,
      color: 'bg-gray-500',
      href: '/documents?status=EXPIRED',
    },
    {
      name: 'Verification Rate',
      value: `${stats.verificationRate.toFixed(1)}%`,
      color: 'bg-blue-500',
      href: '/documents',
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
