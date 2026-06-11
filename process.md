# Kiler - Development Process & Architecture Guide

## Table of Contents
1. [Development Phases](#development-phases)
2. [Database Schema](#database-schema)
3. [RESTful API Endpoints](#restful-api-endpoints)
4. [User Flow & Use Cases](#user-flow--use-cases)
5. [System Architecture](#system-architecture)
6. [Data Flow Diagrams](#data-flow-diagrams)
7. [Future Scope & Enhancements](#future-scope--enhancements)

---

## Development Phases

### Sprint 1: Foundation & Authentication (Weeks 1-2)
**Goal**: Establish core infrastructure, user authentication, and basic UI framework.

#### Deliverables:
- User registration and login system with JWT authentication
- Email verification and password reset functionality
- User profile management (name, height, weight, age, activity level)
- Dashboard skeleton with responsive layout
- API route setup and error handling middleware
- Database schema initialization

#### Tasks:
- [ ] Set up Next.js app with TypeScript and Tailwind CSS
- [ ] Create PostgreSQL database and Prisma schema
- [ ] Implement JWT authentication with NextAuth.js
- [ ] Design and build login/registration forms
- [ ] Create user profile management page
- [ ] Set up CI/CD pipeline (optional: GitHub Actions)
- [ ] Write unit tests for auth routes

#### Acceptance Criteria:
- Users can register with unique email
- Password hashing implemented (bcrypt)
- JWT tokens valid and refreshable
- User data persists to database
- Protected routes require authentication

---

### Sprint 2: Financial Tracking & Pantry System (Weeks 3-4)
**Goal**: Implement receipt analysis and basic pantry inventory management.

#### Deliverables:
- Receipt upload and manual entry forms
- Financial dashboard with expense tracking
- Pantry inventory management interface
- Opportunity cost calculator
- Basic recipe matching algorithm

#### Tasks:
- [ ] Create receipt model and API endpoints
- [ ] Build receipt upload form (manual + image placeholder)
- [ ] Implement expense history tracking
- [ ] Design financial dashboard with charts
- [ ] Create opportunity cost calculation logic
- [ ] Build pantry inventory management UI
- [ ] Add ingredient quantity tracking
- [ ] Implement search and filter for ingredients

#### Acceptance Criteria:
- Users can input and view expense records
- Opportunity cost displayed in relatable terms (days of groceries, etc.)
- Pantry ingredients persist to database
- Users can add/update/delete ingredients
- Dashboard displays total expenses and trends

---

### Sprint 3: Recipe Generation & Nutrition (Weeks 5-6)
**Goal**: Build intelligent recipe suggestions and health tracking foundation.

#### Deliverables:
- Recipe database and matching algorithm
- Nutritional data integration
- Health profile and BMI calculator
- Personalized caloric needs calculation
- Basic diet plan recommendations

#### Tasks:
- [ ] Build recipe database with nutritional data
- [ ] Implement recipe matching algorithm (ingredient-based)
- [ ] Create recipe detail page with instructions and nutrition
- [ ] Build BMI calculator interface
- [ ] Implement daily/weekly caloric needs formula
- [ ] Create personalized nutrition recommendations
- [ ] Design diet plan UI (deficit/surplus/maintenance)
- [ ] Integrate external nutrition API (optional)

#### Acceptance Criteria:
- Users receive recipe suggestions based on pantry
- Nutritional info displays accurately per serving
- BMI calculated from height/weight input
- Caloric needs personalized to user profile
- Users can view and compare diet plans

---

### Sprint 4: Progress Tracking & Analytics (Weeks 7-8)
**Goal**: Add tracking, reporting, and advanced analytics features.

#### Deliverables:
- Progress tracking dashboard for health goals
- Weight and nutrition tracking over time
- Meal logging and macro tracking
- Financial analytics and spending reports
- Waste reduction metrics

#### Tasks:
- [ ] Create progress tracking UI with charts
- [ ] Implement weight/measurement logging
- [ ] Build meal logging interface
- [ ] Calculate and track macro compliance
- [ ] Create financial analytics dashboard
- [ ] Implement waste reduction score system
- [ ] Add data export functionality (PDF/CSV)
- [ ] Write integration tests

#### Acceptance Criteria:
- Users can log daily weight/measurements
- Historical data visualized in charts
- Macro compliance calculated daily
- Financial reports generated
- Waste metrics tracked and displayed

---

### Sprint 5: Advanced Features & Optimization (Weeks 9+)
**Goal**: Implement AI features, OCR, and system optimization.

#### Deliverables:
- OCR integration for automated receipt scanning
- AI-powered dietitian chatbot
- Meal plan generation from AI
- Performance optimization
- Mobile app version (React Native)

#### Tasks:
- [ ] Integrate OCR library for receipt images
- [ ] Build AI dietitian chatbot interface
- [ ] Implement meal plan generation AI
- [ ] Optimize database queries
- [ ] Implement caching layer (Redis)
- [ ] Create mobile version
- [ ] Load testing and performance tuning
- [ ] Security audit and penetration testing

#### Acceptance Criteria:
- OCR extracts items and totals from receipts
- Chatbot responds to nutrition questions
- Generated plans match user goals
- App loads in <2 seconds
- Mobile version functional on iOS/Android

---

## Database Schema

### Entity Relationship Diagram
```
Users
  ├── HealthProfiles (1:1)
  ├── PantryInventories (1:N)
  ├── Recipes (Favorites) (M:N)
  ├── FinancialLogs (1:N)
  ├── MealLogs (1:N)
  ├── WeightLogs (1:N)
  └── DietPlans (1:N)

Recipes
  ├── RecipeIngredients (1:N)
  ├── RecipeNutrition (1:1)
  └── RecipeMacros (1:1)

PantryInventories
  └── PantryItems (1:N)

Ingredients
  ├── IngredientNutrition (1:1)
  └── IngredientMacros (1:1)
```

### Core Tables

#### `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  profile_picture_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  INDEX idx_email (email)
);
```

#### `health_profiles`
```sql
CREATE TABLE health_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  height_cm DECIMAL(5, 2),
  weight_kg DECIMAL(6, 2),
  age INT,
  gender VARCHAR(20),
  activity_level VARCHAR(50), -- sedentary, light, moderate, very_active, extremely_active
  goal VARCHAR(50), -- lose_weight, gain_weight, maintain
  target_weight_kg DECIMAL(6, 2),
  target_caloric_intake INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id)
);
```

#### `pantry_inventories`
```sql
CREATE TABLE pantry_inventories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id)
);
```

#### `pantry_items`
```sql
CREATE TABLE pantry_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pantry_id UUID NOT NULL REFERENCES pantry_inventories(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id),
  quantity DECIMAL(10, 2),
  unit VARCHAR(50), -- grams, ml, cups, tbsp, tsp, pcs
  expiry_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_pantry_id (pantry_id),
  INDEX idx_ingredient_id (ingredient_id)
);
```

#### `ingredients`
```sql
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100), -- vegetables, fruits, proteins, grains, dairy, etc.
  is_common BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_category (category)
);
```

#### `recipes`
```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty_level VARCHAR(50), -- easy, medium, hard
  prep_time_minutes INT,
  cook_time_minutes INT,
  servings INT DEFAULT 1,
  instructions TEXT NOT NULL,
  image_url TEXT,
  source VARCHAR(255), -- e.g., API, user_submitted
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name)
);
```

#### `recipe_ingredients`
```sql
CREATE TABLE recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id),
  quantity DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  INDEX idx_recipe_id (recipe_id),
  INDEX idx_ingredient_id (ingredient_id),
  UNIQUE(recipe_id, ingredient_id)
);
```

#### `recipe_nutrition`
```sql
CREATE TABLE recipe_nutrition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID UNIQUE NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  calories INT,
  protein_g DECIMAL(8, 2),
  carbs_g DECIMAL(8, 2),
  fat_g DECIMAL(8, 2),
  fiber_g DECIMAL(8, 2),
  sodium_mg INT,
  per_serving BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_recipe_id (recipe_id)
);
```

#### `financial_logs`
```sql
CREATE TABLE financial_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount_usd DECIMAL(10, 2) NOT NULL,
  log_type VARCHAR(50), -- dining_out, grocery, other
  description VARCHAR(255),
  receipt_image_url TEXT,
  date TIMESTAMP NOT NULL,
  opportunity_cost_analysis JSONB, -- stores calculated opportunity costs
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_date (date)
);
```

#### `meal_logs`
```sql
CREATE TABLE meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id),
  meal_type VARCHAR(50), -- breakfast, lunch, dinner, snack
  logged_date DATE NOT NULL,
  servings_consumed DECIMAL(5, 2),
  calories_consumed INT,
  protein_g DECIMAL(8, 2),
  carbs_g DECIMAL(8, 2),
  fat_g DECIMAL(8, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_logged_date (logged_date),
  INDEX idx_recipe_id (recipe_id)
);
```

#### `weight_logs`
```sql
CREATE TABLE weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weight_kg DECIMAL(6, 2) NOT NULL,
  logged_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, logged_date),
  INDEX idx_user_id (user_id),
  INDEX idx_logged_date (logged_date)
);
```

#### `diet_plans`
```sql
CREATE TABLE diet_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goal_type VARCHAR(50), -- lose_weight, gain_weight, maintain
  daily_caloric_target INT NOT NULL,
  protein_target_g DECIMAL(8, 2),
  carbs_target_g DECIMAL(8, 2),
  fat_target_g DECIMAL(8, 2),
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_is_active (is_active)
);
```

#### `user_favorite_recipes`
```sql
CREATE TABLE user_favorite_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, recipe_id),
  INDEX idx_user_id (user_id)
);
```

---

## RESTful API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### POST `/auth/register`
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "jwt_token_here"
}
```

