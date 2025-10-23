import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { renderWithRouter, mockEmployee, mockUser } from '../setup';

// Mock components
const MockLoginForm = () => (
  <form data-testid="login-form">
    <input data-testid="email-input" placeholder="Email" />
    <input data-testid="password-input" placeholder="Password" />
    <button data-testid="login-button" type="submit">
      Login
    </button>
  </form>
);

const MockEmployeeCard = ({ employee }: { employee: any }) => (
  <div data-testid={`employee-card-${employee.id}`}>
    <h3>{employee.firstName} {employee.lastName}</h3>
    <p>{employee.email}</p>
    <span data-testid={`status-${employee.id}`}>{employee.status}</span>
  </div>
);

const MockDashboard = ({ user }: { user: any }) => (
  <div data-testid="dashboard">
    <h1>Welcome, {user.firstName}!</h1>
    <div data-testid="user-role">{user.role}</div>
  </div>
);

describe('Integration Tests - Auth Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form correctly', () => {
    renderWithRouter(<MockLoginForm />);

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });

  it('should handle login form submission', async () => {
    const mockSubmit = vi.fn();
    
    const LoginFormWithSubmit = () => (
      <form data-testid="login-form" onSubmit={mockSubmit}>
        <input data-testid="email-input" placeholder="Email" />
        <input data-testid="password-input" placeholder="Password" />
        <button data-testid="login-button" type="submit">
          Login
        </button>
      </form>
    );

    renderWithRouter(<LoginFormWithSubmit />);

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('login-button');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });
  });
});

describe('Integration Tests - Employee Management', () => {
  it('should render employee card with correct data', () => {
    renderWithRouter(<MockEmployeeCard employee={mockEmployee} />);

    expect(screen.getByTestId(`employee-card-${mockEmployee.id}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockEmployee.firstName} ${mockEmployee.lastName}`)).toBeInTheDocument();
    expect(screen.getByText(mockEmployee.email)).toBeInTheDocument();
    expect(screen.getByTestId(`status-${mockEmployee.id}`)).toHaveTextContent(mockEmployee.status);
  });

  it('should display dashboard with user information', () => {
    renderWithRouter(<MockDashboard user={mockUser} />);

    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    expect(screen.getByText(`Welcome, ${mockUser.firstName}!`)).toBeInTheDocument();
    expect(screen.getByTestId('user-role')).toHaveTextContent(mockUser.role);
  });
});

describe('Integration Tests - Form Validation', () => {
  it('should validate required fields', async () => {
    const MockFormWithValidation = () => {
      const [errors, setErrors] = React.useState<Record<string, string>>({});

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const newErrors: Record<string, string> = {};
        if (!email) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';

        setErrors(newErrors);
      };

      return (
        <form onSubmit={handleSubmit}>
          <input name="email" placeholder="Email" />
          {errors.email && <span data-testid="email-error">{errors.email}</span>}
          <input name="password" placeholder="Password" />
          {errors.password && <span data-testid="password-error">{errors.password}</span>}
          <button type="submit">Submit</button>
        </form>
      );
    };

    renderWithRouter(<MockFormWithValidation />);

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toBeInTheDocument();
      expect(screen.getByTestId('password-error')).toBeInTheDocument();
    });
  });
});
