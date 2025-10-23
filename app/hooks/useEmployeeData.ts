import { useState, useEffect, useCallback } from 'react';
import { useFetcher } from '@remix-run/react';

export interface UseEmployeeDataReturn {
  employees: any[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: {
    status?: string;
    region?: string;
    skills?: string[];
    search?: string;
  };
  refetch: () => void;
  updateFilters: (newFilters: Partial<UseEmployeeDataReturn['filters']>) => void;
  createEmployee: (data: any) => Promise<void>;
  updateEmployee: (id: string, data: any) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  bulkUpdateEmployees: (ids: string[], data: any) => Promise<void>;
}

export function useEmployeeData(): UseEmployeeDataReturn {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    status: undefined,
    region: undefined,
    skills: undefined,
    search: undefined,
  });

  const fetcher = useFetcher();

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    
    const searchParams = new URLSearchParams();
    if (filters.status) searchParams.set('status', filters.status);
    if (filters.region) searchParams.set('region', filters.region);
    if (filters.skills) searchParams.set('skills', filters.skills.join(','));
    if (filters.search) searchParams.set('search', filters.search);
    searchParams.set('page', pagination.page.toString());
    searchParams.set('limit', pagination.limit.toString());

    fetcher.load(`/employee-management?${searchParams.toString()}`);
  }, [filters, pagination.page, pagination.limit, fetcher]);

  const updateFilters = useCallback((newFilters: Partial<UseEmployeeDataReturn['filters']>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  const createEmployee = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);
    
    fetcher.submit(data, {
      method: 'post',
      action: '/actions/employee/create',
    });
  }, [fetcher]);

  const updateEmployee = useCallback(async (id: string, data: any) => {
    setLoading(true);
    setError(null);
    
    fetcher.submit(
      { id, ...data },
      {
        method: 'post',
        action: '/actions/employee/update',
      }
    );
  }, [fetcher]);

  const deleteEmployee = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    fetcher.submit(
      { id },
      {
        method: 'post',
        action: '/actions/employee/delete',
      }
    );
  }, [fetcher]);

  const bulkUpdateEmployees = useCallback(async (ids: string[], data: any) => {
    setLoading(true);
    setError(null);
    
    fetcher.submit(
      { ids: JSON.stringify(ids), data: JSON.stringify(data) },
      {
        method: 'post',
        action: '/actions/employee/bulk-update',
      }
    );
  }, [fetcher]);

  // Handle fetcher data changes
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        if (fetcher.data.employees) {
          setEmployees(fetcher.data.employees);
          setPagination(fetcher.data.pagination);
        }
        if (fetcher.data.employee) {
          // Update single employee in list
          setEmployees(prev => 
            prev.map(emp => emp.id === fetcher.data.employee.id ? fetcher.data.employee : emp)
          );
        }
      } else {
        setError(fetcher.data.message || 'An error occurred');
      }
      setLoading(false);
    }
  }, [fetcher.data]);

  // Handle fetcher state changes
  useEffect(() => {
    if (fetcher.state === 'loading') {
      setLoading(true);
    } else if (fetcher.state === 'idle') {
      setLoading(false);
    }
  }, [fetcher.state]);

  // Initial load
  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    employees,
    loading,
    error,
    pagination,
    filters,
    refetch,
    updateFilters,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    bulkUpdateEmployees,
  };
}
