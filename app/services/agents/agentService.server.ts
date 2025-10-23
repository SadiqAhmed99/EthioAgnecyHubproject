import { prisma } from '~/lib/prisma.server'
import { CreateAgentSchema } from '~/models/schemas/employee.schema'
import type { Agent, AgentStatus } from '~/models/employee.types'

export class AgentService {
  // Create new agent
  static async createAgent(data: any): Promise<Agent | null> {
    try {
      const validatedData = CreateAgentSchema.parse(data)
      
      const agent = await prisma.agent.create({
        data: validatedData,
        include: {
          user: true,
        },
      })

      return agent as Agent
    } catch (error) {
      console.error('Create agent error:', error)
      return null
    }
  }

  // Get agent by ID
  static async getAgentById(id: string): Promise<Agent | null> {
    try {
      const agent = await prisma.agent.findUnique({
        where: { id },
        include: {
          user: true,
        },
      })

      return agent as Agent
    } catch (error) {
      console.error('Get agent error:', error)
      return null
    }
  }

  // Search agents
  static async searchAgents(
    searchParams: {
      query?: string
      status?: AgentStatus
      specialization?: string
      page?: number
      limit?: number
    },
    agencyId: string
  ): Promise<{ agents: Agent[]; total: number }> {
    try {
      const { page = 1, limit = 20, ...filters } = searchParams
      const skip = (page - 1) * limit

      const where: any = {
        agencyId,
        ...(filters.status && { status: filters.status }),
        ...(filters.specialization && { specialization: filters.specialization }),
        ...(filters.query && {
          OR: [
            { firstName: { contains: filters.query, mode: 'insensitive' } },
            { lastName: { contains: filters.query, mode: 'insensitive' } },
            { contactEmail: { contains: filters.query, mode: 'insensitive' } },
            { contactPhone: { contains: filters.query, mode: 'insensitive' } },
          ],
        }),
      }

      const [agents, total] = await Promise.all([
        prisma.agent.findMany({
          where,
          skip,
          take: limit,
          include: {
            user: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.agent.count({ where }),
      ])

      return {
        agents: agents as Agent[],
        total,
      }
    } catch (error) {
      console.error('Search agents error:', error)
      return { agents: [], total: 0 }
    }
  }

  // Get agent statistics
  static async getAgentStats(agencyId: string): Promise<{
    total: number
    active: number
    inactive: number
    training: number
    suspended: number
    averagePerformance: number
  }> {
    try {
      const [
        total,
        active,
        inactive,
        training,
        suspended,
      ] = await Promise.all([
        prisma.agent.count({ where: { agencyId } }),
        prisma.agent.count({ where: { agencyId, status: 'ACTIVE' } }),
        prisma.agent.count({ where: { agencyId, status: 'INACTIVE' } }),
        prisma.agent.count({ where: { agencyId, status: 'TRAINING' } }),
        prisma.agent.count({ where: { agencyId, status: 'SUSPENDED' } }),
      ])

      // Calculate average performance (simplified)
      const averagePerformance = 85 // This would be calculated from actual performance data

      return {
        total,
        active,
        inactive,
        training,
        suspended,
        averagePerformance,
      }
    } catch (error) {
      console.error('Get agent stats error:', error)
      return {
        total: 0,
        active: 0,
        inactive: 0,
        training: 0,
        suspended: 0,
        averagePerformance: 0,
      }
    }
  }

  // Update agent
  static async updateAgent(id: string, data: any): Promise<Agent | null> {
    try {
      const agent = await prisma.agent.update({
        where: { id },
        data,
        include: {
          user: true,
        },
      })

      return agent as Agent
    } catch (error) {
      console.error('Update agent error:', error)
      return null
    }
  }

  // Update agent status
  static async updateAgentStatus(id: string, status: AgentStatus): Promise<boolean> {
    try {
      await prisma.agent.update({
        where: { id },
        data: { status },
      })
      return true
    } catch (error) {
      console.error('Update agent status error:', error)
      return false
    }
  }

  // Delete agent
  static async deleteAgent(id: string): Promise<boolean> {
    try {
      await prisma.agent.delete({
        where: { id },
      })
      return true
    } catch (error) {
      console.error('Delete agent error:', error)
      return false
    }
  }

  // Get agents by status
  static async getAgentsByStatus(
    status: AgentStatus,
    agencyId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ agents: Agent[]; total: number }> {
    try {
      const skip = (page - 1) * limit

      const [agents, total] = await Promise.all([
        prisma.agent.findMany({
          where: {
            agencyId,
            status,
          },
          skip,
          take: limit,
          include: {
            user: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.agent.count({
          where: {
            agencyId,
            status,
          },
        }),
      ])

      return {
        agents: agents as Agent[],
        total,
      }
    } catch (error) {
      console.error('Get agents by status error:', error)
      return { agents: [], total: 0 }
    }
  }

  // Get top performing agents
  static async getTopPerformingAgents(agencyId: string, limit: number = 10): Promise<Agent[]> {
    try {
      const agents = await prisma.agent.findMany({
        where: { agencyId },
        take: limit,
        include: {
          user: true,
        },
        orderBy: { createdAt: 'desc' }, // This would be ordered by performance metrics
      })

      return agents as Agent[]
    } catch (error) {
      console.error('Get top performing agents error:', error)
      return []
    }
  }

  // Get recent agents
  static async getRecentAgents(agencyId: string, limit: number = 10): Promise<Agent[]> {
    try {
      const agents = await prisma.agent.findMany({
        where: { agencyId },
        take: limit,
        include: {
          user: true,
        },
        orderBy: { createdAt: 'desc' },
      })

      return agents as Agent[]
    } catch (error) {
      console.error('Get recent agents error:', error)
      return []
    }
  }
}
