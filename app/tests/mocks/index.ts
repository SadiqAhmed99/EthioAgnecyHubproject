// Mock data for testing
export const mockEmployees = [
  {
    id: '1',
    firstName: 'Alemitu',
    lastName: 'Kebede',
    email: 'alemitu.kebede@example.com',
    phone: '+251911234567',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    firstName: 'Worku',
    lastName: 'Tesfaye',
    email: 'worku.tesfaye@example.com',
    phone: '+251911234568',
    status: 'pending',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

export const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
  },
  {
    id: '2',
    email: 'agent@example.com',
    role: 'agent',
    firstName: 'Agent',
    lastName: 'User',
  },
];

export const mockDocuments = [
  {
    id: '1',
    employeeId: '1',
    type: 'passport',
    status: 'verified',
    uploadedAt: new Date('2024-01-01'),
    verifiedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    employeeId: '1',
    type: 'cv',
    status: 'pending',
    uploadedAt: new Date('2024-01-02'),
  },
];

export const mockTravelRecords = [
  {
    id: '1',
    employeeId: '1',
    destination: 'Saudi Arabia',
    departureDate: new Date('2024-02-01'),
    status: 'confirmed',
  },
];

export const mockHajjUmrahRecords = [
  {
    id: '1',
    pilgrimId: '1',
    type: 'hajj',
    year: 2024,
    status: 'registered',
  },
];

// Mock server responses
export const mockServerResponses = {
  login: {
    success: {
      user: mockUsers[0],
      token: 'mock-jwt-token',
    },
    error: {
      message: 'Invalid credentials',
    },
  },
  employees: {
    list: mockEmployees,
    create: mockEmployees[0],
    update: { ...mockEmployees[0], firstName: 'Updated Name' },
  },
  documents: {
    list: mockDocuments,
    upload: mockDocuments[0],
    verify: { ...mockDocuments[0], status: 'verified' },
  },
};

// Mock file uploads
export const mockFileUploads = {
  passport: {
    name: 'passport.pdf',
    type: 'application/pdf',
    size: 1024000,
  },
  cv: {
    name: 'cv.pdf',
    type: 'application/pdf',
    size: 512000,
  },
  photo: {
    name: 'photo.jpg',
    type: 'image/jpeg',
    size: 256000,
  },
};

// Mock API responses
export const mockApiResponses = {
  '/api/auth/login': {
    POST: mockServerResponses.login.success,
  },
  '/api/employees': {
    GET: mockServerResponses.employees.list,
    POST: mockServerResponses.employees.create,
  },
  '/api/documents': {
    GET: mockServerResponses.documents.list,
    POST: mockServerResponses.documents.upload,
  },
};

// Mock Prisma responses
export const mockPrismaResponses = {
  user: {
    findUnique: mockUsers[0],
    create: mockUsers[0],
    findMany: mockUsers,
  },
  employee: {
    findUnique: mockEmployees[0],
    create: mockEmployees[0],
    findMany: mockEmployees,
    update: mockEmployees[0],
  },
  document: {
    findUnique: mockDocuments[0],
    create: mockDocuments[0],
    findMany: mockDocuments,
    update: mockDocuments[0],
  },
};

// Mock environment variables
export const mockEnv = {
  DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
  JWT_SECRET: 'test-jwt-secret',
  SESSION_SECRET: 'test-session-secret',
  NODE_ENV: 'test',
};

// Mock external service responses
export const mockExternalServices = {
  mols: {
    connection: { status: 'connected', timestamp: new Date() },
    sync: { success: true, count: 5 },
  },
  email: {
    send: { success: true, messageId: 'mock-message-id' },
  },
  sms: {
    send: { success: true, messageId: 'mock-sms-id' },
  },
};
