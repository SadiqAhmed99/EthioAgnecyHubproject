# InsForge Migration Guide

## Current Status

✅ **Completed**:
1. InsForge SDK installed
2. Database tables created (14 tables)
3. Storage buckets created (4 buckets)
4. Server and client SDK wrappers created
5. Environment configuration files updated

❌ **Not Complete**:
1. Services still using Prisma (not migrated)
2. Client-side integration pending
3. Environment variables not set in .env file

---

## Example Migration Pattern

### Before (Using Prisma)

```typescript
// app/services/employee/employeeService.server.ts
import { prisma } from '~/lib/prisma.server';

export class EmployeeService {
  static async getEmployeeById(id: string) {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        agency: true,
        passport: true,
        skills: true,
      },
    });
    return employee;
  }

  static async createEmployee(data: any) {
    const employee = await prisma.employee.create({
      data,
    });
    return employee;
  }
}
```

### After (Using InsForge SDK)

```typescript
// app/services/employee/employeeService.server.ts
import { insforgeClient } from '~/lib/insforge.server';
import type { CreateEmployeeSchema } from '~/models/schemas/employee.schema';

export class EmployeeService {
  static async getEmployeeById(id: string) {
    // Get employee
    const { data: employee, error: empError } = await insforgeClient.database
      .from('employees')
      .select('*, agency:agencies(*), passport:passports(*), skills(*)')
      .eq('id', id)
      .single();

    if (empError || !employee) {
      console.error('Error fetching employee:', empError);
      return null;
    }

    return employee;
  }

  static async createEmployee(data: any) {
    const validatedData = CreateEmployeeSchema.parse(data);

    const { data: employee, error } = await insforgeClient.database
      .from('employees')
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      console.error('Error creating employee:', error);
      return null;
    }

    return employee;
  }

  static async updateEmployee(id: string, data: any) {
    const validatedData = CreateEmployeeSchema.partial().parse(data);

    const { data: employee, error } = await insforgeClient.database
      .from('employees')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating employee:', error);
      return null;
    }

    return employee;
  }

  static async deleteEmployee(id: string) {
    const { error } = await insforgeClient.database
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting employee:', error);
      return false;
    }

    return true;
  }

  static async listEmployees(filters: any = {}) {
    let query = insforgeClient.database
      .from('employees')
      .select('*, agency:agencies(*)');

    // Apply filters
    if (filters.agencyId) {
      query = query.eq('agency_id', filters.agencyId);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.search) {
      query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%`);
    }

    const { data: employees, error } = await query
      .order('created_at', { ascending: false })
      .limit(filters.limit || 50)
      .range(filters.offset || 0, (filters.offset || 0) + (filters.limit || 50) - 1);

    if (error) {
      console.error('Error listing employees:', error);
      return [];
    }

    return employees;
  }
}
```

---

## Key Differences

| Aspect | Prisma | InsForge SDK |
|--------|--------|-------------|
| Query Syntax | OOP method chaining | Fluent API |
| Response | Direct data | `{ data, error }` |
| Single Record | `.findUnique()` | `.select().single()` |
| Includes/Joins | `include: { ... }` | `.select('*, relation:table(*)')` |
| Filters | `where: { field: value }` | `.eq('field', value)` |
| Arrays | Direct arrays | `.select()` returns array |

---

## Migration Checklist

For each service file:

- [ ] Import InsForge client
- [ ] Replace Prisma imports
- [ ] Update query methods
- [ ] Handle `{ data, error }` pattern
- [ ] Use `.single()` for single records
- [ ] Update join syntax
- [ ] Update filter syntax
- [ ] Add error handling
- [ ] Test all methods
- [ ] Update types/interfaces

---

## Quick Migration Steps

1. **Choose ONE service** (start with smallest)
2. **Update imports**:
   ```typescript
   // Remove
   import { prisma } from '~/lib/prisma.server';
   
   // Add
   import { insforgeClient } from '~/lib/insforge.server';
   ```
3. **Convert queries**:
   ```typescript
   // Prisma
   const data = await prisma.model.findUnique({ where: { id } });
   
   // InsForge
   const { data, error } = await insforgeClient.database
     .from('model')
     .select()
     .eq('id', id)
     .single();
   ```
4. **Add error handling**:
   ```typescript
   if (error) {
     console.error('Error:', error);
     return null;
   }
   ```
5. **Test thoroughly**

---

## Services to Migrate (Priority Order)

1. ✅ **Employee Service** - Core functionality
2. ✅ **Auth Service** - Critical for security
3. ✅ **Document Service** - File operations
4. ✅ **Agency Service** - Relationships
5. ✅ **Application Service** - Workflow
6. ✅ **Travel Service** - Logs
7. ✅ **Hajj/Umrah Service** - Specialized
8. ✅ **Institution Service** - External
9. ✅ **Agent Service** - Users
10. ✅ **MOLS Service** - Integration

---

## Environment Setup

### Required Environment Variables

Add to `.env`:
```bash
# InsForge Configuration
INSFORGE_API_URL="https://ft3rzgv5.us-east.insforge.app"
INSFORGE_API_KEY="ik_c1cdcc1a2cdc8b70609fb897157dd0a4"
```

### Optional: Keep Prisma for Migration
```bash
# Keep Prisma during migration period
DATABASE_URL="postgresql://..."  # Keep existing
```

---

## Testing Strategy

1. **Run existing tests** to establish baseline
2. **Migrate one service** at a time
3. **Run tests after migration** to compare results
4. **Keep Prisma active** during migration for comparison
5. **Remove Prisma** only after all services migrated

---

## Rollback Plan

If migration fails:
1. Services still use Prisma by default
2. Revert InsForge client imports
3. Restore original Prisma queries
4. Address issues before retrying

---

## Resources

- [InsForge SDK Documentation](./INSFORGE_INTEGRATION_STATUS.md)
- [InsForge Setup](./env.example)
- [Backend Metadata](./app/routes/resources/insforge-health.ts)

