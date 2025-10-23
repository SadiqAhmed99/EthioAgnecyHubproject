# Ethio Agency Hub

A comprehensive digital management platform designed exclusively for Ethiopian foreign employment agencies to modernize their operations while maintaining complete autonomy and data privacy.

## 🚀 Features

### Core Modules
- **Dashboard**: Real-time KPIs, analytics, and system overview
- **Employee Management**: Complete registration, CV tools, and database management
- **Document Management**: Visa processing, MOLS integration, and verification systems
- **Travel Management**: Departure preparation, ticket management, and tracking
- **Hajj & Umrah**: Specialized pilgrimage management
- **Institution Management**: Partner organizations and collaboration tools
- **Agent Management**: Performance tracking and support systems
- **Administration**: User management, roles, and system configuration
- **Reporting & Analytics**: Comprehensive reporting and data export

### Key Features
- **100% Agency-Controlled**: Complete data privacy and autonomy
- **Role-Based Access Control**: Granular permissions system
- **Real-Time Updates**: Live data streaming and notifications
- **Mobile Responsive**: Works seamlessly on all devices
- **Multi-Language Support**: English and Arabic support
- **Document Verification**: Automated cross-matching and validation
- **Integration Ready**: MOLS and embassy system integration

## 🛠️ Technology Stack

- **Framework**: Remix (React Router v7)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with role permissions
- **Styling**: Tailwind CSS with custom components
- **Validation**: Zod schemas for type-safe forms
- **Testing**: Vitest for unit tests, Playwright for E2E
- **Deployment**: Docker-ready with environment configuration

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 13+
- npm or yarn

## 🚀 Getting Started

1. **Clone the repository**
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
   # Edit .env with your database and configuration details
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

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
app/
├── components/          # Reusable UI components
├── routes/             # Remix route files
├── models/             # TypeScript types and Zod schemas
├── services/           # Business logic layer
├── middleware/         # Authentication and permissions
├── lib/               # Shared libraries (Prisma, etc.)
├── utils/             # Utility functions
├── hooks/             # Custom React hooks
├── styles/            # Global styles and Tailwind
└── tests/             # Test files
```

## 🔐 Authentication & Permissions

The system uses a role-based access control system with the following roles:

- **SUPER_ADMIN**: Full system access
- **ADMIN**: Agency management and user administration
- **MANAGER**: Employee and document management
- **AGENT**: Employee registration and basic operations
- **VIEWER**: Read-only access

## 📊 Database Schema

The application uses Prisma with PostgreSQL and includes models for:

- Users and Agencies
- Employees and their profiles
- Documents and verification
- Travel and applications
- Hajj & Umrah management
- Institutions and partnerships
- Audit logs and system configuration

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run all tests
npm run test:all
```

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set up production environment**
   - Configure production database
   - Set environment variables
   - Set up file storage for uploads

3. **Deploy**
   ```bash
   npm run start
   ```

## 📝 API Documentation

The application follows Remix conventions with:
- Loader functions for data fetching
- Action functions for mutations
- Type-safe forms with Zod validation
- Streaming data with `defer()` for performance

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📊 Repository Stats

![GitHub stars](https://img.shields.io/github/stars/SadiqAhmed99/EthioAgnecyHubproject?style=social)
![GitHub forks](https://img.shields.io/github/forks/SadiqAhmed99/EthioAgnecyHubproject?style=social)
![GitHub issues](https://img.shields.io/github/issues/SadiqAhmed99/EthioAgnecyHubproject)
![GitHub pull requests](https://img.shields.io/github/issues-pr/SadiqAhmed99/EthioAgnecyHubproject)
![GitHub license](https://img.shields.io/github/license/SadiqAhmed99/EthioAgnecyHubproject)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
- **v1.1.0**: Added Hajj & Umrah management
- **v1.2.0**: Enhanced reporting and analytics
- **v1.3.0**: Mobile optimization and performance improvements

---

**Ethio Agency Hub** - Modernizing Ethiopian foreign employment agencies through technology.
