# Kiler - Smart Pantry & Financial Wellness Platform

> **Kiler** (Pantry) is an intelligent, all-in-one application designed to build financial awareness, promote zero-waste living through smart recipe generation, and enable personalized health & diet tracking.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

## 🎯 Project Vision

Kiler empowers users to take control of three critical life dimensions:

1. **Financial Awareness** – Understand the true cost of dining out through opportunity analysis
2. **Household Sustainability** – Reduce food waste by intelligently matching available ingredients to recipes
3. **Personal Health** – Achieve nutrition goals through data-driven, personalized diet planning

By integrating these features into a seamless experience, Kiler transforms how people relate to food, money, and wellness.

---

## ✨ Core Features

### 1. Receipt Analysis & Financial Roadmap
- **Manual & Photo Input**: Users enter expenses directly or scan receipt images
- **Opportunity Cost Calculation**: Quantify dining-out expenses in relatable terms (e.g., "This meal costs X days of groceries")
- **Alternative Financial Insights**: Display micro-investment potential, savings impact, and meal-planning alternatives
- **Expense History Tracking**: Maintain comprehensive records of all dining-out transactions

### 2. Smart Pantry & Recipe Generator (Zero-Waste Focus)
- **Ingredient Inventory**: Add and manage current household ingredients with quantities
- **Intelligent Recipe Matching**: Generate recipes using available ingredients (prioritizing 100% matches, with flexibility for minor substitutions)
- **Nutritional Data**: Display calories, macronutrients (protein, carbs, fats), micronutrients per serving
- **Step-by-Step Cooking Instructions**: Detailed, beginner-friendly guidance for recipe preparation
- **Waste Reduction Metrics**: Track the environmental and economic impact of recipe choices

### 3. Health, Diet & Goal Tracking
- **BMI Calculator**: Input height and weight to assess body composition
- **Daily/Weekly Caloric Needs**: Automated calculation based on BMI, age, activity level, and goals
- **Personalized Nutrition Plans**:
  - Caloric deficit strategies for weight loss
  - Caloric surplus plans for muscle gain
  - Maintenance plans for stable weight
- **Progress Monitoring**: Track compliance, weight changes, and macro/micro nutrient intake over time
- **Goal Customization**: Users set personal fitness, health, or dietary milestones

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14+ | React framework with SSR, SSG, and API routes |
| | React 18+ | UI component library |
| | TypeScript | Type-safe development |
| | Tailwind CSS | Utility-first styling |
| **Backend** | Node.js (18+) | Runtime environment |
| | Express.js | RESTful API framework |
| | TypeScript | Type safety and developer experience |
| **Database** | PostgreSQL 14+ | Relational database |
| | Prisma ORM | Database abstraction and migrations |
| **Authentication** | JWT / NextAuth.js | Secure session management |
| **File Storage** | AWS S3 / Local | Receipt image storage |
| **Deployment** | Vercel / Docker | Production environment |

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**: Package manager
- **PostgreSQL**: v14 or higher
- **Git**: Version control

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/kiler-app.git
cd kiler-app
```

### Step 2: Install Dependencies
```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### Step 3: Environment Configuration
Create a `.env.local` file in the root directory:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/kiler_db

# Authentication
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# File Storage (optional)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=kiler-receipts

# External APIs
NUTRITION_API_KEY=your-nutrition-api-key
```

### Step 4: Set Up the Database
```bash
# Run Prisma migrations
npx prisma migrate dev --name init

# Seed initial data (optional)
npm run seed
```

### Step 5: Start Development Server
```bash
# Development mode with hot reload
npm run dev

