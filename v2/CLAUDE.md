# Claude Project Configuration - Node.js

## Project Overview
**Type**: Node.js/JavaScript Project  
**Initialized**: 2025-08-05  
**Node Version**: [VERSION]  
**Package Manager**: npm/yarn/pnpm  
**Purpose**: [Brief project description]

## Key Directories
- `/docs` - Comprehensive project documentation (SINGLE docs directory at project root)
- `/src` - Source code (TypeScript/JavaScript)
- `/tests` or `/test` - Test suites (unit, integration, e2e)
- `/public` - Static assets (if applicable)
- `/dist` or `/build` - Compiled output
- `/scripts` - Build and utility scripts
- `/config` - Configuration files
- `/.github` - GitHub workflows and actions

**IMPORTANT DOCUMENTATION STRUCTURE:**
- **ALWAYS use a single `/docs` directory at the project root level**
- **NEVER create additional docs directories in subdirectories (e.g., NOT in /src/docs)**
- **All documentation should be organized within the root `/docs` directory**
- If you need to organize docs by component, use subdirectories within `/docs` (e.g., `/docs/api/`, `/docs/components/`)

## Development Workflow

### 1. Before Starting Work
```bash
# Check Node version
node --version
npm --version

# Install dependencies
npm install  # or yarn install

# Check for outdated packages
npm outdated
npm audit  # Security check

# Review recent changes
git log --oneline -20
git status

# Start development environment
npm run dev
```

### 2. During Development
- Use ESLint and Prettier for code quality
- Write tests alongside new features
- Update JSDoc comments
- Keep package.json scripts current
- Monitor bundle size for production builds

### 3. Documentation Standards

**CRITICAL: Documentation Directory Structure**
- **USE ONLY ONE `/docs` directory at the project root**
- **DO NOT create separate docs directories in subfolders like /src/docs**
- **Example of CORRECT structure:**
  ```
  project-root/
  ├── docs/           # ✅ ONLY docs directory
  │   ├── API.md
  │   ├── ARCHITECTURE.md
  │   └── components/ # ✅ Organize within /docs
  ├── src/           # ❌ NO docs/ subdirectory here
  └── README.md
  ```

**Always update:**
- API documentation when endpoints change
- README.md for new environment variables
- CHANGELOG.md for new features/fixes
- JSDoc comments for public functions
- TypeScript types/interfaces

## Authorized Commands

### NPM/Package Management
```bash
# Dependencies
npm install package-name
npm install --save-dev package-name
npm uninstall package-name
npm update
npm audit fix
npm fund
npm ls --depth=0

# Scripts
npm run dev
npm run build
npm run test
npm run test:watch
npm run test:coverage
npm run lint
npm run lint:fix
npm run format
npm run typecheck
npm run preview
npm start

# Package info
npm info package-name
npm view package-name versions
npm pack
npm publish --dry-run

# Workspaces (if monorepo)
npm run build --workspace=package-name
npm install package-name --workspace=workspace-name
```

### Node.js Specific
```bash
# Node execution
node index.js
node --inspect index.js  # With debugger
node --trace-warnings index.js
node --max-old-space-size=4096 index.js

# NPX commands
npx create-react-app my-app
npx prisma migrate dev
npx prisma generate
npx tsc --init
npx eslint --init
npx prettier --write .
npx jest --clearCache
npx depcheck

# Process management
pm2 start app.js
pm2 list
pm2 logs
pm2 restart app
pm2 stop app
```

### Testing & Quality
```bash
# Jest
npm test
npm test -- --watch
npm test -- --coverage
npm test -- --updateSnapshot
npm test -- path/to/test

# Other test runners
npm run test:unit
npm run test:integration
npm run test:e2e
npm run cypress:open
npm run cypress:run

# Code quality
npm run lint
npm run lint:fix
npm run format
npm run prettier
npm run eslint src/
npx prettier --check .
npx eslint . --ext .js,.jsx,.ts,.tsx

# Type checking
npm run typecheck
npx tsc --noEmit
npx tsc --project tsconfig.json
```

