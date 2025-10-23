import { chromium, FullConfig } from '@playwright/test';
import { prisma } from '../../lib/prisma.server';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...');

  // Start browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Setup test database
    await setupTestDatabase();

    // Setup test data
    await setupTestData();

    // Verify application is running
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    console.log('✅ Global setup completed successfully');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function setupTestDatabase() {
  console.log('📊 Setting up test database...');

  try {
    // Reset database
    await prisma.$executeRaw`TRUNCATE TABLE "Document" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Visa" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "HajjUmrah" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "TravelRecord" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Task" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Session" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Employee" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;

    console.log('✅ Test database reset completed');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
}

async function setupTestData() {
  console.log('📝 Setting up test data...');

  try {
    // Create test users
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: '$2b$10$hashed_password', // In real tests, use proper hashing
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
      },
    });

    const agentUser = await prisma.user.create({
      data: {
        email: 'agent@example.com',
        password: '$2b$10$hashed_password',
        firstName: 'Agent',
        lastName: 'User',
        role: 'agent',
      },
    });

    // Create test employees
    const employee1 = await prisma.employee.create({
      data: {
        firstName: 'Alemitu',
        lastName: 'Kebede',
        email: 'alemitu.kebede@example.com',
        phone: '+251911234567',
        dateOfBirth: new Date('1995-05-15'),
        gender: 'female',
        nationality: 'Ethiopian',
        status: 'active',
        region: 'Addis Ababa',
        skills: ['housekeeping', 'cooking'],
        experienceLevel: 'intermediate',
      },
    });

    const employee2 = await prisma.employee.create({
      data: {
        firstName: 'Worku',
        lastName: 'Tesfaye',
        email: 'worku.tesfaye@example.com',
        phone: '+251911234568',
        dateOfBirth: new Date('1990-03-20'),
        gender: 'male',
        nationality: 'Ethiopian',
        status: 'pending',
        region: 'Oromia',
        skills: ['construction', 'agriculture'],
        experienceLevel: 'beginner',
      },
    });

    // Create test documents
    await prisma.document.create({
      data: {
        employeeId: employee1.id,
        type: 'passport',
        documentNumber: 'ET1234567',
        status: 'verified',
        uploadedAt: new Date(),
        verifiedAt: new Date(),
      },
    });

    await prisma.document.create({
      data: {
        employeeId: employee1.id,
        type: 'cv',
        status: 'pending',
        uploadedAt: new Date(),
      },
    });

    // Create test travel records
    await prisma.travelRecord.create({
      data: {
        employeeId: employee1.id,
        destination: 'Saudi Arabia',
        departureDate: new Date('2024-02-01'),
        status: 'confirmed',
      },
    });

    // Create test tasks
    await prisma.task.create({
      data: {
        title: 'Verify employee documents',
        description: 'Verify all documents for employee registration',
        assignedTo: adminUser.id,
        status: 'pending',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    });

    console.log('✅ Test data setup completed');
  } catch (error) {
    console.error('❌ Test data setup failed:', error);
    throw error;
  }
}

export default globalSetup;