#### POST `/auth/login`
Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "token": "jwt_token_here"
}
```

#### POST `/auth/refresh-token`
Refresh expired JWT token.

**Request:**
```json
{
  "token": "jwt_token_here"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "new_jwt_token"
}
```

#### POST `/auth/logout`
Invalidate current session.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### User Endpoints

#### GET `/users/profile`
Retrieve authenticated user's profile.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "profilePictureUrl": "https://..."
  }
}
```

#### PUT `/users/profile`
Update user profile information.

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "profilePictureUrl": "https://..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": { /* updated profile */ }
}
```

---

### Health Profile Endpoints

#### POST `/health/profile`
Create or update health profile.

**Request:**
```json
{
  "heightCm": 180,
  "weightKg": 75,
  "age": 30,
  "gender": "male",
  "activityLevel": "moderate",
  "goal": "lose_weight",
  "targetWeightKg": 70
}
```

**Response (201 Created / 200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "bmi": 23.15,
    "dailyCaloricNeeds": 2400,
    "recommendedDeficit": 500,
    "targetCalories": 1900
  }
}
```

#### GET `/health/profile`
Retrieve user's health profile and metrics.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "heightCm": 180,
    "weightKg": 75,
    "bmi": 23.15,
    "dailyCaloricNeeds": 2400,
    "goal": "lose_weight",
    "targetCalories": 1900
  }
}
```

#### GET `/health/bmi`
Calculate BMI from height and weight.

**Query Parameters:**
- `heightCm` (number, required)
- `weightKg` (number, required)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "bmi": 23.15,
    "category": "normal_weight",
    "healthRisks": "low"
  }
}
```

