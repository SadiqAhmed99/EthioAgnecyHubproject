import { insforgeClient } from './insforge.server';

/**
 * Helper functions to work with InsForge database
 * Provides wrappers to make InsForge queries similar to Prisma patterns
 */

// Helper to execute a query with proper error handling
export async function executeInsforgeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  errorMessage: string
): Promise<T | null> {
  try {
    const { data, error } = await queryFn();
    if (error) {
      console.error(`${errorMessage}:`, error);
      return null;
    }
    return data;
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    return null;
  }
}

// Helper to execute a query with error handling and throw
export async function executeInsforgeQueryThrow<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  errorMessage: string
): Promise<T> {
  const result = await executeInsforgeQuery(queryFn, errorMessage);
  if (!result) {
    throw new Error(errorMessage);
  }
  return result;
}

// Helper for pagination
export function getPaginationParams(page: number, limit: number) {
  const offset = (page - 1) * limit;
  const rangeEnd = offset + limit - 1;
  return { offset, rangeEnd };
}

// Helper to build select with relations
export function selectWithRelations(relations: string[] = []) {
  if (relations.length === 0) return '*';
  return `*, ${relations.map(rel => `${rel}(*)`).join(', ')}`;
}

// Helper to count records
export async function countRecords(table: string, filter?: any): Promise<number> {
  try {
    const { data, error } = await insforgeClient.database
      .from(table)
      .select('id', { count: 'exact', head: true });
    
    if (error) {
      console.error(`Count ${table} error:`, error);
      return 0;
    }
    return data?.length || 0;
  } catch (error) {
    console.error(`Count ${table} error:`, error);
    return 0;
  }
}

// Helper for complex filtering (similar to Prisma where)
export function buildFilter(filters: any) {
  // This is a simplified version - InsForge uses a more SQL-like approach
  // For complex filters, you'll need to use .or(), .and(), etc.
  return filters;
}

// Helper to handle date ranges
export function buildDateRange(field: string, dateFrom?: Date, dateTo?: Date) {
  return {
    dateFrom,
    dateTo,
  };
}

// Helper to format table names for InsForge (snake_case)
export function toSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase().slice(1);
}

