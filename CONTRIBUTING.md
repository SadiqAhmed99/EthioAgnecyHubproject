# Contributing to Ethio Agency Hub

Thank you for your interest in contributing to the Ethio Agency Hub project! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 13+
- npm or yarn
- Git

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/SadiqAhmed99/EthioAgnecyHubproject.git
   cd EthioAgnecyHubproject
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 📝 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

### Project Structure
```
app/
├── components/     # Reusable UI components
├── routes/         # Remix route files
├── models/         # TypeScript types and Zod schemas
├── services/       # Business logic layer
├── middleware/     # Authentication and permissions
├── lib/           # Shared libraries
├── utils/         # Utility functions
└── styles/        # Global styles
```

### Database Changes
- Always create migrations for schema changes
- Use Prisma for database operations
- Test migrations on development database first

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# All tests
npm run test:all
```

### Writing Tests
- Write tests for new features
- Maintain test coverage above 80%
- Use descriptive test names
- Test both success and error cases

## 📋 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, well-documented code
   - Add tests for new functionality
   - Update documentation if needed

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Provide a clear description
   - Link any related issues
   - Request review from maintainers

## 🐛 Bug Reports

When reporting bugs, please include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots if applicable

## 💡 Feature Requests

For feature requests, please:
- Describe the feature clearly
- Explain the use case
- Consider implementation complexity
- Check if similar features exist

## 📚 Documentation

- Update README.md for significant changes
- Document new API endpoints
- Add JSDoc comments for complex functions
- Update type definitions

## 🔒 Security

- Report security vulnerabilities privately
- Don't commit sensitive information
- Use environment variables for secrets
- Follow security best practices

## 📞 Support

- GitHub Issues for bug reports and feature requests
- Discussions for general questions
- Email: support@ethioagencyhub.com

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Thank you for contributing to Ethio Agency Hub! 🎉