---

### Pantry Endpoints

#### GET `/pantry`
Retrieve user's pantry inventory.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "items": [
      {
        "id": "uuid",
        "name": "Tomato",
        "category": "vegetables",
        "quantity": 5,
        "unit": "pcs",
        "expiryDate": "2026-06-20"
      }
    ]
  }
}
```

#### POST `/pantry/items`
Add ingredient to pantry.

**Request:**
```json
{
  "ingredientId": "uuid",
  "quantity": 5,
  "unit": "pcs",
  "expiryDate": "2026-06-20"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": { /* pantry item */ }
}
```

#### PUT `/pantry/items/:itemId`
Update pantry item.

**Request:**
```json
{
  "quantity": 3,
  "unit": "pcs"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": { /* updated item */ }
}
```

#### DELETE `/pantry/items/:itemId`
Remove ingredient from pantry.

**Response (204 No Content)**

---

### Recipe Endpoints

#### GET `/recipes`
List all recipes with optional filters.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `search` (string, optional)
- `difficulty` (string, optional)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Tomato Pasta",
      "description": "...",
      "difficultyLevel": "easy",
      "prepTimeMinutes": 10,
      "cookTimeMinutes": 15,
      "servings": 2,
      "imageUrl": "https://..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

#### GET `/recipes/suggested`
Get recipe suggestions based on pantry inventory.

**Query Parameters:**
- `matchPercentage` (number, default: 80) – Match threshold (0-100)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Tomato Pasta",
      "matchPercentage": 95,
      "missingIngredients": ["garlic"],
      "nutrition": {
        "calories": 350,
        "protein": 12,
        "carbs": 50,
        "fat": 8
      }
    }
  ]
}
```

