import { FullConfig } from '@playwright/test';
import { prisma } from '../../lib/prisma.server';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown...');

  try {
    // Clean up test data
    await cleanupTestData();

    // Close database connection
    await prisma.$disconnect();

    console.log('✅ Global teardown completed successfully');
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    throw error;
  }
}

async function cleanupTestData() {
  console.log('🗑️ Cleaning up test data...');

  try {
    // Delete all test data
    await prisma.$executeRaw`TRUNCATE TABLE "Document" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Visa" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "HajjUmrah" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "TravelRecord" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Task" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Session" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Employee" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;

    console.log('✅ Test data cleanup completed');
  } catch (error) {
    console.error('❌ Test data cleanup failed:', error);
    throw error;
  }
}

export default globalTeardown;
