# AGILITY dApp

## Overview
AGILITY is a Web3 payments application integrating fast XRPL payments, privacy-focused ZK-proofs (Midnight), Interledger Protocol interoperability, and Web3 domain integration. The project aims to provide a full-stack solution with a modern React frontend and an Express.js backend, featuring an advanced AI agent management system called VINE.MIND. The business vision is to create a seamless, privacy-enhanced Web3 payment experience with significant market potential in the decentralized finance space.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS with Shadcn/ui for consistent design (Dark theme: black/white/yellow color scheme)
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Build Tool**: Vite

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM (Neon Database for serverless PostgreSQL)
- **API Design**: RESTful API
- **Session Management**: In-memory storage (development)

### Key Features & Design Patterns
- **Agent Management (VINE.MIND)**: CRUD operations for AI agents, real-time chat, customization.
- **Agility Dashboard**: User interface for transaction summaries, privacy scores, KYC status.
- **Web3 Domain Management**: NFT-based domain registration and portfolio (frontend placeholder).
- **Payment System**: XRPL integration (frontend structure ready for backend).
- **Data Flow**: Frontend fetches via TanStack Query, RESTful APIs, real-time updates via optimistic UI.
- **State Management**: Server state via TanStack Query, UI state via React, form state via React Hook Form, Toast for feedback.
- **AI Integration**: OpenAI GPT-4o for agent responses, vector database with text embeddings (PostgreSQL), semantic search, real-time web search (Brave Search API) for document grounding and external data. Intent detection and intelligent speculation for AI agents.
- **UI/UX Decisions**: Dark theme, black/white/yellow color scheme. Consistent use of Shadcn/ui and TailwindCSS. Minimalist navigation with consistent branding. Cyberpunk aesthetic for VINE.MIND. Consistent use of yellow accents for branding.

## External Dependencies

### UI/UX Libraries
- Radix UI
- Shadcn/ui
- Lucide React
- Class Variance Authority

### Database & Backend
- Drizzle ORM
- Neon Database
- Zod
- Connect-pg-simple

### Development Tools
- Vite
- ESBuild
- PostCSS
- Autoprefixer

### AI/Search APIs
- OpenAI GPT-4o
- Brave Search API (for web search)