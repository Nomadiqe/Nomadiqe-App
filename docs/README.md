# Nomadiqe Documentation

Welcome to the Nomadiqe App documentation! This directory contains comprehensive guides and references for developers working on or deploying the Nomadiqe platform.

## 📚 Documentation Index

### Getting Started

- **[Quick Start: Social Auth](./QUICKSTART_SOCIAL_AUTH.md)** - Fast setup guide for OAuth authentication
- **[Vercel Deployment](./VERCEL_SETUP.md)** - Complete guide for deploying to Vercel

### Feature Documentation

- **[Geocoding Service](./GEOCODING.md)** - Automatic address-to-coordinates conversion
  - How the geocoding service works
  - Multi-level fallback strategy
  - Admin interface for manual coordinate setting
  - Troubleshooting and API reference

- **[Social Authentication](./SOCIAL_AUTH_SETUP.md)** - OAuth setup for Google, Facebook, and Apple
  - Provider configuration guides
  - Callback URL setup
  - Testing and troubleshooting

- **[Points System](./POINTS_SYSTEM_DESIGN.md)** - Gamification and rewards system
  - Points structure and rules
  - Daily check-ins and bonuses
  - Testing guide available in [POINTS_SYSTEM_TESTING_GUIDE.md](./POINTS_SYSTEM_TESTING_GUIDE.md)

### Migration & Database

- **[Supabase Migration](./migration/)** - Complete migration from NextAuth/Neon to Supabase
  - Migration success report and verification
  - OAuth account linking setup and testing
  - SQL scripts and database configuration
  - See [migration/README.md](./migration/README.md) for complete documentation

### Maintenance & Reference

- **[Changelog](./CHANGELOG.md)** - Version history and feature additions
- **[Fixes Applied](./FIXES_APPLIED.md)** - Historical bug fixes and solutions
- **[Database Branch Merging](./DATABASE_BRANCH_MERGING.md)** - Neon database branch management

## 🚀 Quick Links

### For Developers
- Setting up OAuth? Start with [QUICKSTART_SOCIAL_AUTH.md](./QUICKSTART_SOCIAL_AUTH.md)
- Working with maps? See [GEOCODING.md](./GEOCODING.md)
- Deployment issues? Check [VERCEL_SETUP.md](./VERCEL_SETUP.md)
- Understanding the migration? See [migration/SUPABASE_MIGRATION_SUCCESS.md](./migration/SUPABASE_MIGRATION_SUCCESS.md)
- Configuring account linking? See [migration/ACCOUNT_LINKING_QUICK_REFERENCE.md](./migration/ACCOUNT_LINKING_QUICK_REFERENCE.md)

### For Administrators
- Managing properties without map coordinates? See [Geocoding - Admin Interface](./GEOCODING.md#admin-interface)
- Setting up social login? See [Social Auth Setup](./SOCIAL_AUTH_SETUP.md)
- Enabling OAuth account linking? See [migration/OAUTH_ACCOUNT_LINKING_SETUP.md](./migration/OAUTH_ACCOUNT_LINKING_SETUP.md)

### For DevOps
- Deploying to production? Follow [VERCEL_SETUP.md](./VERCEL_SETUP.md)
- Environment variables? Check [Social Auth Setup - Environment Variables](./SOCIAL_AUTH_SETUP.md)
- Supabase configuration? See [migration/](./migration/)

## 📖 Documentation Standards

All documentation in this directory follows these principles:

1. **Clear Structure**: Each document has a table of contents and logical sections
2. **Code Examples**: Practical examples are provided where relevant
3. **Troubleshooting**: Common issues and solutions are documented
4. **Up-to-date**: Documentation is updated with each feature change

## 🤝 Contributing to Documentation

When adding or updating documentation:

1. Keep explanations clear and concise
2. Include code examples where helpful
3. Add troubleshooting sections for common issues
4. Update this README.md with links to new docs
5. Update CHANGELOG.md with notable changes

## 📞 Need Help?

If you can't find what you're looking for:

1. Check the [Changelog](./CHANGELOG.md) for recent updates
2. Review [Fixes Applied](./FIXES_APPLIED.md) for known issues
3. Search existing documentation using `Ctrl+F` or `Cmd+F`
4. Consult the main [README](../README.md) for project overview

---

**Last Updated**: November 2025
**Maintained by**: Nomadiqe Development Team
