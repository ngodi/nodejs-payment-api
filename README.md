# 💳 Node.js Payment API

**Live Demo**: [https://nodejs-payment-api.onrender.com](https://nodejs-payment-api.onrender.com)
*A simple and extendable RESTful API for accepting payments using Stripe.*

---

## 📘 Overview

This project is a basic RESTful API that allows small businesses to **accept payments** from customers via the **Stripe payment gateway**. The system is built to be extendable for future integration with other providers such as **PayPal**, **Paystack**, or **Flutterwave**.

### 🔄 How It Works

* **Make Payment**: When a customer initiates a payment, their information is saved (if new), and a transaction is recorded. A Stripe Checkout Session is then created, and the customer is redirected to the Stripe payment page.
* **Webhook Listener**: After payment completion (or failure), a Stripe webhook notifies the server to update the payment status.
* **Query Payment**: Users can query the status or history of their payments using their email or session ID.

---

## ✅ Functional Requirements

* [x] Make payment
* [x] Get payment status
* [x] Get error report

## 🧰 Non-Functional Requirements

* ✅ High Availability
* ✅ Scalability
* ✅ Secure Transactions
* ✅ Optimized Performance
* ✅ Maintainable Codebase

---

## 🗃️ Database Design

### 👤 Users Table

| Field | Type   |
| ----- | ------ |
| id    | UUID   |
| name  | String |
| email | String |

### 💰 Payments Table

| Field      | Type   |
| ---------- | ------ |
| id         | UUID   |
| userId     | UUID   |
| sessionId  | String |
| customerId | String |
| provider   | String |
| status     | String |
| amount     | Float  |

> **Relation**: One-to-Many → One user can have multiple payments.

---

## 🧪 Testing

### ✅ Frameworks Used

* [Jest](https://jestjs.io/) — Unit and integration testing
* [Supertest](https://github.com/ladjs/supertest) — HTTP assertions
* [Postman](https://www.postman.com/) — API testing (manual)

### 🚀 Run All Tests

```bash
npm test
```

---

## 📦 Technologies Used

| Area       | Stack/Tool        |
| ---------- | ----------------- |
| Server     | Node.js, Express  |
| Validation | express-validator |
| ORM        | Sequelize         |
| Payment    | Stripe SDK        |
| Testing    | Jest, Supertest   |
| Formatting | ESLint, Prettier  |
| Deployment | Render.com        |
| CI/CD      | GitHub Actions    |

---

## 🌐 API Endpoints

| Method | Endpoint                       | Description                                       |
|--------|--------------------------------|---------------------------------------------------|
| POST   | `/api/v1/payments`             | Initiate a payment (`name`, `email`, `amount`)    |
| GET    | `/api/v1/payments/:id`         | Get payment transaction by session ID             |
| GET    | `/api/v1/payments?email=`      | Get all transactions by user email                |
| GET    | `/api/v1/payments/stripe/:id`  | Get payment details directly from Stripe by ID    |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:ngodi/nodejs-payment-api.git
cd nodejs-payment-api
```

### 2. Install Dependencies

```bash
npm install
```

---

## ⚙️ Environment Setup

Create a `.env` file at the root of your project with the following variables:

```env
PORT=5000
DATABASE_URL=your_database_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:3000
```

---

## 🚢 Deployment

* Continuous Integration/Deployment is handled using **GitHub Actions**.
* Hosted on **Render.com**.

---

## 🙋 Contribution

Pull requests and issues are welcome. Please include tests for any new features or bug fixes.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).