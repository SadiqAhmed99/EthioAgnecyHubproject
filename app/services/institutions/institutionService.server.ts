import { prisma } from '~/lib/prisma.server'
import { CreateInstitutionSchema } from '~/models/schemas/employee.schema'
import type { Institution, InstitutionType } from '~/models/employee.types'

export class InstitutionService {
  // Create new institution
  static async createInstitution(data: any): Promise<Institution | null> {
    try {
      const validatedData = CreateInstitutionSchema.parse(data)
      
      const institution = await prisma.institution.create({
        data: validatedData,
      })

      return institution as Institution
    } catch (error) {
      console.error('Create institution error:', error)
      return null
    }
  }

  // Get institution by ID
  static async getInstitutionById(id: string): Promise<Institution | null> {
    try {
      const institution = await prisma.institution.findUnique({
        where: { id },
      })

      return institution as Institution
    } catch (error) {
      console.error('Get institution error:', error)
      return null
    }
  }

  // Search institutions
  static async searchInstitutions(
    searchParams: {
      query?: string
      type?: InstitutionType
      page?: number
      limit?: number
    }
  ): Promise<{ institutions: Institution[]; total: number }> {
    try {
      const { page = 1, limit = 20, ...filters } = searchParams
      const skip = (page - 1) * limit

      const where: any = {
        ...(filters.type && { type: filters.type }),
        ...(filters.query && {
          OR: [
            { name: { contains: filters.query, mode: 'insensitive' } },
            { description: { contains: filters.query, mode: 'insensitive' } },
            { contactEmail: { contains: filters.query, mode: 'insensitive' } },
          ],
        }),
      }

      const [institutions, total] = await Promise.all([
        prisma.institution.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.institution.count({ where }),
      ])

      return {
        institutions: institutions as Institution[],
        total,
      }
    } catch (error) {
      console.error('Search institutions error:', error)
      return { institutions: [], total: 0 }
    }
  }

  // Get institution statistics
  static async getInstitutionStats(): Promise<{
    total: number
    government: number
    embassy: number
    bank: number
    medical: number
    insurance: number
    other: number
  }> {
    try {
      const [
        total,
        government,
        embassy,
        bank,
        medical,
        insurance,
        other,
      ] = await Promise.all([
        prisma.institution.count(),
        prisma.institution.count({ where: { type: 'GOVERNMENT' } }),
        prisma.institution.count({ where: { type: 'EMBASSY' } }),
        prisma.institution.count({ where: { type: 'BANK' } }),
        prisma.institution.count({ where: { type: 'MEDICAL' } }),
        prisma.institution.count({ where: { type: 'INSURANCE' } }),
        prisma.institution.count({ where: { type: 'OTHER' } }),
      ])

      return {
        total,
        government,
        embassy,
        bank,
        medical,
        insurance,
        other,
      }
    } catch (error) {
      console.error('Get institution stats error:', error)
      return {
        total: 0,
        government: 0,
        embassy: 0,
        bank: 0,
        medical: 0,
        insurance: 0,
        other: 0,
      }
    }
  }

  // Update institution
  static async updateInstitution(id: string, data: any): Promise<Institution | null> {
    try {
      const institution = await prisma.institution.update({
        where: { id },
        data,
      })

      return institution as Institution
    } catch (error) {
      console.error('Update institution error:', error)
      return null
    }
  }

  // Delete institution
  static async deleteInstitution(id: string): Promise<boolean> {
    try {
      await prisma.institution.delete({
        where: { id },
      })
      return true
    } catch (error) {
      console.error('Delete institution error:', error)
      return false
    }
  }

  // Get institutions by type
  static async getInstitutionsByType(
    type: InstitutionType,
    page: number = 1,
    limit: number = 20
  ): Promise<{ institutions: Institution[]; total: number }> {
    try {
      const skip = (page - 1) * limit

      const [institutions, total] = await Promise.all([
        prisma.institution.findMany({
          where: { type },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.institution.count({ where: { type } }),
      ])

      return {
        institutions: institutions as Institution[],
        total,
      }
    } catch (error) {
      console.error('Get institutions by type error:', error)
      return { institutions: [], total: 0 }
    }
  }

  // Get recent institutions
  static async getRecentInstitutions(limit: number = 10): Promise<Institution[]> {
    try {
      const institutions = await prisma.institution.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
      })

      return institutions as Institution[]
    } catch (error) {
      console.error('Get recent institutions error:', error)
      return []
    }
  }
}
