import { prisma } from '~/lib/prisma.server'
import { CreateHajjUmrahSchema } from '~/models/schemas/employee.schema'
import type { HajjUmrah, PilgrimageType, PilgrimageStatus } from '~/models/employee.types'

export class HajjUmrahService {
  // Create new Hajj/Umrah record
  static async createHajjUmrah(data: any): Promise<HajjUmrah | null> {
    try {
      const validatedData = CreateHajjUmrahSchema.parse(data)
      
      const hajjUmrah = await prisma.hajjUmrah.create({
        data: validatedData,
        include: {
          employee: true,
        },
      })

      return hajjUmrah as HajjUmrah
    } catch (error) {
      console.error('Create Hajj/Umrah error:', error)
      return null
    }
  }

  // Get Hajj/Umrah by ID
  static async getHajjUmrahById(id: string): Promise<HajjUmrah | null> {
    try {
      const hajjUmrah = await prisma.hajjUmrah.findUnique({
        where: { id },
        include: {
          employee: true,
        },
      })

      return hajjUmrah as HajjUmrah
    } catch (error) {
      console.error('Get Hajj/Umrah error:', error)
      return null
    }
  }

  // Get Hajj/Umrah by employee
  static async getHajjUmrahByEmployee(employeeId: string): Promise<HajjUmrah | null> {
    try {
      const hajjUmrah = await prisma.hajjUmrah.findUnique({
        where: { employeeId },
        include: {
          employee: true,
        },
      })

      return hajjUmrah as HajjUmrah
    } catch (error) {
      console.error('Get Hajj/Umrah by employee error:', error)
      return null
    }
  }

  // Search Hajj/Umrah records
  static async searchHajjUmrah(
    searchParams: {
      query?: string
      type?: PilgrimageType
      status?: PilgrimageStatus
      year?: number
      page?: number
      limit?: number
    },
    agencyId: string
  ): Promise<{ hajjUmrah: HajjUmrah[]; total: number }> {
    try {
      const { page = 1, limit = 20, ...filters } = searchParams
      const skip = (page - 1) * limit

      const where: any = {
        employee: { agencyId },
        ...(filters.type && { type: filters.type }),
        ...(filters.status && { status: filters.status }),
        ...(filters.year && { year: filters.year }),
        ...(filters.query && {
          OR: [
            { groupNumber: { contains: filters.query, mode: 'insensitive' } },
            {
              employee: {
                OR: [
                  { firstName: { contains: filters.query, mode: 'insensitive' } },
                  { lastName: { contains: filters.query, mode: 'insensitive' } },
                  { employeeId: { contains: filters.query, mode: 'insensitive' } },
                ],
              },
            },
          ],
        }),
      }

      const [hajjUmrah, total] = await Promise.all([
        prisma.hajjUmrah.findMany({
          where,
          skip,
          take: limit,
          include: {
            employee: true,
          },
          orderBy: { registrationDate: 'desc' },
        }),
        prisma.hajjUmrah.count({ where }),
      ])

      return {
        hajjUmrah: hajjUmrah as HajjUmrah[],
        total,
      }
    } catch (error) {
      console.error('Search Hajj/Umrah error:', error)
      return { hajjUmrah: [], total: 0 }
    }
  }

  // Get Hajj/Umrah statistics
  static async getHajjUmrahStats(agencyId: string): Promise<{
    total: number
    hajj: number
    umrah: number
    registered: number
    documentPending: number
    approved: number
    departed: number
    returned: number
    cancelled: number
  }> {
    try {
      const [
        total,
        hajj,
        umrah,
        registered,
        documentPending,
        approved,
        departed,
        returned,
        cancelled,
      ] = await Promise.all([
        prisma.hajjUmrah.count({
          where: { employee: { agencyId } },
        }),
        prisma.hajjUmrah.count({
          where: { employee: { agencyId }, type: 'HAJJ' },
        }),
        prisma.hajjUmrah.count({
          where: { employee: { agencyId }, type: 'UMRAH' },
        }),
        prisma.hajjUmrah.count({
          where: { employee: { agencyId }, status: 'REGISTERED' },
        }),
        prisma.hajjUmrah.count({
          where: { employee: { agencyId }, status: 'DOCUMENT_PENDING' },
        }),
        prisma.hajjUmrah.count({
          where: { employee: { agencyId }, status: 'APPROVED' },
        }),
        prisma.hajjUmrah.count({
          where: { employee: { agencyId }, status: 'DEPARTED' },
        }),
        prisma.hajjUmrah.count({
          where: { employee: { agencyId }, status: 'RETURNED' },
        }),
        prisma.hajjUmrah.count({
          where: { employee: { agencyId }, status: 'CANCELLED' },
        }),
      ])

      return {
        total,
        hajj,
        umrah,
        registered,
        documentPending,
        approved,
        departed,
        returned,
        cancelled,
      }
    } catch (error) {
      console.error('Get Hajj/Umrah stats error:', error)
      return {
        total: 0,
        hajj: 0,
        umrah: 0,
        registered: 0,
        documentPending: 0,
        approved: 0,
        departed: 0,
        returned: 0,
        cancelled: 0,
      }
    }
  }

