import { test as base } from '@playwright/test';
import { prisma } from '../lib/prisma.server';

// Extend base test with custom fixtures
export const test = base.extend<{
  authenticatedUser: any;
  testEmployee: any;
  testDocument: any;
}>({
  // Authenticated user fixture
  authenticatedUser: async ({}, use) => {
    // Create a test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashed_password',
        firstName: 'Test',
        lastName: 'User',
        role: 'admin',
      },
    });

    await use(user);

    // Cleanup
    await prisma.user.delete({
      where: { id: user.id },
    });
  },

  // Test employee fixture
  testEmployee: async ({}, use) => {
    const employee = await prisma.employee.create({
      data: {
        firstName: 'Test',
        lastName: 'Employee',
        email: 'test.employee@example.com',
        phone: '+251911234567',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'female',
        nationality: 'Ethiopian',
        status: 'active',
      },
    });

    await use(employee);

    // Cleanup
    await prisma.employee.delete({
      where: { id: employee.id },
    });
  },

  // Test document fixture
  testDocument: async ({ testEmployee }, use) => {
    const document = await prisma.document.create({
      data: {
        employeeId: testEmployee.id,
        type: 'passport',
        documentNumber: 'ET1234567',
        status: 'verified',
        uploadedAt: new Date(),
        verifiedAt: new Date(),
      },
    });

    await use(document);

    // Cleanup
    await prisma.document.delete({
      where: { id: document.id },
    });
  },
});

export { expect } from '@playwright/test';
