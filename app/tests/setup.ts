import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock Remix modules
vi.mock('@remix-run/react', () => ({
  useLoaderData: vi.fn(),
  useActionData: vi.fn(),
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

// Test utilities
export const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

// Mock data
export const mockEmployee = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+251911234567',
  status: 'active',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockUser = {
  id: '1',
  email: 'admin@example.com',
  role: 'admin',
  firstName: 'Admin',
  lastName: 'User',
};

export const mockDocument = {
  id: '1',
  employeeId: '1',
  type: 'passport',
  status: 'verified',
  uploadedAt: new Date('2024-01-01'),
  verifiedAt: new Date('2024-01-01'),
};

// Test helpers
export const createMockLoaderData = (data: any) => {
  return {
    ...data,
    meta: {
      title: 'Test Page',
      description: 'Test description',
    },
  };
};

// Common test patterns
export const expectElementToBeInDocument = (text: string) => {
  expect(screen.getByText(text)).toBeInTheDocument();
};

export const expectElementToHaveClass = (element: HTMLElement, className: string) => {
  expect(element).toHaveClass(className);
};
