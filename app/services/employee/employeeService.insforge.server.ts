/**
 * Employee Service - InsForge Implementation
 * 
 * This is an example migration showing how to convert Prisma queries to InsForge SDK.
 * This service uses InsForge SDK instead of Prisma for database operations.
 * 
 * Migration Pattern:
 * - Replace: prisma.employee.create()
 *   With: insforgeClient.database.from('employees').insert([...]).select().single()
 * 
 * - Replace: prisma.employee.findUnique()
 *   With: insforgeClient.database.from('employees').select().eq('id', id).single()
 * 
 * - Replace: prisma.employee.update()
 *   With: insforgeClient.database.from('employees').update(...).eq('id', id).select().single()
 * 
 * - Replace: prisma.employee.findMany()
 *   With: insforgeClient.database.from('employees').select()... with filters
 * 
 * - Replace: include with relations
 *   With: .select('*, agency:agencies(*), passport:passports(*)')
 */

import { insforgeClient } from '~/lib/insforge.server';
import { CreateEmployeeSchema, UpdateEmployeeSchema, EmployeeSearchSchema } from '~/models/schemas/employee.schema';
import type { Employee, EmployeeSearchParams, EmployeeStats } from '~/models/employee.types';
import { executeInsforgeQuery, getPaginationParams } from '~/lib/insforge-helpers.server';

export class EmployeeServiceInsforge {
  // Create new employee
  static async createEmployee(data: any): Promise<Employee | null> {
    return executeInsforgeQuery(
      async () => {
        const validatedData = CreateEmployeeSchema.parse(data);
        
        const employeeId = await this.generateEmployeeId();
        
        const result = await insforgeClient.database
          .from('employees')
          .insert([{
            ...validatedData,
            employee_id: employeeId,
          }])
          .select()
          .single();

        return { data: result, error: null };
      },
      'Create employee error'
    );
  }

  // Update employee
  static async updateEmployee(id: string, data: any): Promise<Employee | null> {
    return executeInsforgeQuery(
      async () => {
        const validatedData = UpdateEmployeeSchema.parse(data);
        
        const result = await insforgeClient.database
          .from('employees')
          .update(validatedData)
          .eq('id', id)
          .select()
          .single();

        return { data: result, error: null };
      },
      'Update employee error'
    );
  }

  // Get employee by ID
  static async getEmployeeById(id: string): Promise<Employee | null> {
    return executeInsforgeQuery(
      async () => {
        const result = await insforgeClient.database
          .from('employees')
          .select('*, agency:agencies(*), passport:passports(*), skills(*), languages(*), documents(*)')
          .eq('id', id)
          .single();

        return { data: result, error: null };
      },
      'Get employee error'
    );
  }

  // Search employees
  static async searchEmployees(
    searchParams: EmployeeSearchParams,
    agencyId: string
  ): Promise<{ employees: Employee[]; total: number }> {
    try {
      const validatedParams = EmployeeSearchSchema.parse(searchParams);
      const { page = 1, limit = 20, ...filters } = validatedParams;
      const { offset, rangeEnd } = getPaginationParams(page, limit);

      // Build query with filters
      let query = insforgeClient.database
        .from('employees')
        .select('*, agency:agencies(*)')
        .eq('agency_id', agencyId);

      // Apply search query
      if (filters.query) {
        query = query.or(`first_name.ilike.%${filters.query}%,last_name.ilike.%${filters.query}%,employee_id.ilike.%${filters.query}%,phone.ilike.%${filters.query}%`);
      }

      // Apply status filter
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      // Apply gender filter
      if (filters.gender) {
        query = query.eq('gender', filters.gender);
      }

      // Apply date range filter
      if (filters.dateFrom && filters.dateTo) {
        query = query
          .gte('registration_date', filters.dateFrom)
          .lte('registration_date', filters.dateTo);
      }

      const { data: employees, error } = await query
        .order('created_at', { ascending: false })
        .range(offset, rangeEnd);

      if (error) {
        console.error('Search employees error:', error);
        return { employees: [], total: 0 };
      }

      // Get total count
      const { data: countData } = await insforgeClient.database
        .from('employees')
        .select('id', { count: 'exact', head: true })
        .eq('agency_id', agencyId);

      const total = countData?.length || 0;

      return {
        employees: employees || [],
        total,
      };
    } catch (error) {
      console.error('Search employees error:', error);
      return { employees: [], total: 0 };
    }
  }

