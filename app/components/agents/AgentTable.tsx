import { Link } from '@remix-run/react'
import { Suspense } from 'react'

interface AgentTableProps {
  data: Promise<{
    agents: Array<{
      id: string
      firstName: string
      lastName: string
      contactEmail?: string
      contactPhone?: string
      specialization?: string
      status: string
      performance?: number
      createdAt: string
      user?: {
        username: string
        role: string
      }
    }>
    total: number
  }>
}

function getStatusColor(status: string) {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800'
    case 'INACTIVE':
      return 'bg-gray-100 text-gray-800'
    case 'TRAINING':
      return 'bg-blue-100 text-blue-800'
    case 'SUSPENDED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getPerformanceColor(performance?: number) {
  if (!performance) return 'text-gray-500'
  if (performance >= 90) return 'text-green-600'
  if (performance >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

function AgentRow({ agent }: { agent: any }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="table-cell">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {agent.firstName[0]}{agent.lastName[0]}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {agent.firstName} {agent.lastName}
            </div>
            <div className="text-sm text-gray-500">
              @{agent.user?.username || 'N/A'}
            </div>
          </div>
        </div>
      </td>
      <td className="table-cell">
        <span className="text-sm text-gray-900">
          {agent.specialization || 'General'}
        </span>
      </td>
      <td className="table-cell">
        <div className="text-sm text-gray-900">
          {agent.contactEmail || 'N/A'}
        </div>
        <div className="text-sm text-gray-500">
          {agent.contactPhone || 'N/A'}
        </div>
      </td>
      <td className="table-cell">
        <span className={`text-sm font-medium ${getPerformanceColor(agent.performance)}`}>
          {agent.performance ? `${agent.performance}%` : 'N/A'}
        </span>
      </td>
      <td className="table-cell">
        <span className={`badge ${getStatusColor(agent.status)}`}>
          {agent.status}
        </span>
      </td>
      <td className="table-cell">
        <span className="text-sm text-gray-900">
          {new Date(agent.createdAt).toLocaleDateString()}
        </span>
      </td>
      <td className="table-cell">
        <div className="flex items-center space-x-2">
          <Link
            to={`/agents/${agent.id}`}
            className="text-primary-600 hover:text-primary-500 text-sm font-medium"
          >
            View
          </Link>
          <Link
            to={`/agents/${agent.id}/edit`}
            className="text-secondary-600 hover:text-secondary-500 text-sm font-medium"
          >
            Edit
          </Link>
        </div>
      </td>
    </tr>
  )
}

function AgentTableContent({ data }: AgentTableProps) {
  const { agents, total } = data as any

  if (agents.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No agents found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by adding a new agent.</p>
        <div className="mt-6">
          <Link
            to="/agents/agent-detail"
            className="btn-primary"
          >
            Add Agent
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{agents.length}</span> of{' '}
          <span className="font-medium">{total}</span> agents
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Agent</th>
              <th className="table-header-cell">Specialization</th>
              <th className="table-header-cell">Contact</th>
              <th className="table-header-cell">Performance</th>
              <th className="table-header-cell">Status</th>
              <th className="table-header-cell">Joined</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {agents.map((agent: any) => (
              <AgentRow key={agent.id} agent={agent} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AgentTable({ data }: AgentTableProps) {
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
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    }>
      <AgentTableContent data={data} />
    </Suspense>
  )
}
