# Split Bill Application

A simple and minimalist bill splitting application built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL.

## Features

- Step-by-step bill creation flow
- Add people and menu items
- Assign menu items to multiple people (with automatic equal splits)
- Calculate tax, service charges, and discounts
- 30-day bill history sidebar
- Clean, minimalist sky blue/white design
- Database storage for future ML analysis

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your PostgreSQL database and create a `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/splitbill?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

3. Initialize the database:
```bash
npx prisma migrate dev --name init
```

4. Generate Prisma Client:
```bash
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Register a new account or log in
2. Click "New Bill" to start creating a split bill
3. Follow the 5-step process:
   - Step 1: Add people joining the bill
   - Step 2: Add menu items and their prices
   - Step 3: Assign items to people (items can be shared)
   - Step 4: Enter tax, service, and discount percentages
   - Step 5: Review the final summary and save

The sidebar shows your bill history from the last 30 days (filterable by 7, 14, or 30 days).

## Database Schema

The application stores:
- User accounts
- Bills with tax/service/discount percentages
- People per bill
- Menu items per bill
- Assignments (which person ordered which item with share percentages)

This structure enables future ML analysis of spending habits.# split-bill-app