### Build & Deployment
```bash
# Development
npm run dev
npm run serve
npm run watch

# Production
npm run build
npm run build:prod
npm run build:analyze
npm run preview

# Bundle analysis
npm run analyze
npx webpack-bundle-analyzer stats.json

# Environment
export NODE_ENV=production
export NODE_ENV=development
export PORT=3000
```

### Database & ORM
```bash
# Prisma
npx prisma init
npx prisma migrate dev --name migration-name
npx prisma migrate deploy
npx prisma generate
npx prisma studio
npx prisma db push
npx prisma db seed

# TypeORM
npm run typeorm migration:create -- -n MigrationName
npm run typeorm migration:run
npm run typeorm migration:revert

# Sequelize
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npx sequelize-cli migration:generate --name migration-name
```

### Framework-Specific

#### Express.js
```bash
# Development
npm run dev
npm run dev:debug
DEBUG=app:* npm start

# Production
npm run build
npm start
NODE_ENV=production npm start
```

#### Next.js
```bash
# Development
npm run dev
npm run dev -- -p 3001  # Custom port

# Production
npm run build
npm run start
npm run export

# Analysis
npm run analyze
npm run lint:next
```

#### React
```bash
# Development
npm start
npm run start -- --port 3001

# Production
npm run build
npm run serve

# Testing
npm test
npm test -- --coverage --watchAll=false
```

### Git Workflow for Node.js
```bash
# Feature development
git checkout -b feature/add-api-endpoint
npm install  # Always after branch switch
npm run dev

# Before committing
npm run lint:fix
npm run format
npm test
npm run build  # Ensure it builds

# Commit with conventional commits
git add .
git commit -m "feat(api): add user authentication endpoint"
git commit -m "fix(auth): resolve token expiration issue"
git commit -m "docs(api): update swagger documentation"
git commit -m "test(auth): add integration tests for login"
git commit -m "chore(deps): update dependencies"
```

### Debugging
```bash
# Node debugging
node --inspect index.js
node --inspect-brk index.js  # Break on first line
kill -USR1 <pid>  # Enable debugger on running process

# Memory debugging
node --expose-gc --max-old-space-size=8192 index.js
node --trace-gc index.js

# Chrome DevTools
# Open chrome://inspect after running with --inspect

# VS Code debugging
# Use launch.json configuration
```

### Performance & Monitoring
```bash
# Performance
npm run lighthouse
npm run benchmark
time npm run build

# Bundle size
npm run size
npm run analyze
du -sh dist/

# Memory usage
node --expose-gc script.js
process.memoryUsage()
```

## Environment Configuration

### Essential Environment Variables
```bash
# .env.example
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
API_KEY=your-api-key
LOG_LEVEL=debug
```

### Configuration Files
- `.env.local` - Local development overrides
- `.env.test` - Test environment
- `.env.production` - Production settings
- `.npmrc` - NPM configuration
- `.nvmrc` - Node version specification

## TypeScript Configuration
```json
// tsconfig.json best practices
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist"
  }
}
```

## Package.json Scripts Template
```json
{
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,md}\"",
    "typecheck": "tsc --noEmit",
    "prepare": "husky install",
    "pre-commit": "lint-staged"
  }
}
```

### Performance Optimization through Concurrency
When working on tasks that involve multiple independent operations:
1. **Always use subagents (Task tool) for parallel execution** when possible
2. **Launch multiple agents concurrently** for tasks like:
   - Searching for different patterns or files simultaneously
   - Analyzing multiple components independently
   - Performing batch operations on different parts of the codebase
3. **Maximize performance** by identifying tasks that can run in parallel
4. **Avoid sequential operations** when concurrent execution is possible
5. **Example scenarios for concurrent subagents:**
   - Searching for multiple keywords across the codebase
   - Reading and analyzing multiple configuration files
   - Checking different directories for specific patterns
   - Running independent analysis tasks

## Security Best Practices
1. Keep dependencies updated: `npm audit fix`
2. Use environment variables for secrets
3. Implement rate limiting
4. Validate and sanitize inputs
5. Use HTTPS in production
6. Implement proper authentication
7. Follow OWASP guidelines for Node.js

