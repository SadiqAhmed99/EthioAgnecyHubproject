import { prisma } from '../../lib/prisma.server';
import { EmployeeCreateSchema, EmployeeUpdateSchema } from '../../models/schemas/employee.schema';
import { APP_CONSTANTS } from '../../config/constants';

export interface EmployeeFilters {
  status?: string;
  region?: string;
  skills?: string[];
  experienceLevel?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface EmployeeStats {
  total: number;
  active: number;
  pending: number;
  inactive: number;
  suspended: number;
  byRegion: Record<string, number>;
  bySkills: Record<string, number>;
}

export class EmployeeService {
  // Get all employees with filters and pagination
  static async getAllEmployees(filters: EmployeeFilters = {}) {
    const {
      status,
      region,
      skills,
      experienceLevel,
      search,
      page = 1,
      limit = APP_CONSTANTS.DEFAULT_PAGE_SIZE,
    } = filters;

    const skip = (page - 1) * limit;
    const where: any = {};

    // Apply filters
    if (status) where.status = status;
    if (region) where.region = region;
    if (experienceLevel) where.experienceLevel = experienceLevel;
    if (skills && skills.length > 0) {
      where.skills = {
        hasSome: skills,
      };
    }
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          documents: true,
          travelRecords: true,
        },
      }),
      prisma.employee.count({ where }),
    ]);

    return {
      employees,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get employee by ID
  static async getEmployeeById(id: string) {
    return prisma.employee.findUnique({
      where: { id },
      include: {
        documents: true,
        travelRecords: true,
        hajjUmrahRecords: true,
      },
    });
  }

  // Create new employee
  static async createEmployee(data: any) {
    const validatedData = EmployeeCreateSchema.parse(data);
    
    return prisma.employee.create({
      data: {
        ...validatedData,
        status: 'pending',
      },
      include: {
        documents: true,
      },
    });
  }

  // Update employee
  static async updateEmployee(id: string, data: any) {
    const validatedData = EmployeeUpdateSchema.parse(data);
    
    return prisma.employee.update({
      where: { id },
      data: validatedData,
      include: {
        documents: true,
        travelRecords: true,
      },
    });
  }

  // Delete employee
  static async deleteEmployee(id: string) {
    return prisma.employee.delete({
      where: { id },
    });
  }

  // Get employee statistics
  static async getEmployeeStats(): Promise<EmployeeStats> {
    const [
      total,
      active,
      pending,
      inactive,
      suspended,
      byRegion,
      bySkills,
    ] = await Promise.all([
      prisma.employee.count(),
      prisma.employee.count({ where: { status: 'active' } }),
      prisma.employee.count({ where: { status: 'pending' } }),
      prisma.employee.count({ where: { status: 'inactive' } }),
      prisma.employee.count({ where: { status: 'suspended' } }),
      prisma.employee.groupBy({
        by: ['region'],
        _count: { region: true },
      }),
      prisma.employee.groupBy({
        by: ['skills'],
        _count: { skills: true },
      }),
    ]);

    const regionStats: Record<string, number> = {};
    byRegion.forEach(item => {
      regionStats[item.region] = item._count.region;
    });

    const skillsStats: Record<string, number> = {};
    bySkills.forEach(item => {
      if (item.skills) {
        item.skills.forEach(skill => {
          skillsStats[skill] = (skillsStats[skill] || 0) + 1;
        });
      }
    });

    return {
      total,
      active,
      pending,
      inactive,
      suspended,
      byRegion: regionStats,
      bySkills: skillsStats,
    };
  }

  // Search employees
  static async searchEmployees(query: string, limit = 10) {
    return prisma.employee.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        status: true,
      },
    });
  }

  // Get employees by status
  static async getEmployeesByStatus(status: string) {
    return prisma.employee.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get employees by region
  static async getEmployeesByRegion(region: string) {
    return prisma.employee.findMany({
      where: { region },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get employees by skills
  static async getEmployeesBySkills(skills: string[]) {
    return prisma.employee.findMany({
      where: {
        skills: {
          hasSome: skills,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Update employee status
  static async updateEmployeeStatus(id: string, status: string) {
    return prisma.employee.update({
      where: { id },
      data: { status },
    });
  }

  // Get recent employees
  static async getRecentEmployees(limit = 10) {
    return prisma.employee.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        createdAt: true,
      },
    });
  }

  // Get employees with expiring documents
  static async getEmployeesWithExpiringDocuments(days = 30) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    return prisma.employee.findMany({
      where: {
        documents: {
          some: {
            expiryDate: {
              lte: expiryDate,
            },
            status: 'verified',
          },
        },
      },
      include: {
        documents: {
          where: {
            expiryDate: {
              lte: expiryDate,
            },
            status: 'verified',
          },
        },
      },
    });
  }

  // Bulk update employees
  static async bulkUpdateEmployees(ids: string[], data: any) {
    return prisma.employee.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data,
    });
  }

  // Export employees data
  static async exportEmployees(filters: EmployeeFilters = {}) {
    const { employees } = await this.getAllEmployees({
      ...filters,
      limit: APP_CONSTANTS.MAX_PAGE_SIZE,
    });

    return employees.map(employee => ({
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      status: employee.status,
      region: employee.region,
      skills: employee.skills?.join(', '),
      experienceLevel: employee.experienceLevel,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    }));
  }
}

// Export singleton instance
export const employeeService = EmployeeService;
