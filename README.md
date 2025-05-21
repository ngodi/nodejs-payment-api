# 💳 Payment API

A simple Node.js REST API for accepting and tracking payments.

---

## 🚀 Features

- `POST /payments` – Create a payment and charge via Stripe
- `GET /payments/:id` – Retrieve payment status
- Stores metadata in **Supabase PostgreSQL** via Sequelize
- Supports **status tracking** (`pending`, `completed`, `failed`)
- Fully RESTful with validation and error handling

---

## 🧱 Tech Stack

- Node.js + Express
- Sequelize ORM
- Supabase PostgreSQL
- Stripe Payment Gateway

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/payment-api.git
cd payment-api
