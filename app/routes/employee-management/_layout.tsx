import { Outlet, useLoaderData } from '@remix-run/react';
import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { requireUser } from '~/middleware/authMiddleware.server';
import { employeeService } from '~/services/employee/employeeService.server';
import { EmployeeStats } from '~/components/employee/EmployeeStats';
import { EmployeeFilters } from '~/components/employee/EmployeeFilters';
import { EmployeeTable } from '~/components/employee/EmployeeTable';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  
  const url = new URL(request.url);
  const filters = {
    status: url.searchParams.get('status') || undefined,
    region: url.searchParams.get('region') || undefined,
    skills: url.searchParams.get('skills')?.split(',') || undefined,
    search: url.searchParams.get('search') || undefined,
    page: parseInt(url.searchParams.get('page') || '1'),
    limit: parseInt(url.searchParams.get('limit') || '20'),
  };

  const [employeesData, stats] = await Promise.all([
    employeeService.getAllEmployees(filters),
    employeeService.getEmployeeStats(),
  ]);

  return json({
    user,
    employees: employeesData.employees,
    pagination: employeesData.pagination,
    stats,
    filters,
  });
}

export default function EmployeeManagementLayout() {
  const { user, employees, pagination, stats, filters } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage employee registrations, profiles, and documentation.
        </p>
      </div>

      {/* Stats */}
      <EmployeeStats stats={stats} />

      {/* Filters */}
      <EmployeeFilters currentFilters={filters} />

      {/* Employee Table */}
      <EmployeeTable 
        employees={employees} 
        pagination={pagination}
        userRole={user.role}
      />

      {/* Nested Routes */}
      <Outlet />
    </div>
  );
}