#### GET `/recipes/:recipeId`
Retrieve detailed recipe information.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Tomato Pasta",
    "description": "...",
    "difficultyLevel": "easy",
    "prepTimeMinutes": 10,
    "cookTimeMinutes": 15,
    "servings": 2,
    "instructions": "1. Boil pasta...",
    "ingredients": [
      {
        "name": "Pasta",
        "quantity": 200,
        "unit": "grams"
      }
    ],
    "nutrition": {
      "caloriesPerServing": 350,
      "protein": 12,
      "carbs": 50,
      "fat": 8,
      "fiber": 2,
      "sodium": 400
    },
    "isFavorited": false
  }
}
```

#### POST `/recipes/:recipeId/favorite`
Add recipe to user's favorites.

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Recipe added to favorites"
}
```

#### DELETE `/recipes/:recipeId/favorite`
Remove recipe from favorites.

**Response (204 No Content)**

---

### Financial Endpoints

#### POST `/financial/logs`
Log a dining-out expense or receipt.

**Request:**
```json
{
  "amount": 25.50,
  "logType": "dining_out",
  "description": "Lunch at restaurant",
  "receiptImageUrl": "https://...",
  "date": "2026-06-11T12:00:00Z"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "amount": 25.50,
    "opportunityCostAnalysis": {
      "daysOfGroceries": 2.5,
      "mealEquivalent": 5,
      "investmentReturns": {
        "atTenPercent": 2.84,
        "atFivePercent": 1.42
      }
    }
  }
}
```

#### GET `/financial/logs`
Retrieve expense history.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `startDate` (ISO 8601 string, optional)
- `endDate` (ISO 8601 string, optional)
- `logType` (string, optional)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "amount": 25.50,
      "logType": "dining_out",
      "description": "...",
      "date": "2026-06-11T12:00:00Z",
      "opportunityCostAnalysis": { /* ... */ }
    }
  ],
  "pagination": { /* ... */ },
  "summary": {
    "totalExpenses": 250.00,
    "averagePerTransaction": 25.00,
    "totalOpportunityCost": 1250.00
  }
}
```

#### GET `/financial/analytics`
Retrieve financial analytics and reports.

**Query Parameters:**
- `period` (string: "week", "month", "year")

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "totalExpenses": 500.00,
    "averagePerDay": 16.67,
    "topCategories": [
      {
        "name": "dining_out",
        "total": 400.00,
        "percentage": 80
      }
    ],
    "trend": "increasing"
  }
}
```

---

### Meal Logging Endpoints

#### POST `/meals/log`
Log a consumed meal.

**Request:**
```json
{
  "recipeId": "uuid",
  "mealType": "lunch",
  "loggedDate": "2026-06-11",
  "servingsConsumed": 1.5,
  "notes": "Added extra vegetables"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "recipe": { /* recipe details */ },
    "caloriesConsumed": 525,
    "macros": {
      "protein": 18,
      "carbs": 75,
      "fat": 12
    }
  }
}
```

#### GET `/meals/log`
Retrieve meal logs for a specific date or date range.

**Query Parameters:**
- `date` (ISO 8601 string, required) OR
- `startDate` & `endDate` (ISO 8601 strings)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "recipe": { /* ... */ },
      "mealType": "lunch",
      "loggedDate": "2026-06-11",
      "caloriesConsumed": 525,
      "macros": { /* ... */ }
    }
  ],
  "dailySummary": {
    "totalCalories": 1950,
    "macroTarget": {
      "protein": 150,
      "carbs": 200,
      "fat": 65
    },
    "macroActual": {
      "protein": 145,
      "carbs": 195,
      "fat": 60
    },
    "compliancePercentage": 97
  }
}
```

#### DELETE `/meals/log/:logId`
Remove a logged meal.

**Response (204 No Content)**

---

### Weight Tracking Endpoints

#### POST `/health/weight`
Log daily weight.

**Request:**
```json
{
  "weightKg": 74.5,
  "loggedDate": "2026-06-11",
  "notes": "Morning measurement"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "weightKg": 74.5,
    "loggedDate": "2026-06-11",
    "changeFromPrevious": -0.5,
    "bmi": 23.02
  }
}
```

#### GET `/health/weight`
Retrieve weight history.

**Query Parameters:**
- `days` (number, default: 30) – Days of history to retrieve

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "weightKg": 74.5,
      "loggedDate": "2026-06-11",
      "bmi": 23.02
    }
  ],
  "summary": {
    "currentWeight": 74.5,
    "startWeight": 75.0,
    "totalChange": -0.5,
    "trend": "decreasing",
    "avgChangePerWeek": -0.125
  }
}
```

