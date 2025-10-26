import { prisma } from '~/lib/prisma.server'
import { CreateDocumentSchema, DocumentSearchSchema } from '~/models/schemas/employee.schema'
import type { Document, DocumentSearchParams, DocumentStats } from '~/models/document.types'

export class DocumentService {
  // Create new document
  static async createDocument(data: any): Promise<Document | null> {
    try {
      const validatedData = CreateDocumentSchema.parse(data)
      
      const document = await prisma.document.create({
        data: validatedData,
        include: {
          employee: true,
          agency: true,
        },
      })

      return document as Document
    } catch (error) {
      console.error('Create document error:', error)
      return null
    }
  }

  // Get document by ID
  static async getDocumentById(id: string): Promise<Document | null> {
    try {
      const document = await prisma.document.findUnique({
        where: { id },
        include: {
          employee: true,
          agency: true,
        },
      })

      return document as Document
    } catch (error) {
      console.error('Get document error:', error)
      return null
    }
  }

  // Search documents
  static async searchDocuments(
    searchParams: DocumentSearchParams,
    agencyId: string
  ): Promise<{ documents: Document[]; total: number }> {
    try {
      const validatedParams = DocumentSearchSchema.parse(searchParams)
      const { page = 1, limit = 20, ...filters } = validatedParams
      const skip = (page - 1) * limit

      const where: any = {
        agencyId,
        ...(filters.type && { type: filters.type }),
        ...(filters.status && { status: filters.status }),
        ...(filters.employeeId && { employeeId: filters.employeeId }),
        ...(filters.dateFrom && filters.dateTo && {
          uploadedAt: {
            gte: new Date(filters.dateFrom),
            lte: new Date(filters.dateTo),
          },
        }),
      }

      const [documents, total] = await Promise.all([
        prisma.document.findMany({
          where,
          skip,
          take: limit,
          include: {
            employee: true,
            agency: true,
          },
          orderBy: { uploadedAt: 'desc' },
        }),
        prisma.document.count({ where }),
      ])

      return {
        documents: documents as Document[],
        total,
      }
    } catch (error) {
      console.error('Search documents error:', error)
      return { documents: [], total: 0 }
    }
  }

  // Get document statistics
  static async getDocumentStats(agencyId: string): Promise<DocumentStats> {
    try {
      const [
        total,
        pending,
        verified,
        rejected,
        expired,
        verifiedDocuments,
      ] = await Promise.all([
        prisma.document.count({ where: { agencyId } }),
        prisma.document.count({ where: { agencyId, status: 'PENDING' } }),
        prisma.document.count({ where: { agencyId, status: 'VERIFIED' } }),
        prisma.document.count({ where: { agencyId, status: 'REJECTED' } }),
        prisma.document.count({ where: { agencyId, status: 'EXPIRED' } }),
        prisma.document.findMany({
          where: {
            agencyId,
            status: 'VERIFIED',
            verifiedAt: { not: null },
          },
          select: {
            uploadedAt: true,
            verifiedAt: true,
          },
        }),
      ])

      const verificationRate = total > 0 ? (verified / total) * 100 : 0

      // Calculate average verification time
      let averageVerificationTime = 0
      if (verifiedDocuments.length > 0) {
        const totalVerificationTime = verifiedDocuments.reduce((sum, doc) => {
          if (doc.verifiedAt) {
            const verificationTime = doc.verifiedAt.getTime() - doc.uploadedAt.getTime()
            return sum + verificationTime
          }
          return sum
        }, 0)
        
        averageVerificationTime = totalVerificationTime / verifiedDocuments.length
        // Convert from milliseconds to hours for better readability
        averageVerificationTime = averageVerificationTime / (1000 * 60 * 60)
      }

      return {
        total,
        pending,
        verified,
        rejected,
        expired,
        verificationRate,
        averageVerificationTime,
      }
    } catch (error) {
      console.error('Get document stats error:', error)
      return {
        total: 0,
        pending: 0,
        verified: 0,
        rejected: 0,
        expired: 0,
        verificationRate: 0,
        averageVerificationTime: 0,
      }
    }
  }

  // Update document status
  static async updateDocumentStatus(
    id: string,
    status: string,
    verifiedBy?: string
  ): Promise<boolean> {
    try {
      await prisma.document.update({
        where: { id },
        data: {
          status: status as any,
          verifiedAt: status === 'VERIFIED' ? new Date() : undefined,
        },
      })
      return true
    } catch (error) {
      console.error('Update document status error:', error)
      return false
    }
  }

  // Get documents by type
  static async getDocumentsByType(
    type: string,
    agencyId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ documents: Document[]; total: number }> {
    try {
      const skip = (page - 1) * limit

      const [documents, total] = await Promise.all([
        prisma.document.findMany({
          where: {
            agencyId,
            type: type as any,
          },
          skip,
          take: limit,
          include: {
            employee: true,
            agency: true,
          },
          orderBy: { uploadedAt: 'desc' },
        }),
        prisma.document.count({
          where: {
            agencyId,
            type: type as any,
          },
        }),
      ])

      return {
        documents: documents as Document[],
        total,
      }
    } catch (error) {
      console.error('Get documents by type error:', error)
      return { documents: [], total: 0 }
    }
  }

  // Get documents by status
  static async getDocumentsByStatus(
    status: string,
    agencyId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ documents: Document[]; total: number }> {
    try {
      const skip = (page - 1) * limit

      const [documents, total] = await Promise.all([
        prisma.document.findMany({
          where: {
            agencyId,
            status: status as any,
          },
          skip,
          take: limit,
          include: {
            employee: true,
            agency: true,
          },
          orderBy: { uploadedAt: 'desc' },
        }),
        prisma.document.count({
          where: {
            agencyId,
            status: status as any,
          },
        }),
      ])

      return {
        documents: documents as Document[],
        total,
      }
    } catch (error) {
      console.error('Get documents by status error:', error)
      return { documents: [], total: 0 }
    }
  }

  // Delete document
  static async deleteDocument(id: string): Promise<boolean> {
    try {
      await prisma.document.delete({
        where: { id },
      })
      return true
    } catch (error) {
      console.error('Delete document error:', error)
      return false
    }
  }

  // Get pending documents
  static async getPendingDocuments(agencyId: string): Promise<Document[]> {
    try {
      const documents = await prisma.document.findMany({
        where: {
          agencyId,
          status: 'PENDING',
        },
        include: {
          employee: true,
          agency: true,
        },
        orderBy: { uploadedAt: 'asc' },
      })

      return documents as Document[]
    } catch (error) {
      console.error('Get pending documents error:', error)
      return []
    }
  }

  // Get expired documents
  static async getExpiredDocuments(agencyId: string): Promise<Document[]> {
    try {
      const documents = await prisma.document.findMany({
        where: {
          agencyId,
          status: 'EXPIRED',
        },
        include: {
          employee: true,
          agency: true,
        },
        orderBy: { uploadedAt: 'desc' },
      })

      return documents as Document[]
    } catch (error) {
      console.error('Get expired documents error:', error)
      return []
    }
  }
}