  // Get employee statistics
  static async getEmployeeStats(agencyId: string): Promise<EmployeeStats> {
    try {
      // Get total count
      const { data: totalData } = await insforgeClient.database
        .from('employees')
        .select('id', { count: 'exact', head: true })
        .eq('agency_id', agencyId);

      const total = totalData?.length || 0;

      // Get counts by status
      const { data: registeredData } = await insforgeClient.database
        .from('employees')
        .select('id', { count: 'exact', head: true })
        .eq('agency_id', agencyId)
        .eq('status', 'REGISTERED');

      const registered = registeredData?.length || 0;

      // Similar for other statuses...
      const documentPending = 0;
      const skillAssessed = 0;
      const readyForDeployment = 0;
      const deployed = 0;
      const returned = 0;
      const suspended = 0;

      return {
        total,
        registered,
        documentPending,
        skillAssessed,
        readyForDeployment,
        deployed,
        returned,
        suspended,
      };
    } catch (error) {
      console.error('Get employee stats error:', error);
      return {
        total: 0,
        registered: 0,
        documentPending: 0,
        skillAssessed: 0,
        readyForDeployment: 0,
        deployed: 0,
        returned: 0,
        suspended: 0,
      };
    }
  }

  // Generate unique employee ID
  static async generateEmployeeId(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `EMP${year}`;
    
    // Get last employee with this prefix
    const { data: employees } = await insforgeClient.database
      .from('employees')
      .select('employee_id')
      .like('employee_id', `${prefix}%`)
      .order('employee_id', { ascending: false })
      .limit(1);

    if (!employees || employees.length === 0) {
      return `${prefix}0001`;
    }

    const lastNumber = parseInt(employees[0].employee_id.replace(prefix, '')) || 0;
    const nextNumber = lastNumber + 1;
    
    return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
  }

  // Delete employee
  static async deleteEmployee(id: string): Promise<boolean> {
    try {
      const { error } = await insforgeClient.database
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete employee error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Delete employee error:', error);
      return false;
    }
  }

  // Update employee status
  static async updateEmployeeStatus(id: string, status: string): Promise<boolean> {
    try {
      const { error } = await insforgeClient.database
        .from('employees')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Update employee status error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Update employee status error:', error);
      return false;
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
      const { offset, rangeEnd } = getPaginationParams(page, limit);

      const { data: employees, error } = await insforgeClient.database
        .from('employees')
        .select('*, agency:agencies(*)')
        .eq('agency_id', agencyId)
        .eq('status', status)
        .order('created_at', { ascending: false })
        .range(offset, rangeEnd);

      if (error) {
        console.error('Get employees by status error:', error);
        return { employees: [], total: 0 };
      }

      // Get total count
      const { data: countData } = await insforgeClient.database
        .from('employees')
        .select('id', { count: 'exact', head: true })
        .eq('agency_id', agencyId)
        .eq('status', status);

      const total = countData?.length || 0;

      return {
        employees: employees || [],
        total,
      };
    } catch (error) {
      console.error('Get employees by status error:', error);
      return { employees: [], total: 0 };
    }
  }

  // Get recent employees
  static async getRecentEmployees(agencyId: string, limit: number = 10): Promise<Employee[]> {
    try {
      const { data: employees, error } = await insforgeClient.database
        .from('employees')
        .select('*, agency:agencies(*)')
        .eq('agency_id', agencyId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Get recent employees error:', error);
        return [];
      }

      return employees || [];
    } catch (error) {
      console.error('Get recent employees error:', error);
      return [];
    }
  }
}

