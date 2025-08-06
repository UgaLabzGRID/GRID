# V1 to V2 Migration Guide

## Overview

This guide provides step-by-step instructions for migrating the GRID platform from v1 to v2. The migration transforms a prototype application into a production-grade PWA with GCP backend infrastructure.

## Pre-Migration Checklist

### Requirements
- [ ] GCP account with billing enabled
- [ ] GitHub repository with Actions enabled
- [ ] Domain name with DNS control
- [ ] Team access to all required services
- [ ] Backup of all v1 data
- [ ] Migration timeline approved

### Team Preparation
- [ ] All developers have GCP access
- [ ] Terraform installed locally (v1.5+)
- [ ] gcloud CLI configured
- [ ] Node.js 20 LTS installed
- [ ] Docker Desktop installed

## Phase 1: Data Migration Planning

### 1.1 Data Audit
```sql
-- Analyze v1 data volume
SELECT 
  'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'agents', COUNT(*) FROM agents
UNION ALL
SELECT 'chat_messages', COUNT(*) FROM chat_messages
UNION ALL
SELECT 'documents', COUNT(*) FROM documents;

-- Check data integrity
SELECT 
  COUNT(*) as orphaned_messages
FROM chat_messages cm
LEFT JOIN users u ON cm.user_id = u.id
WHERE u.id IS NULL;
```

### 1.2 Data Transformation Script
```typescript
// scripts/migrate-data.ts
import { drizzle as v1Drizzle } from 'drizzle-orm/node-postgres';
import { drizzle as v2Drizzle } from 'drizzle-orm/node-postgres';
import { v1Schema } from '../v1/shared/schema';
import { v2Schema } from './src/db/schema';

async function migrateUsers() {
  const v1Users = await v1db.select().from(v1Schema.users);
  
  for (const user of v1Users) {
    // Transform v1 user to v2 format
    const v2User = {
      id: user.id,
      email: user.email.toLowerCase(),
      username: user.username,
      // Add new required fields
      emailVerified: false,
      createdAt: user.createdAt || new Date(),
      updatedAt: new Date(),
      // Hash existing passwords (if any)
      passwordHash: await hashPassword(user.password || generateTempPassword()),
    };
    
    await v2db.insert(v2Schema.users).values(v2User);
  }
}

async function migrateAgents() {
  // Similar transformation for agents
  const v1Agents = await v1db.select().from(v1Schema.agents);
  
  for (const agent of v1Agents) {
    const v2Agent = {
      ...agent,
      // Add new fields
      version: '1.0.0',
      capabilities: agent.tools || [],
      rateLimits: {
        requests: 100,
        window: '1h'
      }
    };
    
    await v2db.insert(v2Schema.agents).values(v2Agent);
  }
}
```

## Phase 2: Infrastructure Setup

### 2.1 GCP Project Initialization
```bash
# Create new GCP project
gcloud projects create grid-platform-v2 \
  --name="GRID Platform V2" \
  --organization=$ORG_ID

# Set as active project
gcloud config set project grid-platform-v2

# Enable billing
gcloud billing projects link grid-platform-v2 \
  --billing-account=$BILLING_ACCOUNT_ID

# Enable required APIs
./scripts/enable-apis.sh
```

### 2.2 Terraform Setup
```bash
# Initialize Terraform
cd infrastructure/terraform
terraform init

# Create workspaces
terraform workspace new dev
terraform workspace new staging
terraform workspace new prod

# Plan infrastructure
terraform workspace select dev
terraform plan -out=dev.tfplan

# Apply infrastructure
terraform apply dev.tfplan
```

