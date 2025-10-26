# 🔄 Service Migration Guide: Prisma → InsForge

This guide shows you how to migrate remaining services from Prisma to InsForge.

## 📋 Migration Pattern

### Basic Query Conversion

#### Create Operation

**Prisma:**
```typescript
const user = await prisma.user.create({
  data: { email, password, firstName, lastName },
  include: { agency: true },
});
```

**InsForge:**
```typescript
const { data: user, error } = await insforgeClient.database
  .from('users')
  .insert([{ email, password, firstName, lastName }])
  .select('*, agency:agencies(*)')
  .single();
```

#### Read Operations

**Prisma:**
```typescript
const user = await prisma.user.findUnique({
  where: { id },
  include: { agency: true },
});
```

**InsForge:**
```typescript
const { data: user, error } = await insforgeClient.database
  .from('users')
  .select('*, agency:agencies(*)')
  .eq('id', id)
  .single();
```

**Find Many:**
```typescript
const { data: users, error } = await insforgeClient.database
  .from('users')
  .select('*, agency:agencies(*)')
  .eq('isActive', true)
  .order('createdAt', { ascending: false })
  .range(offset, offset + limit - 1);
```

#### Update Operation

**Prisma:**
```typescript
const user = await prisma.user.update({
  where: { id },
  data: { firstName, lastName },
  include: { agency: true },
});
```

**InsForge:**
```typescript
const { data: user, error } = await insforgeClient.database
  .from('users')
  .update({ firstName, lastName })
  .eq('id', id)
  .select('*, agency:agencies(*)')
  .single();
```

#### Delete Operation

**Prisma:**
```typescript
await prisma.user.delete({ where: { id } });
```

**InsForge:**
```typescript
const { error } = await insforgeClient.database
  .from('users')
  .delete()
  .eq('id', id);
```

### Advanced Queries

#### Filtering
```typescript
// Multiple conditions
const { data, error } = await insforgeClient.database
  .from('employees')
  .select()
  .eq('status', 'ACTIVE')
  .eq('agencyId', agencyId)
  .neq('isDeleted', true);
```

#### Pagination
```typescript
const page = 1;
const limit = 20;
const offset = (page - 1) * limit;

const { data, error, count } = await insforgeClient.database
  .from('employees')
  .select('*', { count: 'exact' })
  .range(offset, offset + limit - 1);
```

#### Sorting
```typescript
// Single field
.order('createdAt', { ascending: false })

// Multiple fields
.order('status')
.order('createdAt', { ascending: false })
```

#### Text Search
```typescript
// Insensitive text search
.or('firstName.ilike.%search%,lastName.ilike.%search%')

// Full text search (if enabled)
.fts('full_text_column', 'search term')
```

## 📚 Services to Migrate

### 1. Auth Service (`app/services/auth/authService.server.ts`)
**Status:** 🔄 Needs Migration
- Uses: `users` table
- Methods: login, register, getUserById, updateProfile, changePassword

### 2. Agent Service (`app/services/agents/agentService.server.ts`)
**Status:** 🔄 Needs Migration
- Uses: `agents` table
- Methods: createAgent, getAgentById, searchAgents, updateAgentStatus

### 3. Document Service (`app/services/documents/documentService.server.ts`)
**Status:** 🔄 Needs Migration
- Uses: `documents` table
- Methods: createDocument, getDocumentById, searchDocuments

### 4. Travel Service (`app/services/travel/travelService.server.ts`)
**Status:** 🔄 Needs Migration
- Uses: `travels` table
- Methods: createTravel, searchTravels, updateTravelStatus

### 5. Hajj Umrah Service (`app/services/hajj-umrah/hajjUmrahService.server.ts`)
**Status:** 🔄 Needs Migration
- Uses: `hajj_umrah` table
- Methods: createPilgrimage, searchPilgrimages, updateRequirements

### 6. Institution Service (`app/services/institutions/institutionService.server.ts`)
**Status:** 🔄 Needs Migration
- Uses: `institutions` table
- Methods: createInstitution, searchInstitutions, updateInstitution

