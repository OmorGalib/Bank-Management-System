# Bank Management System

A comprehensive, production-ready banking application built with NestJS, TypeORM, and MySQL. This system simulates core banking functionalities including account management, transactions, loans, interest calculations, and reporting.

## 🌟 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Customer, Staff, Admin)
- Secure password hashing with bcrypt
- Protected API endpoints

### 💳 Account Management
- Multiple account types (Savings, Checking, Loan)
- Account creation with unique account numbers
- Balance inquiry and account details
- Account status management (Active/Inactive/Frozen)

### 💰 Transactions
- Deposit and withdrawal operations
- Internal and external fund transfers
- Automatic fee calculation (0.5% for transfers)
- Transaction limits and history
- Real-time balance updates

### 📊 Loan Management
- Loan applications (Personal, Home, Auto, Education, Business)
- Loan approval workflow with staff/admin review
- EMI calculation based on interest rate and term
- Loan repayment tracking
- Status tracking (Pending/Approved/Rejected/Active/Closed)

### 💹 Interest Engine
- Automatic monthly interest calculation
- Different interest rates by account type
- Scheduled interest crediting (1st of every month)
- Configurable interest rates via environment variables

### 📈 Reporting
- Account statements with date range filtering
- Transaction history with filters
- Portfolio summary for administrators
- Export capabilities for statements

### 🔒 Security Features
- JWT token expiration
- Role-based endpoint protection
- Input validation and sanitization
- SQL injection prevention via TypeORM
- Audit logging for sensitive operations

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn package manager

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repository-url>
cd bank-management-system

# Install dependencies
npm install

### Database Setup
# Login to MySQL
sudo mysql -u root -p

# Create database and user (run these MySQL commands)
CREATE DATABASE bank_management;
CREATE USER 'bank_user'@'localhost' IDENTIFIED BY 'YourStrongPassword123!';
GRANT ALL PRIVILEGES ON bank_management.* TO 'bank_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

### Create a .env file in the root directory
# App Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=bank_user
DB_PASSWORD=YourStrongPassword123!
DB_DATABASE=bank_management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=1d

# Interest Rates (% per annum)
SAVINGS_INTEREST_RATE=4.5
CHECKING_INTEREST_RATE=1.0
LOAN_INTEREST_RATE=8.5

# Transaction Limits
DAILY_TRANSACTION_LIMIT=10000
TRANSACTION_FEE_PERCENTAGE=0.5

### Start the Application
# Development mode with hot reload
npm run start:dev

### Test the API
# Open another terminal and test the endpoints:
# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@example.com","password":"password123","firstName":"John","lastName":"Doe"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@example.com","password":"password123"}'

# Create an account (use the token from login)
curl -X POST http://localhost:3000/api/accounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"accountType":"savings","currency":"USD","initialDeposit":1000}'