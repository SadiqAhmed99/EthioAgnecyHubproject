import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../../services/auth/authService.server';
import { employeeService } from '../../services/employee/employeeService.server';
import { documentService } from '../../services/documents/documentService.server';

// Mock Prisma
const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  employee: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  document: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};

vi.mock('../../lib/prisma.server', () => ({
  prisma: mockPrisma,
}));

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      role: 'admin' as const,
    };

    mockPrisma.user.create.mockResolvedValue({
      id: '1',
      ...userData,
      password: 'hashed_password',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await authService.createUser(userData);

    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
      }),
    });

    expect(result).toHaveProperty('id');
    expect(result.email).toBe(userData.email);
  });

  it('should authenticate user with valid credentials', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    mockPrisma.user.findUnique.mockResolvedValue({
      id: '1',
      email: credentials.email,
      password: '$2b$10$hashed_password',
      firstName: 'Test',
      lastName: 'User',
      role: 'admin',
    });

    // Mock bcrypt
    vi.mock('bcryptjs', () => ({
      compare: vi.fn().mockResolvedValue(true),
    }));

    const result = await authService.authenticateUser(credentials);

    expect(result).toHaveProperty('user');
    expect(result.user.email).toBe(credentials.email);
  });
});

describe('Employee Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get all employees', async () => {
    const mockEmployees = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        status: 'active',
      },
    ];

    mockPrisma.employee.findMany.mockResolvedValue(mockEmployees);

    const result = await employeeService.getAllEmployees();

    expect(mockPrisma.employee.findMany).toHaveBeenCalled();
    expect(result).toEqual(mockEmployees);
  });

  it('should create a new employee', async () => {
    const employeeData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '+251911234567',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'female' as const,
      nationality: 'Ethiopian',
    };

    mockPrisma.employee.create.mockResolvedValue({
      id: '1',
      ...employeeData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await employeeService.createEmployee(employeeData);

    expect(mockPrisma.employee.create).toHaveBeenCalledWith({
      data: employeeData,
    });

    expect(result).toHaveProperty('id');
    expect(result.firstName).toBe(employeeData.firstName);
  });
});

describe('Document Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get documents by employee', async () => {
    const employeeId = '1';
    const mockDocuments = [
      {
        id: '1',
        employeeId,
        type: 'passport',
        status: 'verified',
        uploadedAt: new Date(),
      },
    ];

    mockPrisma.document.findMany.mockResolvedValue(mockDocuments);

    const result = await documentService.getDocumentsByEmployee(employeeId);

    expect(mockPrisma.document.findMany).toHaveBeenCalledWith({
      where: { employeeId },
    });
    expect(result).toEqual(mockDocuments);
  });

  it('should update document status', async () => {
    const documentId = '1';
    const status = 'verified';

    mockPrisma.document.update.mockResolvedValue({
      id: documentId,
      status,
      verifiedAt: new Date(),
    });

    const result = await documentService.updateDocumentStatus(documentId, status);

    expect(mockPrisma.document.update).toHaveBeenCalledWith({
      where: { id: documentId },
      data: { status, verifiedAt: expect.any(Date) },
    });

    expect(result.status).toBe(status);
  });
});