### 2.3 Secrets Configuration
```bash
# Create secrets in Secret Manager
echo -n "your-database-password" | gcloud secrets create db-password --data-file=-
echo -n "your-jwt-secret" | gcloud secrets create jwt-secret --data-file=-
echo -n "your-openai-key" | gcloud secrets create openai-api-key --data-file=-

# Grant access to service accounts
gcloud secrets add-iam-policy-binding db-password \
  --member="serviceAccount:grid-cloud-run@grid-platform-v2.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## Phase 3: Application Migration

### 3.1 Code Structure Migration
```bash
# Create v2 application structure
mkdir -p v2/{services,packages,infrastructure,docs}

# Services structure
mkdir -p v2/services/{auth,api,ai,gateway}
mkdir -p v2/packages/{shared,ui-components,utils}

# Copy reusable components
cp -r v1/client/src/components/ui v2/packages/ui-components/
cp -r v1/shared v2/packages/shared/
```

### 3.2 Authentication Service Setup
```typescript
// v2/services/auth/src/index.ts
import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';

const app = fastify({ logger: true });

// Security plugins
app.register(cors, {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
});

app.register(jwt, {
  secret: process.env.JWT_SECRET,
  sign: { expiresIn: '1h' }
});

// Rate limiting
app.register(import('@fastify/rate-limit'), {
  max: 100,
  timeWindow: '1 minute'
});

// Health check
app.get('/health', async () => ({ status: 'healthy' }));

// Authentication endpoints
app.post('/register', async (request, reply) => {
  const { email, password, username } = request.body;
  
  // Validate input
  if (!email || !password || !username) {
    return reply.code(400).send({ error: 'Missing required fields' });
  }
  
  // Check if user exists
  const existing = await db.query.users.findFirst({
    where: eq(users.email, email)
  });
  
  if (existing) {
    return reply.code(409).send({ error: 'User already exists' });
  }
  
  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);
  
  // Create user
  const [user] = await db.insert(users).values({
    email,
    username,
    passwordHash
  }).returning();
  
  // Generate tokens
  const accessToken = app.jwt.sign({ 
    userId: user.id,
    email: user.email 
  });
  
  const refreshToken = app.jwt.sign(
    { userId: user.id },
    { expiresIn: '7d' }
  );
  
  // Store refresh token
  await redis.setex(`refresh:${user.id}`, 604800, refreshToken);
  
  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      username: user.username
    }
  };
});

app.post('/login', async (request, reply) => {
  const { email, password } = request.body;
  
  // Find user
  const user = await db.query.users.findFirst({
    where: eq(users.email, email)
  });
  
  if (!user) {
    return reply.code(401).send({ error: 'Invalid credentials' });
  }
  
  // Verify password
  const valid = await bcrypt.compare(password, user.passwordHash);
  
  if (!valid) {
    return reply.code(401).send({ error: 'Invalid credentials' });
  }
  
  // Generate tokens
  const accessToken = app.jwt.sign({ 
    userId: user.id,
    email: user.email 
  });
  
  return { accessToken };
});

