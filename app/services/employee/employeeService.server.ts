import { prisma } from '~/lib/prisma.server'
import { CreateEmployeeSchema, UpdateEmployeeSchema, EmployeeSearchSchema } from '~/models/schemas/employee.schema'
import type { Employee, EmployeeSearchParams, EmployeeStats } from '~/models/employee.types'

export class EmployeeService {
  // Create new employee
  static async createEmployee(data: any): Promise<Employee | null> {
    try {
      const validatedData = CreateEmployeeSchema.parse(data)
      
      const employee = await prisma.employee.create({
        data: {
          ...validatedData,
          employeeId: await this.generateEmployeeId(),
        },
        include: {
          agency: true,
          passport: true,
          skills: true,
          languages: true,
          documents: true,
        },
      })

      return employee as Employee
    } catch (error) {
      console.error('Create employee error:', error)
      return null
    }
  }

  // Update employee
  static async updateEmployee(id: string, data: any): Promise<Employee | null> {
    try {
      const validatedData = UpdateEmployeeSchema.parse(data)
      
      const employee = await prisma.employee.update({
        where: { id },
        data: validatedData,
        include: {
          agency: true,
          passport: true,
          skills: true,
          languages: true,
          documents: true,
        },
      })

      return employee as Employee
    } catch (error) {
      console.error('Update employee error:', error)
      return null
    }
  }

  // Get employee by ID
  static async getEmployeeById(id: string): Promise<Employee | null> {
    try {
      const employee = await prisma.employee.findUnique({
        where: { id },
        include: {
          agency: true,
          passport: true,
          skills: true,
          languages: true,
          documents: true,
          applications: true,
          travels: true,
          hajjUmrah: true,
        },
      })

      return employee as Employee
    } catch (error) {
      console.error('Get employee error:', error)
      return null
    }
  }

  // Search employees
  static async searchEmployees(
    searchParams: EmployeeSearchParams,
    agencyId: string
  ): Promise<{ employees: Employee[]; total: number }> {
    try {
      const validatedParams = EmployeeSearchSchema.parse(searchParams)
      const { page = 1, limit = 20, ...filters } = validatedParams
      const skip = (page - 1) * limit

      const where: any = {
        agencyId,
        ...(filters.query && {
          OR: [
            { firstName: { contains: filters.query, mode: 'insensitive' } },
            { lastName: { contains: filters.query, mode: 'insensitive' } },
            { employeeId: { contains: filters.query, mode: 'insensitive' } },
            { phone: { contains: filters.query, mode: 'insensitive' } },
          ],
        }),
        ...(filters.status && { status: filters.status }),
        ...(filters.gender && { gender: filters.gender }),
        ...(filters.dateFrom && filters.dateTo && {
          registrationDate: {
            gte: new Date(filters.dateFrom),
            lte: new Date(filters.dateTo),
          },
        }),
      }

      const [employees, total] = await Promise.all([
        prisma.employee.findMany({
          where,
          skip,
          take: limit,
          include: {
            agency: true,
            passport: true,
            skills: true,
            languages: true,
            documents: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.employee.count({ where }),
      ])

      return {
        employees: employees as Employee[],
        total,
      }
    } catch (error) {
      console.error('Search employees error:', error)
      return { employees: [], total: 0 }
    }
  }

  // Get employee statistics
  static async getEmployeeStats(agencyId: string): Promise<EmployeeStats> {
    try {
      const [
        total,
        registered,
        documentPending,
        skillAssessed,
        readyForDeployment,
        deployed,
        returned,
        suspended,
      ] = await Promise.all([
        prisma.employee.count({ where: { agencyId } }),
        prisma.employee.count({ where: { agencyId, status: 'REGISTERED' } }),
        prisma.employee.count({ where: { agencyId, status: 'DOCUMENT_PENDING' } }),
        prisma.employee.count({ where: { agencyId, status: 'SKILL_ASSESSED' } }),
        prisma.employee.count({ where: { agencyId, status: 'READY_FOR_DEPLOYMENT' } }),
        prisma.employee.count({ where: { agencyId, status: 'DEPLOYED' } }),
        prisma.employee.count({ where: { agencyId, status: 'RETURNED' } }),
        prisma.employee.count({ where: { agencyId, status: 'SUSPENDED' } }),
      ])

      return {
        total,
        registered,
        documentPending,
        skillAssessed,
        readyForDeployment,
        deployed,
        returned,
        suspended,
      }
    } catch (error) {
      console.error('Get employee stats error:', error)
      return {
        total: 0,
        registered: 0,
        documentPending: 0,
        skillAssessed: 0,
        readyForDeployment: 0,
        deployed: 0,
        returned: 0,
        suspended: 0,
      }
    }
  }

  // Generate unique employee ID
  static async generateEmployeeId(): Promise<string> {
    const year = new Date().getFullYear()
    const prefix = `EMP${year}`
    
    const lastEmployee = await prisma.employee.findFirst({
      where: {
        employeeId: {
          startsWith: prefix,
        },
      },
      orderBy: { employeeId: 'desc' },
    })

    if (!lastEmployee) {
      return `${prefix}0001`
    }

    const lastNumber = parseInt(lastEmployee.employeeId.replace(prefix, ''))
    const nextNumber = lastNumber + 1
    
    return `${prefix}${nextNumber.toString().padStart(4, '0')}`
  }

  // Delete employee
  static async deleteEmployee(id: string): Promise<boolean> {
    try {
      await prisma.employee.delete({
        where: { id },
      })
      return true
    } catch (error) {
      console.error('Delete employee error:', error)
      return false
    }
  }

  // Update employee status
  static async updateEmployeeStatus(id: string, status: string): Promise<boolean> {
    try {
      await prisma.employee.update({
        where: { id },
        data: { status: status as any },
      })
      return true
    } catch (error) {
      console.error('Update employee status error:', error)
      return false
    }
  }

  // Get employees by status
  static async getEmployeesByStatus(
    status: string,
    agencyId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ employees: Employee[]; total: number }> {
    try {
      const skip = (page - 1) * limit

      const [employees, total] = await Promise.all([
        prisma.employee.findMany({
          where: {
            agencyId,
            status: status as any,
          },
          skip,
          take: limit,
          include: {
            agency: true,
            passport: true,
            skills: true,
            languages: true,
            documents: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.employee.count({
          where: {
            agencyId,
            status: status as any,
          },
        }),
      ])

      return {
        employees: employees as Employee[],
        total,
      }
    } catch (error) {
      console.error('Get employees by status error:', error)
      return { employees: [], total: 0 }
    }
  }

  // Get recent employees
  static async getRecentEmployees(agencyId: string, limit: number = 10): Promise<Employee[]> {
    try {
      const employees = await prisma.employee.findMany({
        where: { agencyId },
        take: limit,
        include: {
          agency: true,
          passport: true,
          skills: true,
          languages: true,
          documents: true,
        },
        orderBy: { createdAt: 'desc' },
      })

      return employees as Employee[]
    } catch (error) {
      console.error('Get recent employees error:', error)
      return []
    }
  }
}
