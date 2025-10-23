import { prisma } from '~/lib/prisma.server'
import { CreateTravelSchema } from '~/models/schemas/employee.schema'
import type { Travel, TravelStatus } from '~/models/employee.types'

export class TravelService {
  // Create new travel record
  static async createTravel(data: any): Promise<Travel | null> {
    try {
      const validatedData = CreateTravelSchema.parse(data)
      
      const travel = await prisma.travel.create({
        data: validatedData,
        include: {
          employee: true,
        },
      })

      return travel as Travel
    } catch (error) {
      console.error('Create travel error:', error)
      return null
    }
  }

  // Get travel by ID
  static async getTravelById(id: string): Promise<Travel | null> {
    try {
      const travel = await prisma.travel.findUnique({
        where: { id },
        include: {
          employee: true,
        },
      })

      return travel as Travel
    } catch (error) {
      console.error('Get travel error:', error)
      return null
    }
  }

  // Get travels by employee
  static async getTravelsByEmployee(employeeId: string): Promise<Travel[]> {
    try {
      const travels = await prisma.travel.findMany({
        where: { employeeId },
        include: {
          employee: true,
        },
        orderBy: { createdAt: 'desc' },
      })

      return travels as Travel[]
    } catch (error) {
      console.error('Get travels by employee error:', error)
      return []
    }
  }

  // Get today's departures
  static async getTodaysDepartures(agencyId: string): Promise<Travel[]> {
    try {
      const today = new Date()
      const startOfDay = new Date(today.setHours(0, 0, 0, 0))
      const endOfDay = new Date(today.setHours(23, 59, 59, 999))

      const travels = await prisma.travel.findMany({
        where: {
          employee: { agencyId },
          departureDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        include: {
          employee: true,
        },
        orderBy: { departureDate: 'asc' },
      })

      return travels as Travel[]
    } catch (error) {
      console.error('Get today\'s departures error:', error)
      return []
    }
  }

  // Get upcoming departures
  static async getUpcomingDepartures(agencyId: string, days: number = 7): Promise<Travel[]> {
    try {
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + days)

      const travels = await prisma.travel.findMany({
        where: {
          employee: { agencyId },
          departureDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          employee: true,
        },
        orderBy: { departureDate: 'asc' },
      })

      return travels as Travel[]
    } catch (error) {
      console.error('Get upcoming departures error:', error)
      return []
    }
  }

  // Update travel status
  static async updateTravelStatus(id: string, status: TravelStatus): Promise<boolean> {
    try {
      await prisma.travel.update({
        where: { id },
        data: { status },
      })
      return true
    } catch (error) {
      console.error('Update travel status error:', error)
      return false
    }
  }

  // Update travel details
  static async updateTravel(id: string, data: any): Promise<Travel | null> {
    try {
      const travel = await prisma.travel.update({
        where: { id },
        data,
        include: {
          employee: true,
        },
      })

      return travel as Travel
    } catch (error) {
      console.error('Update travel error:', error)
      return null
    }
  }

  // Delete travel record
  static async deleteTravel(id: string): Promise<boolean> {
    try {
      await prisma.travel.delete({
        where: { id },
      })
      return true
    } catch (error) {
      console.error('Delete travel error:', error)
      return false
    }
  }

  // Get travel statistics
  static async getTravelStats(agencyId: string): Promise<{
    total: number
    scheduled: number
    confirmed: number
    inTransit: number
    arrived: number
    cancelled: number
  }> {
    try {
      const [
        total,
        scheduled,
        confirmed,
        inTransit,
        arrived,
        cancelled,
      ] = await Promise.all([
        prisma.travel.count({
          where: { employee: { agencyId } },
        }),
        prisma.travel.count({
          where: { employee: { agencyId }, status: 'SCHEDULED' },
        }),
        prisma.travel.count({
          where: { employee: { agencyId }, status: 'CONFIRMED' },
        }),
        prisma.travel.count({
          where: { employee: { agencyId }, status: 'IN_TRANSIT' },
        }),
        prisma.travel.count({
          where: { employee: { agencyId }, status: 'ARRIVED' },
        }),
        prisma.travel.count({
          where: { employee: { agencyId }, status: 'CANCELLED' },
        }),
      ])

      return {
        total,
        scheduled,
        confirmed,
        inTransit,
        arrived,
        cancelled,
      }
    } catch (error) {
      console.error('Get travel stats error:', error)
      return {
        total: 0,
        scheduled: 0,
        confirmed: 0,
        inTransit: 0,
        arrived: 0,
        cancelled: 0,
      }
    }
  }

  // Get travels by status
  static async getTravelsByStatus(
    status: TravelStatus,
    agencyId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ travels: Travel[]; total: number }> {
    try {
      const skip = (page - 1) * limit

      const [travels, total] = await Promise.all([
        prisma.travel.findMany({
          where: {
            employee: { agencyId },
            status,
          },
          skip,
          take: limit,
          include: {
            employee: true,
          },
          orderBy: { departureDate: 'asc' },
        }),
        prisma.travel.count({
          where: {
            employee: { agencyId },
            status,
          },
        }),
      ])

      return {
        travels: travels as Travel[],
        total,
      }
    } catch (error) {
      console.error('Get travels by status error:', error)
      return { travels: [], total: 0 }
    }
  }

  // Search travels
  static async searchTravels(
    searchParams: {
      query?: string
      status?: TravelStatus
      dateFrom?: string
      dateTo?: string
      page?: number
      limit?: number
    },
    agencyId: string
  ): Promise<{ travels: Travel[]; total: number }> {
    try {
      const { page = 1, limit = 20, ...filters } = searchParams
      const skip = (page - 1) * limit

      const where: any = {
        employee: { agencyId },
        ...(filters.status && { status: filters.status }),
        ...(filters.dateFrom && filters.dateTo && {
          departureDate: {
            gte: new Date(filters.dateFrom),
            lte: new Date(filters.dateTo),
          },
        }),
        ...(filters.query && {
          OR: [
            { flightNumber: { contains: filters.query, mode: 'insensitive' } },
            { departureAirport: { contains: filters.query, mode: 'insensitive' } },
            { arrivalAirport: { contains: filters.query, mode: 'insensitive' } },
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

      const [travels, total] = await Promise.all([
        prisma.travel.findMany({
          where,
          skip,
          take: limit,
          include: {
            employee: true,
          },
          orderBy: { departureDate: 'desc' },
        }),
        prisma.travel.count({ where }),
      ])

      return {
        travels: travels as Travel[],
        total,
      }
    } catch (error) {
      console.error('Search travels error:', error)
      return { travels: [], total: 0 }
    }
  }
}
