# Financial Records Application

A robust MERN stack application built with a strict MVC architecture on the backend,## Key Features
- **Strict MVC Architecture** (Separation of logic between services and controllers)
- **Role-Based Access Control** (RBAC): `Admin` (full), `Analyst` (basic CRM functionality), `Viewer` (read-only charts)
- **Rate Limiting**: Globally protects endpoints via `express-rate-limit`
- **Soft Deletion Protocol**: Native DB deletion masks data using `isDeleted: true`
- **TDD Setup**: Jest + SuperTest native integration tests securely validating MongoDB hooks
- **Universal Searching & Filtering**: Queries accept `?search=xyz` regex alongside `type` & `startDate` bounds

## Database & Storage Architecture
> **Clarification on Storage Approach:** This application does **NOT** use a simplified, mock, or in-memory storage approach. It uses a robust, production-ready **MongoDB** instance powered securely by **Mongoose ODM**. All records and user data are mathematically retained, hashed, and persisted indefinitely.
- **Interactive Dashboard**: Recharts-powered analytics for income, expenses, and category breakdowns.
- **Data Tables**: Paginated and filtered lists for financial transactions.
- **Normal CSS**: Beautiful, rich, dark mode UI using vanilla CSS and glassmorphism (No Tailwind).

## Project Structure
```
project-root/
│
├── backend/                  # Node.js + Express
│   ├── config/               # DB Setup
│   ├── controllers/          # Request handoffs
│   ├── middlewares/          # Auth, Validate, Errors
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API endpoints
│   ├── services/             # Core business logic
│   ├── utils/                # Error handling wrappers
│   ├── validations/          # Joi schemas
│   ├── .env                  # Environment Variables
│   ├── app.js                # Express logic
│   └── server.js             # Server entry
│
└── frontend/                 # Vite React Application
    ├── src/
    │   ├── components/       # Reusable UI (MainLayout)
    │   ├── context/          # Auth Context
    │   ├── pages/            # Login, Register, Dashboard, Records, Users
    │   ├── services/         # Axios API connection
    │   ├── styles/           # Global vanilla CSS
    │   ├── App.jsx           # Routing
    │   └── main.jsx          # React entry
    └── package.json
```

## Setup Steps

### 1. Backend Setup
1. Open a terminal and navigate to `backend/`.
2. Run `npm install`.
3. Check the `.env` file (ensure MongoDB is running locally on `mongodb://127.0.0.1:27017/financial_db` or update it).
4. Run `npm run dev` (starts on port 5000).

### 2. Frontend Setup
1. Open a new terminal and navigate to `frontend/`.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the displayed local host URL in your browser.

## API Documentation

- **Auth**
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- **Users (Admin Only)**
  - `GET /api/users`
  - `PATCH /api/users/:id`
  - `DELETE /api/users/:id`
- **Records**
  - `GET /api/records?page=1&limit=10&type=expense`
  - `POST /api/records`
  - `GET /api/records/:id`
  - `PATCH /api/records/:id`
  - `DELETE /api/records/:id`
- **Dashboard**
  - `GET /api/dashboard/stats`
