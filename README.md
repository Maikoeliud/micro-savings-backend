# Micro-Savings Backend

## Overview

This is the backend prototype for a micro-savings and payout platform. It includes a transaction engine, simple ledger, and APIs for:

- User management
- Deposits, transfers, withdrawals
- Balance checks and transaction history
- Admin features (system stats, all transactions)

**Built with:**

- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL
- Winston (logging)
- Joi (validation)
- UUID (idempotency keys)

### Key Features

- Atomic transactions (no negative balances, no double-spending)
- Idempotent operations via `transaction_id`
- Structured error handling and logging
- CORS enabled for frontend integration

---

## Prerequisites

Ensure you have:

- Node.js (v18+)
- Yarn or npm
- PostgreSQL (v14+)
- A PostgreSQL database (e.g., `micro_savings_db`)
- Postman, curl, or Insomnia for API testing

---

## Installation

### 1. Clone the Repository

```bash
git clone <your-github-repo-url>
cd micro-savings-backend
```

### 2. Install Dependencies

Using Yarn:

```bash
yarn install
```

Using npm:

```bash
npm install
```

---

## Configuration

### Create a `.env` File

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=micro_savings_db
```

### Database Setup

```bash
createdb micro_savings_db
```

> Sequelize will auto-create tables on startup.

---

## Running the Backend

### Start Server

```bash
yarn start
```

or

```bash
npm start
```

**Expected output:**

```
Database connected
Server running on port 3000
```

### Stop Server

Press `Ctrl+C`.

### Development Mode (Optional)

Install nodemon:

```bash
yarn add -D nodemon
```

Update `package.json`:

```json
"scripts": {
  "start": "nodemon src/server.js"
}
```

---

## API Endpoints

### User Management

#### POST `/users`

Create a user and account.

```json
{ "name": "John Doe", "email": "john@example.com" }
```

#### GET `/users`

Fetch all users.

#### GET `/users/balance/:user_id`

Get user balance.

#### GET `/users/transactions/:user_id`

Get user transaction history.

---

### Transactions

#### POST `/transactions/deposit`

```json
{ "user_id": "uuid", "amount": 100, "transaction_id": "uuid" }
```

#### POST `/transactions/transfer`

```json
{
  "from_user_id": "uuid",
  "to_user_id": "uuid",
  "amount": 50,
  "transaction_id": "uuid"
}
```

#### POST `/transactions/withdraw`

```json
{ "user_id": "uuid", "amount": 50, "transaction_id": "uuid" }
```

---

### Admin Endpoints

#### GET `/users/stats`

System summary (totals, balances, transactions).

#### GET `/users/all-transactions`

Fetch all transactions with user details.

---

## Database Management

### Force-reset tables

Temporarily set:

```javascript
sequelize.sync({ force: true })
```

Restart server, then revert to:

```javascript
sequelize.sync({ force: false })
```

### Inspect database

```bash
psql -h localhost -U your_db_user -d micro_savings_db
```

**Commands:**

```
\dt              # list tables
\d "Accounts"    # describe table
```

---

## Logging

- Logs to console and `error.log`
- **Info logs:** user creation, successful transactions
- **Error logs:** insufficient balance, validation errors, db errors

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS errors | Configure allowed origins in `src/app.js` |
| DB connection failed | Check `.env` and DB is running |
| Column errors | Force-sync DB |
| Validation errors | Ensure valid UUIDs and positive numbers |
| Port in use | Change `PORT` or kill process |
| Missing deps | Run `yarn install` again |