# The app will be available at http://localhost:3000
```

### Step 6: (Optional) Start Backend Server Separately
If running Node.js backend independently:
```bash
cd server
npm install
npm run dev
# Backend will run on http://localhost:5000
```

---

## 📁 Project Folder Structure

```
kiler-app/
├── apps/
│   ├── web/                          # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/                  # Next.js app directory (pages & routes)
│   │   │   │   ├── layout.tsx        # Root layout
│   │   │   │   ├── page.tsx          # Home page
│   │   │   │   ├── auth/             # Authentication pages
│   │   │   │   ├── dashboard/        # Main user dashboard
│   │   │   │   ├── receipt/          # Receipt analysis pages
│   │   │   │   ├── pantry/           # Smart pantry management
│   │   │   │   ├── recipes/          # Recipe browsing & suggestions
│   │   │   │   ├── health/           # Health tracking & goals
│   │   │   │   └── api/              # API routes
│   │   │   ├── components/           # Reusable React components
│   │   │   │   ├── shared/           # Shared UI components
│   │   │   │   ├── forms/            # Form components
│   │   │   │   ├── charts/           # Data visualization
│   │   │   │   └── layouts/          # Layout wrappers
│   │   │   ├── hooks/                # Custom React hooks
│   │   │   ├── lib/                  # Utility functions & helpers
│   │   │   ├── services/             # API client services
│   │   │   ├── context/              # Context providers
│   │   │   ├── types/                # TypeScript interfaces
│   │   │   └── styles/               # Global styles
│   │   ├── public/                   # Static assets
│   │   ├── next.config.js            # Next.js configuration
│   │   ├── tailwind.config.ts        # Tailwind CSS config
│   │   └── package.json
│   │
│   └── server/                       # Node.js backend (optional monorepo)
│       ├── src/
│       │   ├── routes/               # API route handlers
│       │   │   ├── auth.ts           # Authentication routes
│       │   │   ├── receipts.ts       # Receipt endpoints
│       │   │   ├── pantry.ts         # Pantry endpoints
│       │   │   ├── recipes.ts        # Recipe endpoints
│       │   │   ├── health.ts         # Health tracking endpoints
│       │   │   └── users.ts          # User management
│       │   ├── controllers/          # Business logic layer
│       │   ├── models/               # Database models
│       │   ├── middleware/           # Express middleware
│       │   ├── services/             # External service integrations
│       │   ├── utils/                # Helper functions
│       │   └── index.ts              # Server entry point
│       ├── prisma/
│       │   ├── schema.prisma         # Database schema
│       │   └── migrations/           # Migration history
│       ├── .env.local                # Environment variables
│       └── package.json
│
├── docs/                             # Documentation
│   ├── process.md                    # Architecture & roadmap
│   ├── api-spec.md                   # Detailed API documentation
│   └── database-schema.md            # Database entity relationships
│
├── README.md                         # This file
├── package.json                      # Root package configuration
├── tsconfig.json                     # TypeScript configuration
├── .gitignore
└── .env.local                        # Environment variables (Git-ignored)
```

---

## 🚀 Quick Start Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (frontend + backend) |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run lint` | Run ESLint and TypeScript checks |
| `npm run test` | Execute test suite |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

---

## 🔐 Authentication & Security

- **JWT Tokens**: Secure, stateless authentication
- **Password Hashing**: bcrypt with salt rounds (12)
- **Environment Variables**: Sensitive data stored securely
- **CORS Protection**: Configured for trusted origins
- **Rate Limiting**: API endpoints protected against abuse
- **Input Validation**: Server-side validation on all endpoints

---

## 📊 Development Status

| Feature | Status | Sprint |
|---------|--------|--------|
| User Authentication | ⏳ In Progress | Sprint 1 |
| Receipt Upload & Analysis | ⏳ In Progress | Sprint 1 |
| Financial Dashboard | 📋 Planned | Sprint 2 |
| Pantry Inventory System | ⏳ In Progress | Sprint 2 |
| Recipe Generator (Basic) | 📋 Planned | Sprint 2 |
| Health & BMI Tracking | 📋 Planned | Sprint 3 |
| Nutrition Planning | 📋 Planned | Sprint 3 |
| OCR Integration | 🔄 Backlog | Sprint 4+ |
| AI Dietitian Bot | 🔄 Backlog | Sprint 5+ |

**Legend**: ⏳ = In Progress | 📋 = Planned | 🔄 = Backlog

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** changes: `git commit -m "feat: description of changes"`
4. **Push** to branch: `git push origin feature/your-feature`
5. **Submit** a Pull Request with detailed description

### Code Standards
- Use **TypeScript** for type safety
- Follow **ESLint** and **Prettier** configurations
- Write **unit tests** for new features
- Maintain **responsive design** for mobile/desktop
- Document **complex logic** with comments

---

## 📝 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 👥 Contributors

- **[Your Name]** – Project Lead & Full-Stack Developer
- **[Contributor Name]** – Backend Engineer
- **[Contributor Name]** – Frontend Developer

**Want to contribute?** We're actively looking for developers, designers, and nutrition experts. Feel free to reach out or check our [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 💬 Support & Contact

- **Issues**: Report bugs or request features via [GitHub Issues](https://github.com/yourusername/kiler-app/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/yourusername/kiler-app/discussions)
- **Email**: contact@kiler-app.com

---

## 🙏 Acknowledgments

- PostgreSQL community for robust database solutions
- Next.js and React teams for excellent frameworks
- Prisma for intuitive ORM tools
- Tailwind CSS for utility-first styling

---

**Built with ❤️ by the Kiler Team**