### 7. MOLS Service (`app/services/documents/molsService.server.ts`)
**Status:** 🔄 Needs Migration
- Uses: External MOLS API + InsForge storage
- Methods: syncMOLS, fetchDocuments

### 8. Visa Service (`app/services/documents/visaService.server.ts`)
**Status:** 🔄 Needs Migration
- Uses: External embassy API + InsForge storage
- Methods: submitVisa, checkStatus, uploadDocuments

### 9. Registration Service (`app/services/employee/registrationService.server.ts`)
**Status:** 🔄 Needs Migration
- Uses: `employees` table
- Methods: completeRegistration, validateData

### 10. CV Service (`app/services/employee/cvService.server.ts`)
**Status:** 🔄 Needs Migration
- Uses: `employees` table + storage
- Methods: generateCV, downloadCV, shareCV

### 11. Training Service (`app/services/employee/trainingService.server.ts`)
**Status:** 🔄 Needs Migration
- Uses: `trainings` table (if exists)
- Methods: scheduleTraining, trackProgress

### 12. Permissions Service (`app/services/auth/permissions.server.ts`)
**Status:** 🔄 Needs Migration
- Uses: `users` table
- Methods: checkPermission, getRolePermissions

## 🎯 Migration Checklist

- [x] ✅ InsForge SDK installed
- [x] ✅ Database tables created
- [x] ✅ Helper utilities created
- [x] ✅ Example migration created (`employeeService.insforge.server.ts`)
- [ ] ⚠️ Migrate auth service
- [ ] ⚠️ Migrate agent service
- [ ] ⚠️ Migrate document service
- [ ] ⚠️ Migrate travel service
- [ ] ⚠️ Migrate hajj/umrah service
- [ ] ⚠️ Migrate institution service
- [ ] ⚠️ Migrate MOLS service
- [ ] ⚠️ Migrate visa service
- [ ] ⚠️ Migrate registration service
- [ ] ⚠️ Migrate CV service
- [ ] ⚠️ Migrate training service
- [ ] ⚠️ Migrate permissions service

## 📝 Step-by-Step Migration Process

### Step 1: Create New InsForge Service File

Create a new file: `[serviceName].insforge.server.ts`

```typescript
import { insforgeClient } from '~/lib/insforge.server';
import { executeInsforgeQuery } from '~/lib/insforge-helpers.server';

export class [ServiceName]Insforge {
  static async methodName(params) {
    return executeInsforgeQuery(
      async () => {
        // Implement InsForge query
      },
      'Error message'
    );
  }
}
```

### Step 2: Update Import Statements

In route files, update imports:
```typescript
// Old
import { AgentService } from '~/services/agents/agentService.server';

// New
import { AgentServiceInsforge as AgentService } from '~/services/agents/agentService.insforge.server';
```

### Step 3: Test Each Service

Test individual methods to ensure they work correctly:
```typescript
const result = await ServiceName.method(params);
console.log('Result:', result);
```

### Step 4: Remove Prisma Dependency

Once all services are migrated:
```bash
npm uninstall @prisma/client prisma
rm -rf prisma/
```

## 🚨 Common Issues & Solutions

### Issue: "Table does not exist"
**Solution:** Check table name in InsForge dashboard

### Issue: "Column does not exist"
**Solution:** Verify column names match the schema

### Issue: "Missing relationship"
**Solution:** Use join syntax: `select('*, related:related_table(*)')`

### Issue: "Pagination not working"
**Solution:** Use `.range(offset, offset + limit - 1)` instead of `.limit()`

## 🎯 Current Status

**Total Services:** 12
**Migrated:** 1 (employee service - example)
**Remaining:** 11 services

**Pattern Provided:** ✅
**Helper Utilities:** ✅
**Documentation:** ✅

## 📚 Reference Files

- **Example Migration:** `app/services/employee/employeeService.insforge.server.ts`
- **Helper Utilities:** `app/lib/insforge-helpers.server.ts`
- **Client Setup:** `app/lib/insforge.server.ts`
- **This Guide:** `SERVICE_MIGRATION_GUIDE.md`

---

**Need Help?** Follow the pattern in `employeeService.insforge.server.ts` for a complete example!