// Start server
const start = async () => {
  try {
    await app.listen({ 
      port: process.env.PORT || 8080,
      host: '0.0.0.0'
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
```

### 3.3 PWA Implementation
```typescript
// v2/apps/web/next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.grid\.platform\/.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 // 1 hour
        },
        networkTimeoutSeconds: 10
      }
    },
    {
      urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
        }
      }
    }
  ]
});

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    domains: ['storage.googleapis.com'],
    formats: ['image/avif', 'image/webp']
  },
  experimental: {
    appDir: true
  }
});
```

```json
// v2/apps/web/public/manifest.json
{
  "name": "GRID Platform",
  "short_name": "GRID",
  "description": "AI-powered collaborative platform",
  "theme_color": "#000000",
  "background_color": "#ffffff",
  "display": "standalone",
  "orientation": "portrait",
  "scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "shortcuts": [
    {
      "name": "New Chat",
      "short_name": "Chat",
      "description": "Start a new AI chat",
      "url": "/chat/new",
      "icons": [{ "src": "/icons/chat.png", "sizes": "192x192" }]
    },
    {
      "name": "Dashboard",
      "short_name": "Dashboard",
      "url": "/dashboard",
      "icons": [{ "src": "/icons/dashboard.png", "sizes": "192x192" }]
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/desktop.png",
      "type": "image/png",
      "sizes": "1920x1080",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/mobile.png",
      "type": "image/png",
      "sizes": "390x844",
      "form_factor": "narrow"
    }
  ],
  "categories": ["productivity", "utilities"],
  "iarc_rating_id": "e84b072d-71b3-4d3e-86ae-31a8ce4e53b7"
}
```

## Phase 4: Database Migration

### 4.1 Schema Updates
```sql
-- v2/migrations/001_initial_schema.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table with enhanced security
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  mfa_enabled BOOLEAN DEFAULT FALSE,
  mfa_secret VARCHAR(255),
  last_login_at TIMESTAMPTZ,
  last_login_ip INET,
  failed_login_attempts INT DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Audit logging
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table for JWT refresh tokens
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  refresh_token VARCHAR(500) UNIQUE NOT NULL,
  device_info JSONB,
  ip_address INET,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_username ON users(username) WHERE deleted_at IS NULL;
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Row-level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY users_select ON users FOR SELECT USING (
  auth.uid() = id OR auth.has_role('admin')
);

CREATE POLICY users_update ON users FOR UPDATE USING (
  auth.uid() = id
);
```

### 4.2 Data Migration Execution
```bash
#!/bin/bash
# scripts/migrate-database.sh

set -e

echo "Starting database migration..."

# 1. Create v2 database
gcloud sql databases create grid_v2 --instance=grid-db-prod

# 2. Run schema migrations
npm run migrate:deploy

# 3. Export v1 data
pg_dump $V1_DATABASE_URL \
  --data-only \
  --exclude-table=migrations \
  > v1_data.sql

# 4. Transform and import data
node scripts/transform-data.js < v1_data.sql > v2_data.sql
psql $V2_DATABASE_URL < v2_data.sql

# 5. Verify data integrity
node scripts/verify-migration.js

# 6. Create indexes
psql $V2_DATABASE_URL < migrations/indexes.sql

echo "Migration completed successfully!"
```

## Phase 5: Testing & Validation

### 5.1 Test Suite Setup
```typescript
// v2/tests/e2e/auth.test.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should register new user', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="username"]', 'testuser');
    await page.fill('[name="password"]', 'SecurePass123!');
    
    await page.click('[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toContainText('testuser');
  });
  
  test('should handle login with MFA', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[name="email"]', 'mfa@example.com');
    await page.fill('[name="password"]', 'password');
    
    await page.click('[type="submit"]');
    
    // MFA step
    await expect(page).toHaveURL('/login/mfa');
    await page.fill('[name="code"]', '123456');
    await page.click('[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
  });
});
```

### 5.2 Performance Testing
```javascript
// v2/tests/performance/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp to 200
    { duration: '5m', target: 200 }, // Stay at 200
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],   // Error rate under 1%
  },
};