  // Update Hajj/Umrah status
  static async updateHajjUmrahStatus(id: string, status: PilgrimageStatus): Promise<boolean> {
    try {
      await prisma.hajjUmrah.update({
        where: { id },
        data: { status },
      })
      return true
    } catch (error) {
      console.error('Update Hajj/Umrah status error:', error)
      return false
    }
  }

  // Update Hajj/Umrah details
  static async updateHajjUmrah(id: string, data: any): Promise<HajjUmrah | null> {
    try {
      const hajjUmrah = await prisma.hajjUmrah.update({
        where: { id },
        data,
        include: {
          employee: true,
        },
      })

      return hajjUmrah as HajjUmrah
    } catch (error) {
      console.error('Update Hajj/Umrah error:', error)
      return null
    }
  }

  // Delete Hajj/Umrah record
  static async deleteHajjUmrah(id: string): Promise<boolean> {
    try {
      await prisma.hajjUmrah.delete({
        where: { id },
      })
      return true
    } catch (error) {
      console.error('Delete Hajj/Umrah error:', error)
      return false
    }
  }

  // Get Hajj/Umrah by status
  static async getHajjUmrahByStatus(
    status: PilgrimageStatus,
    agencyId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ hajjUmrah: HajjUmrah[]; total: number }> {
    try {
      const skip = (page - 1) * limit

      const [hajjUmrah, total] = await Promise.all([
        prisma.hajjUmrah.findMany({
          where: {
            employee: { agencyId },
            status,
          },
          skip,
          take: limit,
          include: {
            employee: true,
          },
          orderBy: { registrationDate: 'desc' },
        }),
        prisma.hajjUmrah.count({
          where: {
            employee: { agencyId },
            status,
          },
        }),
      ])

      return {
        hajjUmrah: hajjUmrah as HajjUmrah[],
        total,
      }
    } catch (error) {
      console.error('Get Hajj/Umrah by status error:', error)
      return { hajjUmrah: [], total: 0 }
    }
  }

  // Get Hajj/Umrah by type
  static async getHajjUmrahByType(
    type: PilgrimageType,
    agencyId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ hajjUmrah: HajjUmrah[]; total: number }> {
    try {
      const skip = (page - 1) * limit

      const [hajjUmrah, total] = await Promise.all([
        prisma.hajjUmrah.findMany({
          where: {
            employee: { agencyId },
            type,
          },
          skip,
          take: limit,
          include: {
            employee: true,
          },
          orderBy: { registrationDate: 'desc' },
        }),
        prisma.hajjUmrah.count({
          where: {
            employee: { agencyId },
            type,
          },
        }),
      ])

      return {
        hajjUmrah: hajjUmrah as HajjUmrah[],
        total,
      }
    } catch (error) {
      console.error('Get Hajj/Umrah by type error:', error)
      return { hajjUmrah: [], total: 0 }
    }
  }

  // Get Hajj/Umrah by year
  static async getHajjUmrahByYear(
    year: number,
    agencyId: string
  ): Promise<HajjUmrah[]> {
    try {
      const hajjUmrah = await prisma.hajjUmrah.findMany({
        where: {
          employee: { agencyId },
          year,
        },
        include: {
          employee: true,
        },
        orderBy: { registrationDate: 'desc' },
      })

      return hajjUmrah as HajjUmrah[]
    } catch (error) {
      console.error('Get Hajj/Umrah by year error:', error)
      return []
    }
  }

  // Get recent Hajj/Umrah registrations
  static async getRecentHajjUmrah(agencyId: string, limit: number = 10): Promise<HajjUmrah[]> {
    try {
      const hajjUmrah = await prisma.hajjUmrah.findMany({
        where: { employee: { agencyId } },
        take: limit,
        include: {
          employee: true,
        },
        orderBy: { registrationDate: 'desc' },
      })

      return hajjUmrah as HajjUmrah[]
    } catch (error) {
      console.error('Get recent Hajj/Umrah error:', error)
      return []
    }
  }
}
