# Aethos Platform

**The Anti-Intranet: Enterprise SaaS Intelligence Layer for Microsoft 365**

[![Production Ready](https://img.shields.io/badge/status-production%20ready-success)](docs/README.md)
[![Version](https://img.shields.io/badge/version-V1--V4%20Complete-blue)](docs/AETHOS_PRODUCT_ROADMAP.md)
[![License](https://img.shields.io/badge/license-Proprietary-red)](ATTRIBUTIONS.md)

---

## 🚀 Quick Start

**New to Aethos? Start here:**

1. **[Get Started](GETTING_STARTED.md)** - Complete setup in 15 minutes
2. **[Product Spec](docs/AETHOS_CONSOLIDATED_SPEC_V2.md)** - What Aethos does
3. **[Code Maintenance Guide](CODE_MAINTENANCE_GUIDE.md)** - Daily workflow

**Ready to develop?**

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/aethos-platform.git
cd aethos-platform

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📋 What is Aethos?

Aethos is an enterprise SaaS platform that provides an intelligence layer on top of Microsoft 365 tenants, enabling organizations to:

- **Discover & Organize:** Scan Microsoft 365 for all files, workspaces, and content
- **Search Intelligently:** AI-powered semantic search ("What was the Q1 budget?")
- **Govern & Comply:** Automated retention policies (GDPR, HIPAA, SOC 2)
- **Integrate Everywhere:** Slack, Google Workspace, Box (multi-provider workspaces)
- **Scale for MSPs:** Cross-tenant search and management for 50+ organizations

---

## 🏗️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS v4
- **Backend:** Vercel Serverless Functions (Node.js)
- **Database:** Supabase PostgreSQL with Row-Level Security
- **Vector Search:** Supabase pgvector (AI+ features)
- **AI/ML:** OpenAI (embeddings + GPT-4o-mini)
- **Auth:** Microsoft Entra ID (MSAL.js)
- **OAuth:** Slack, Google Workspace, Box
- **Deployment:** Vercel Edge Network

---

## 📂 Project Structure

```
aethos-platform/
├── src/                          # Source code
│   ├── app/                      # React application
│   │   ├── components/           # Reusable components
│   │   ├── modules/              # Feature modules
│   │   ├── context/              # React context
│   │   └── services/             # API services
│   ├── lib/                      # Utility libraries
│   └── styles/                   # Tailwind CSS + themes
│
├── api/                          # Vercel serverless functions
├── supabase/                     # Database migrations
│   └── migrations/               # SQL migration files
│
├── docs/                         # Documentation
│   ├── 2-ARCHITECTURE/           # Architecture docs
│   └── 3-standards/              # Standards (24 files)
│
├── scripts/                      # Setup automation
│   ├── setup-supabase.bat        # Database setup
│   ├── create-env-file.bat       # Environment config
│   └── verify-setup.bat          # Health checks
│
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies
└── vite.config.ts                # Build configuration
```

---

## 📚 Documentation

### Essential Guides
- **[Getting Started](GETTING_STARTED.md)** - Complete setup guide
- **[Code Maintenance](CODE_MAINTENANCE_GUIDE.md)** - Daily workflow and sync
- **[Sync Workflow](SYNC_WORKFLOW_DIAGRAM.md)** - Visual workflow diagrams
- **[Quick Reference](QUICK_SYNC_REFERENCE.md)** - Git commands cheatsheet

### Product Documentation
- **[Product Spec V2](docs/AETHOS_CONSOLIDATED_SPEC_V2.md)** - Complete product specification
- **[Product Roadmap](docs/AETHOS_PRODUCT_ROADMAP.md)** - V1-V4 strategic roadmap
- **[Design System](docs/AETHOS_DESIGN_SYSTEM.md)** - Complete design reference
- **[Feature Matrix](docs/FEATURE_MATRIX.md)** - Feature comparison by version
- **[Pricing Strategy](docs/PRICING_STRATEGY_CLARITY.md)** - Pricing and revenue model

### Technical Documentation
- **[Backend Guide](docs/BACKEND_V1_V4_COMPLETE.md)** - Complete backend implementation (V1-V4)
- **[API Reference](docs/API_QUICK_REFERENCE.md)** - API endpoints and examples
- **[Database Setup](docs/SUPABASE_MASTER_SETUP_GUIDE.md)** - Supabase configuration
- **[Architecture](docs/2-ARCHITECTURE/SIMPLIFIED_ARCHITECTURE.md)** - System architecture
- **[Standards](docs/3-standards/README.md)** - 24 active standards

### Full Documentation Index
See **[docs/README.md](docs/README.md)** for the complete documentation index.

---

## ⚙️ Setup & Installation

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org))
- **pnpm** package manager (`npm install -g pnpm`)
- **Git** ([Download](https://git-scm.com))
- **Windows** (for PowerShell scripts - macOS/Linux scripts coming soon)

### Accounts Required

- **[Supabase](https://supabase.com)** (free tier)
- **[Microsoft Azure](https://azure.microsoft.com)** (for Entra ID)
- **[OpenAI](https://platform.openai.com)** (optional - AI+ features)
- **[Vercel](https://vercel.com)** (optional - deployment)

### Automated Setup (Recommended)

**Double-click to run:**

```
RUN_SETUP.bat
```

This wizard will:
1. Configure Git repository
2. Setup Supabase database (35 tables)
3. Create `.env` file with your credentials
4. Verify everything works

**Manual setup:** See **[GETTING_STARTED.md](GETTING_STARTED.md)** for detailed instructions.

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Microsoft Entra ID
VITE_MICROSOFT_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
VITE_MICROSOFT_TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# OpenAI (Optional - AI+ features)
OPENAI_API_KEY=sk-...
ENABLE_AI_FEATURES=true

# Environment
NODE_ENV=development
DEBUG=true
```

**⚠️ IMPORTANT:** Never commit `.env` to Git! (Protected by `.gitignore`)

---

## 🚀 Development

### Start Development Server

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

### Run Tests

```bash
pnpm test
```

---

## 🗄️ Database Setup

### Option 1: Automated (Recommended)

```bash
scripts\setup-supabase.bat
```

### Option 2: Manual

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create new project
3. SQL Editor → Run migrations:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/003_v15_to_v4_features.sql`

**Database includes:**
- 35 tables (20 base + 15 advanced features)
- Row-Level Security (RLS) policies
- pgvector extension for AI search
- Multi-tenant architecture

See **[Database Setup Guide](docs/SUPABASE_MASTER_SETUP_GUIDE.md)** for details.

---

## 🔄 Daily Workflow

### 1. Start Your Day

```bash
git pull origin main      # Get latest changes
pnpm install              # Update dependencies
pnpm dev                  # Start development
```

### 2. Make Changes

- Edit files in VS Code
- Save (auto-reload in browser)
- Test your changes

### 3. Commit Your Work

```bash
git add .
git commit -m "Description of changes"
git push origin main
```

**See [Code Maintenance Guide](CODE_MAINTENANCE_GUIDE.md) for complete workflow.**

---

## 🚢 Deployment

### Deploy to Vercel

1. Connect GitHub repository to Vercel
2. Add environment variables
3. Deploy!

**Every push to `main` = automatic deployment.**

See **[Getting Started Guide](GETTING_STARTED.md#deploy-to-production)** for step-by-step instructions.

---

## 📊 Feature Roadmap

| Version | Status | Key Features |
|---------|--------|--------------|
| **V1** | ✅ Production Ready | Microsoft 365 discovery, workspaces, metadata search |
| **V1.5** | ✅ Backend Complete | AI semantic search, content summarization, PII detection |
| **V2** | ✅ Backend Complete | Slack integration, Google Workspace, Box, multi-provider |
| **V3** | ✅ Backend Complete | Retention policies, compliance automation, anomaly detection |
| **V4** | ✅ Backend Complete | MSP federation, public API, webhooks, marketplace |

**Backend is production-ready for all versions. Frontend integration in progress.**

---

## 💰 Pricing Model

| Tier | Users | MRR | Features |
|------|-------|-----|----------|
| **Starter** | 1-250 | $797 | Base + AI+ + Slack |
| **Growth** | 251-1,000 | $1,496 | + Compliance |
| **Scale** | 1,001-2,500 | $2,196 | + Advanced features |
| **Enterprise** | 2,500+ | Custom | White-label, SLA |
| **MSP Platform** | Multi-tenant | $2,999+ | Cross-tenant search, API |

**Revenue Projection:**
- Month 12: $89,600 MRR ($1.07M ARR)
- Month 24: $313,800 MRR ($3.77M ARR)

See **[Pricing Strategy](docs/PRICING_STRATEGY_CLARITY.md)** for details.

---

## 🤝 Contributing

### Branching Strategy

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "Add: your feature"

# Push and create pull request
git push origin feature/your-feature
```

### Code Standards

- Follow **[Guidelines.md](guidelines/Guidelines.md)** for design system
- Follow **[Standards](docs/3-standards/README.md)** for development
- Write tests for new features
- Update documentation

---

## 🆘 Troubleshooting

### PowerShell Script Errors

**Solution:** Use batch file wrappers (`.bat`) instead of `.ps1` files:
- `RUN_SETUP.bat`
- `scripts\setup-supabase.bat`
- `scripts\create-env-file.bat`

### Database Connection Errors

Check:
- Supabase URL ends with `.supabase.co`
- Anon Key starts with `eyJ`
- Project not paused in Supabase dashboard

### Port Already in Use

```bash
npx kill-port 5173
```

### More Help

See **[Getting Started Guide](GETTING_STARTED.md#troubleshooting)** for complete troubleshooting.

---

## 📞 Support

- **Documentation:** [docs/README.md](docs/README.md)
- **GitHub Issues:** Report bugs and feature requests
- **Email:** engineering@aethos.com

---

## 📄 License

Proprietary - See [ATTRIBUTIONS.md](ATTRIBUTIONS.md) for third-party licenses.

---

## ✨ Status

**As of April 29, 2026:**

✅ **All V1-V4 backend features complete and production-ready**  
✅ **Database architecture validated (35 tables)**  
✅ **Documentation comprehensive**  
✅ **Automated setup scripts ready**

**The platform is ready for beta launch.** 🚀

---

**Built with ❤️ by the Aethos Team**