## Quick Reference

### Daily Commands
```bash
npm run dev         # Start development
npm test           # Run tests
npm run lint:fix   # Fix linting issues
npm run build      # Build for production
git status         # Check changes
```

### Emergency Commands
```bash
rm -rf node_modules package-lock.json && npm install  # Reset dependencies
npm cache clean --force  # Clear npm cache
npx kill-port 3000  # Kill process on port
npm run build -- --clean  # Clean build
```

## Team Memory Integration

### Project Memory Structure
Your project has been initialized with a team memory system:
- **Project ID**: Unique identifier for this project
- **Memory Location**: `~/.claude/projects/{project_id}/`
- **Namespaces**: `project:{project_id}:*` for all project data

### Memory Categories
- **Architecture Decisions**: `project:{project_id}:architecture:*`
- **Feature Tracking**: `project:{project_id}:features:*`
- **Code Patterns**: `project:{project_id}:patterns:*`
- **Security Policies**: `project:{project_id}:security:*`
- **AI Integration**: `project:{project_id}:ai:*`

### Using Team Memory
```bash
# Start team development
/team "Build REST API with authentication"

# Check project status
/team-status

# Create checkpoint
/team-checkpoint

# View all projects
/team-projects
```

## Core Development Principles

### 📚 Documentation Excellence
- **Single Source of Truth**: All documentation lives in `/docs`
- **Real-time Sync**: Update docs alongside code changes
- **Automated Cleanup**: Regular pruning of outdated content
- **Version Control**: Documentation versioned with code

### 🔬 Research-First Development
- **Mandatory Documentation Review**: Before ANY implementation
- **Official Package Documentation**: Always consult npm docs
- **Deep Internet Research**: Best practices and edge cases
- **Team Knowledge Sharing**: Document findings in `/docs/research/`

### 🧪 Testing-First Development (TDD)
- **Write Tests First**: No code without tests
- **Coverage Target**: Minimum 80% code coverage
- **Test Categories**:
  - Unit Tests: 60% of test suite
  - Integration Tests: 30% of test suite
  - E2E Tests: 10% of test suite
- **Performance Tests**: For critical paths

### 🤖 AI-First Development
- **Ethical AI Integration**: Safety and bias review required
- **Prompt Engineering Excellence**: Optimized, tested prompts
- **Safety by Design**: Built-in guardrails and monitoring
- **Transparent AI**: Users always know when AI is involved

## Development Standards

### Documentation Standards
See `/docs/standards/documentation-standards.md` for:
- Writing style guide
- Document templates
- API documentation format
- Code documentation requirements
- README standards

### Testing Protocols
See `/docs/standards/testing-protocols.md` for:
- TDD workflow
- Test organization
- Coverage requirements
- Performance benchmarks
- API testing standards

### AI Integration Protocols
See `/docs/standards/ai-integration-protocols.md` for:
- Feature development lifecycle
- Safety testing checklist
- Bias audit requirements
- Deployment stages
- Incident response

### Research Protocol
See `/docs/standards/research-protocol.md` for:
- Pre-implementation research
- Documentation review checklist
- Research documentation template
- Quality standards

## Error Handling Standards

### ❌ Never Do This
```javascript
try {
  await apiCall();
} catch (error) {
  // Silent failure - debugging nightmare!
}
```

### ✅ Always Do This
```javascript
try {
  await apiCall();
} catch (error) {
  // Log for developers
  logger.error('API call failed', {
    error: error.message,
    stack: error.stack,
    context: { endpoint, userId }
  });
  
  // Handle specific errors
  if (error.code === 'ECONNREFUSED') {
    return res.status(503).json({ error: 'Service temporarily unavailable' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else {
    return res.status(500).json({ error: 'Internal server error' });
  }
  
  // Report to error tracking
  await errorTracker.report(error);
}
```

## Notes
- Always run `npm install` after pulling changes
- Check `npm audit` regularly for security issues
- Keep Node.js version consistent across team
- Document all environment variables
- Test production builds locally before deploying
- Follow team standards in `/docs/standards/`
- Use team memory for persistent context