export default function () {
  // Login
  const loginRes = http.post('https://api.grid.platform/auth/login', {
    email: 'test@example.com',
    password: 'password',
  });
  
  check(loginRes, {
    'login successful': (r) => r.status === 200,
    'token received': (r) => r.json('accessToken') !== '',
  });
  
  const token = loginRes.json('accessToken');
  
  // API requests
  const headers = { Authorization: `Bearer ${token}` };
  
  const apiRes = http.get('https://api.grid.platform/api/agents', { headers });
  
  check(apiRes, {
    'API response OK': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

## Phase 6: Deployment

### 6.1 Staging Deployment
```bash
#!/bin/bash
# scripts/deploy-staging.sh

set -e

echo "Deploying to staging environment..."

# 1. Build and push Docker images
docker build -t gcr.io/grid-platform-v2/auth:staging -f services/auth/Dockerfile .
docker build -t gcr.io/grid-platform-v2/api:staging -f services/api/Dockerfile .
docker build -t gcr.io/grid-platform-v2/ai:staging -f services/ai/Dockerfile .

docker push gcr.io/grid-platform-v2/auth:staging
docker push gcr.io/grid-platform-v2/api:staging
docker push gcr.io/grid-platform-v2/ai:staging

# 2. Deploy to Cloud Run
gcloud run deploy grid-auth-staging \
  --image gcr.io/grid-platform-v2/auth:staging \
  --platform managed \
  --region us-central1 \
  --no-traffic

gcloud run deploy grid-api-staging \
  --image gcr.io/grid-platform-v2/api:staging \
  --platform managed \
  --region us-central1 \
  --no-traffic

# 3. Run smoke tests
npm run test:smoke -- --env=staging

# 4. If tests pass, route traffic
if [ $? -eq 0 ]; then
  gcloud run services update-traffic grid-auth-staging --to-latest
  gcloud run services update-traffic grid-api-staging --to-latest
  echo "Staging deployment successful!"
else
  echo "Smoke tests failed, traffic not routed"
  exit 1
fi
```

### 6.2 Production Deployment
```bash
#!/bin/bash
# scripts/deploy-production.sh

set -e

echo "Starting production deployment..."

# 1. Confirm deployment
read -p "Deploy to production? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  exit 1
fi

# 2. Create backup
./scripts/backup-production.sh

# 3. Deploy with canary release
gcloud run deploy grid-auth-prod \
  --image gcr.io/grid-platform-v2/auth:$VERSION \
  --platform managed \
  --region us-central1 \
  --tag canary \
  --no-traffic

# 4. Route 10% traffic to canary
gcloud run services update-traffic grid-auth-prod \
  --to-tags canary=10

# 5. Monitor for 30 minutes
echo "Monitoring canary deployment..."
sleep 1800

# 6. Check metrics
ERROR_RATE=$(gcloud monitoring read \
  --filter="resource.type=\"cloud_run_revision\" AND metric.type=\"run.googleapis.com/request_count\"" \
  --format="value(point.value.distribution_value.mean)")

if (( $(echo "$ERROR_RATE < 0.01" | bc -l) )); then
  echo "Canary healthy, promoting to 100%..."
  gcloud run services update-traffic grid-auth-prod --to-latest
else
  echo "High error rate detected, rolling back..."
  gcloud run services update-traffic grid-auth-prod --to-revisions PREVIOUS=100
  exit 1
fi

echo "Production deployment complete!"
```

## Phase 7: Cutover

### 7.1 DNS Migration
```bash
# Update DNS records
gcloud dns record-sets transaction start --zone=grid-platform

# Add new A record for v2
gcloud dns record-sets transaction add \
  --name=api.grid.platform. \
  --ttl=300 \
  --type=A \
  --zone=grid-platform \
  $V2_IP_ADDRESS

# Commit changes
gcloud dns record-sets transaction execute --zone=grid-platform
```

### 7.2 Traffic Migration
```nginx
# nginx configuration for gradual migration
upstream v1_backend {
  server v1.grid.platform:5000;
}

upstream v2_backend {
  server v2.grid.platform:8080;
}

# Split traffic based on cookie
map $cookie_version $backend {
  default v1_backend;
  "v2"    v2_backend;
}

server {
  listen 443 ssl;
  server_name api.grid.platform;
  
  location / {
    proxy_pass http://$backend;
  }
}
```

### 7.3 Monitoring During Cutover
```typescript
// monitoring/cutover-dashboard.ts
import { MetricServiceClient } from '@google-cloud/monitoring';

const client = new MetricServiceClient();

async function monitorCutover() {
  const metrics = [
    'request_count',
    'error_rate',
    'latency_p95',
    'active_users',
    'database_connections'
  ];
  
  for (const metric of metrics) {
    const [timeSeries] = await client.listTimeSeries({
      name: client.projectPath(projectId),
      filter: `metric.type="${metric}"`,
      interval: {
        endTime: { seconds: Date.now() / 1000 },
        startTime: { seconds: Date.now() / 1000 - 3600 }
      }
    });
    
    console.log(`${metric}: ${JSON.stringify(timeSeries)}`);
  }
}

// Monitor every minute during cutover
setInterval(monitorCutover, 60000);
```

## Post-Migration Tasks

### Cleanup
```bash
# 1. Verify v2 is stable (wait 1 week)
./scripts/verify-stability.sh

# 2. Backup v1 data
gsutil -m cp -r gs://grid-v1-data gs://grid-archive/v1-final/

# 3. Decommission v1 infrastructure
terraform workspace select v1
terraform destroy -auto-approve

# 4. Update documentation
./scripts/update-docs.sh

# 5. Archive v1 code
git tag -a v1-final -m "Final v1 version before migration"
git push origin v1-final
```

### Success Metrics
- [ ] Zero data loss during migration
- [ ] 99.9% uptime maintained
- [ ] Page load time < 3 seconds
- [ ] All users successfully migrated
- [ ] No critical bugs in first week
- [ ] Cost within 20% of estimate

## Rollback Plan

### Emergency Rollback Procedure
```bash
#!/bin/bash
# scripts/emergency-rollback.sh

echo "EMERGENCY ROLLBACK INITIATED"

# 1. Stop v2 traffic immediately
gcloud run services update-traffic grid-auth-prod --to-revisions v1=100
gcloud run services update-traffic grid-api-prod --to-revisions v1=100

# 2. Restore v1 database
gcloud sql backups restore $V1_BACKUP_ID --restore-instance=grid-db-prod

# 3. Update DNS
gcloud dns record-sets transaction start --zone=grid-platform
gcloud dns record-sets transaction remove \
  --name=api.grid.platform. \
  --ttl=300 \
  --type=A \
  --zone=grid-platform \
  $V2_IP_ADDRESS

gcloud dns record-sets transaction add \
  --name=api.grid.platform. \
  --ttl=300 \
  --type=A \
  --zone=grid-platform \
  $V1_IP_ADDRESS

gcloud dns record-sets transaction execute --zone=grid-platform

# 4. Notify team
./scripts/notify-rollback.sh

echo "Rollback complete. V1 is now active."
```

## Support Documentation

### Common Issues and Solutions

#### Issue: Users can't login after migration
```bash
# Check auth service logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=grid-auth-prod" --limit 50

# Verify JWT secret is correct
gcloud secrets versions list jwt-secret

# Test authentication endpoint
curl -X POST https://api.grid.platform/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

#### Issue: Slow API responses
```bash
# Check Cloud Run metrics
gcloud monitoring dashboards list
gcloud monitoring dashboards describe $DASHBOARD_ID

# Analyze slow queries
gcloud sql operations list --instance=grid-db-prod
gcloud sql operations describe $OPERATION_ID

# Scale up if needed
gcloud run services update grid-api-prod --min-instances=5
```

#### Issue: PWA not installing
```javascript
// Debug PWA installation
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    console.log('SW registered:', registration);
  });
  
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('Install prompt fired');
    e.preventDefault();
    // Show custom install button
  });
}
```

## Team Contacts

### Escalation Path
1. **L1 Support**: DevOps on-call (PagerDuty)
2. **L2 Support**: Backend Team Lead
3. **L3 Support**: Platform Architect
4. **Emergency**: CTO + Infrastructure Lead

### Key Resources
- GCP Console: https://console.cloud.google.com
- Monitoring Dashboard: https://monitoring.grid.platform
- Runbooks: https://docs.grid.platform/runbooks
- Status Page: https://status.grid.platform

---

*Migration Guide Version: 1.0*  
*Last Updated: January 2025*  
*Next Review: February 2025*