---

### Diet Plan Endpoints

#### POST `/diet-plans`
Create a personalized diet plan.

**Request:**
```json
{
  "goalType": "lose_weight",
  "dailyCaloricTarget": 1900,
  "proteinTargetG": 150,
  "carbsTargetG": 180,
  "fatTargetG": 65,
  "startDate": "2026-06-11",
  "endDate": "2026-09-11"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "goalType": "lose_weight",
    "dailyCaloricTarget": 1900,
    "macroTargets": { /* ... */ },
    "projectedResults": {
      "weightLossPerWeek": 0.5,
      "estimatedGoalDate": "2026-09-11"
    }
  }
}
```

#### GET `/diet-plans`
Retrieve active diet plan.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "goalType": "lose_weight",
    "dailyCaloricTarget": 1900,
    "macroTargets": { /* ... */ },
    "isActive": true,
    "startDate": "2026-06-11",
    "endDate": "2026-09-11"
  }
}
```

#### PUT `/diet-plans/:planId`
Update existing diet plan.

**Request:**
```json
{
  "dailyCaloricTarget": 1850,
  "proteinTargetG": 160
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": { /* updated plan */ }
}
```

---

## User Flow & Use Cases

### Use Case 1: New User Onboarding

**Flow:**
1. User visits app → registration page
2. Creates account with email and password
3. Redirected to health profile setup
4. Enters height, weight, age, activity level, and fitness goal
5. App calculates BMI and daily caloric needs
6. User sees personalized dashboard
7. Gets prompted to add pantry ingredients or log first expense

**Duration:** 5-7 minutes

---

### Use Case 2: Expense Tracking & Opportunity Cost

**Flow:**
1. User goes to "Expenses" section
2. Clicks "Log Expense" → selects "Dining Out"
3. Enters amount ($25.50) and date
4. (Future) Uploads receipt photo for OCR processing
5. App calculates opportunity costs:
   - "This meal costs 2.5 days of groceries"
   - "Could cover X meals at home"
   - "Or invest for passive income"
6. Expense saved to history
7. Dashboard updates with new total

**Duration:** 1-2 minutes

---

### Use Case 3: Smart Recipe Suggestion

**Flow:**
1. User navigates to "Smart Recipes"
2. System analyzes current pantry inventory
3. Lists recipes sorted by ingredient match %:
   - 100% match (all ingredients on hand)
   - 95% match (missing 1 item)
   - etc.
4. User selects a recipe → views detailed instructions + nutrition
5. Optionally adds to favorites
6. Can log meal consumption

**Duration:** 2-3 minutes

---

### Use Case 4: Health Tracking & Diet Plan

**Flow:**
1. User logs weight daily in "Health" section
2. Reviews BMI and caloric needs
3. Creates personalized diet plan (deficit, surplus, or maintenance)
4. Logs meals daily, system tracks macro compliance
5. Dashboard shows progress toward goal
6. Receives recommendations to stay on track

**Duration:** 2-5 minutes (daily habit)

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      Client Layer (Frontend)                     │
│  ┌──────────────────────┐      ┌──────────────────────────────┐ │
│  │    Next.js + React   │      │  Tailwind CSS + UI Library   │ │
│  │  - Pages & Routes    │      │  - Forms, Charts, Components │ │
│  │  - API Integration   │      │  - Responsive Design         │ │
│  └──────────────────────┘      └──────────────────────────────┘ │
└──────────────────────────┬───────────────────────────────────────┘
                           │ HTTPS
                           │ REST API
┌──────────────────────────────────────────────────────────────────┐
│                   Application Layer (Backend)                    │
│  ┌──────────────────────┐      ┌──────────────────────────────┐ │
│  │    Express.js        │      │    Middleware Layer          │ │
│  │  - Route Handlers    │      │  - Auth (JWT)                │ │
│  │  - Controllers       │      │  - Error Handling            │ │
│  │  - Business Logic    │      │  - Logging                   │ │
│  └──────────────────────┘      └──────────────────────────────┘ │
│                                                                  │
│  ┌──────────────────────┐      ┌──────────────────────────────┐ │
│  │  Services Layer      │      │   External Integrations      │ │
│  │  - Recipe Matching   │      │  - Nutrition API             │ │
│  │  - Financial Calc    │      │  - OCR Service (future)      │ │
│  │  - Health Analytics  │      │  - AI/ML Services (future)   │ │
│  └──────────────────────┘      └──────────────────────────────┘ │
└──────────────────────────┬───────────────────────────────────────┘
                           │
┌──────────────────────────────────────────────────────────────────┐
│              Data Access Layer (Prisma ORM)                      │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │          PostgreSQL Database                                 ││
│  │  - Users, Health Profiles, Pantry, Recipes, Transactions   ││
│  └──────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘
```

### Technology Stack Details

**Frontend (Next.js/React):**
- Server-side rendering for SEO
- Client-side state management (Context API / Zustand)
- Image optimization with Next.js Image
- Dynamic routes for recipes, users
- API Routes for serverless functions

**Backend (Node.js/Express):**
- RESTful API with standardized response format
- JWT authentication
- Input validation and sanitization
- Error handling middleware
- Logging and monitoring

**Database (PostgreSQL + Prisma):**
- ACID compliance for transactions
- Full-text search for recipes
- JSON columns for flexible data (opportunity cost analysis)
- Automatic migrations and schema management

---

## Data Flow Diagrams

### Receipt Analysis Flow

```
User Input (Manual/Receipt)
        │
        ↓
Parse & Validate Amount
        │
        ↓
Retrieve User Health Profile
        │
        ↓
Calculate Daily Grocery Cost
        │
        ↓
Calculate Opportunity Costs:
  - Days of Groceries
  - Meal Equivalents
  - Investment Returns
        │
        ↓
Store in Financial Logs
        │
        ↓
Update Dashboard & Analytics
```

### Recipe Suggestion Flow

```
User Navigates to "Smart Recipes"
        │
        ↓
Fetch Pantry Inventory
        │
        ↓
Query Recipe Database
        │
        ↓
For Each Recipe:
  Calculate Ingredient Match %
  Identify Missing Items
  Retrieve Nutritional Data
        │
        ↓
Sort by Match Percentage
        │
        ↓
Return Ranked Suggestions
```

### Meal Logging & Macro Tracking Flow

```
User Logs Meal (Recipe + Servings)
        │
        ↓
Fetch Recipe Nutrition Data
        │
        ↓
Calculate Consumed Macros:
  Calories = Nutrition × Servings
  Protein = Protein × Servings
  Carbs = Carbs × Servings
  Fat = Fat × Servings
        │
        ↓
Store Meal Log
        │
        ↓
Update Daily Summary:
  Total Calories
  Macro Totals
  Compliance %
        │
        ↓
Compare to Diet Plan Target
        │
        ↓
Provide Feedback & Recommendations
```

---

## Future Scope & Enhancements

### Phase 1: Core AI & Automation (Sprint 5-6)

#### OCR Receipt Scanning
- **Technology**: Google Vision API or Tesseract.js
- **Feature**: Upload receipt images → automatic extraction of items and total
- **Benefit**: Faster expense logging, reduced manual entry errors
- **Estimated Effort**: 2 weeks

#### AI-Powered Recipe Generation
- **Technology**: GPT-4 / Claude API with RAG for recipe context
- **Feature**: Generate new recipes based on pantry items + user preferences
- **Benefit**: Unlimited recipe variety, personalized suggestions
- **Estimated Effort**: 2-3 weeks

#### AI Dietitian Chatbot
- **Technology**: OpenAI GPT-4 with function calling
- **Feature**: Chat with AI for nutrition advice, meal planning, goal adjustment
- **Benefit**: 24/7 personalized guidance, improved user engagement
- **Estimated Effort**: 2 weeks

---

### Phase 2: Advanced Analytics & Insights (Sprint 7-8)

#### Predictive Analytics
- **Machine Learning Model**: Predict weight loss trajectory based on logging compliance
- **Feature**: "If you maintain current macros, you'll reach goal by [date]"
- **Technology**: Python ML service (scikit-learn, TensorFlow)
- **Estimated Effort**: 3 weeks

#### Social Features
- **Community Recipes**: Users share recipes, rate/review
- **Challenges**: Group weight loss/fitness challenges
- **Leaderboards**: Compete with friends on macro compliance, savings
- **Estimated Effort**: 2-3 weeks

#### Sustainability Metrics
- **CO₂ Impact**: Calculate environmental cost of meals
- **Waste Score**: Track % of ingredients used from pantry
- **Zero-Waste Goals**: Monthly sustainability challenges
- **Estimated Effort**: 2 weeks

---

### Phase 3: Mobile & Integration (Sprint 9+)

#### Native Mobile Apps
- **Technology**: React Native or Flutter
- **Platforms**: iOS and Android
- **Features**: Full feature parity with web, offline meal logging, push notifications
- **Estimated Effort**: 4-6 weeks

#### Smart Device Integration
- **Smart Scale**: Sync weight data automatically from Fitbit, Apple Health
- **Grocery Delivery APIs**: Link Instacart, Amazon Fresh for price comparison
- **Calendar Integration**: Sync meal plans with Google Calendar
- **Estimated Effort**: 2-3 weeks per integration

#### Barcode Scanning
- **Technology**: ZXing.js or native camera APIs
- **Feature**: Scan product barcodes to add to pantry automatically
- **Benefit**: Faster pantry updates, nutritional data auto-fetched
- **Estimated Effort**: 1-2 weeks

---

### Phase 4: Subscription & Monetization (Sprint 10+)

#### Premium Features
- **Advanced Analytics**: Detailed reports, trend analysis
- **Personalized Meal Plans**: AI-generated weekly meal plans
- **Priority Support**: 1-on-1 guidance from nutritionists
- **Pricing**: $9.99/month or $79.99/year

#### Partnerships
- **Grocery Retailers**: Exclusive discounts for logged expenses
- **Fitness Apps**: Integration with MyFitnessPal, Strava
- **Health Platforms**: Link to Apple Health, Google Fit

---

### Phase 5: Enterprise & B2B (Sprint 11+)

#### Corporate Wellness
- **Employer Dashboards**: Monitor team health metrics (anonymized)
- **Group Challenges**: Company-wide nutrition and fitness goals
- **Bulk Licensing**: Per-employee subscription model
- **Estimated Effort**: 4-5 weeks

#### Healthcare Provider Integration
- **HIPAA Compliance**: Secure data sharing with doctors/nutritionists
- **Treatment Plans**: Sync with provider-recommended diets
- **Insurance Integration**: Track adherence for wellness benefits
- **Estimated Effort**: 6-8 weeks

---

## Development Best Practices

### Code Quality
- **TypeScript**: Strict mode for type safety
- **ESLint**: Enforce code standards
- **Prettier**: Automatic code formatting
- **Jest**: Unit and integration tests (aim for 80%+ coverage)

### Database
- **Migrations**: Version-controlled with timestamps
- **Indexes**: Added on frequently queried columns
- **Backups**: Daily automated backups to cloud storage
- **Monitoring**: Query performance tracking with pg_stat_statements

### API Design
- **Versioning**: `/api/v1/` prefix for backward compatibility
- **Pagination**: Always include cursor-based or offset pagination
- **Rate Limiting**: Prevent abuse (100 req/min per user)
- **Documentation**: OpenAPI/Swagger spec for all endpoints

### Security
- **Input Validation**: Sanitize all user inputs server-side
- **CORS**: Whitelist trusted origins
- **HTTPS**: Enforce in production
- **Secrets Management**: Use environment variables, never hardcode credentials

---

## Deployment & DevOps

### Environments
- **Development**: Local machine with hot reload
- **Staging**: Production-like environment for testing
- **Production**: Live application serving real users

### CI/CD Pipeline
1. **Push** to GitHub
2. **Lint & Test**: Automated checks
3. **Build**: Compile TypeScript and bundle assets
4. **Deploy**: Push to staging first, then production on manual approval
5. **Monitor**: Track errors and performance metrics

### Monitoring & Observability
- **Error Tracking**: Sentry for exception monitoring
- **Performance**: Datadog or New Relic for APM
- **Logging**: Structured JSON logs to ELK stack
- **Uptime**: Pingdom or Uptime Robot for availability monitoring

---

**Document Version**: 1.0  
**Last Updated**: 2026-06-11  
**Maintained By**: Development Team  
**Next Review**: 2026-07-11
