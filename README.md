# 🧠 Bitespeed Identity Reconciliation

This project solves the **Identity Reconciliation** problem for Bitespeed's backend task. It ensures that multiple contacts with shared identifiers (email or phone number) are logically linked under a unified identity.

🔗 **Live Demo:** [bitespeed-identity-reconciliation-u6k9.onrender.com](https://bitespeed-identity-reconciliation-u6k9.onrender.com)

---

## ✨ Features

- Accepts contact input via **email** and/or **phoneNumber**.
- Detects whether the contact already exists.
- Creates new contacts or links to existing ones intelligently.
- Distinguishes between **primary** and **secondary** contacts.
- Returns a clean, merged view of all related contacts.

---

## 🛠 Tech Stack

| Layer           | Technology                 |
| --------------- | -------------------------- |
| Backend         | Node.js (ES Modules)       |
| Database        | PostgreSQL (Render-hosted) |
| Deployment      | Render Web Service         |
| Package Manager | npm                        |
| Environment     | `.env` file                |

---

## 📁 Project Structure

```plaintext
.
├── controllers/
│   └── identifyController.js
├── routes/
│   └── identifyRoute.js
├── utils/
│   └── db.js               # PostgreSQL connection logic
├── app.js                  # Main entry point
├── package.json
└── README.md
```

````

---

## 🚀 Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Bitespeed-Identity-Reconciliation.git
cd Bitespeed-Identity-Reconciliation
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file at the root and add:

```env
DATABASE_URL=postgresql://<db_name>:<password>@<host_name>:5432/<db_name>
PORT=3000
```

### 4. Run the server

```bash
node app.js
```

Access the server at: [http://localhost:3000](http://localhost:3000)

---

## 📨 API Endpoint

### `POST /identify`

**Request Body Raw**

```json
{
  "email": "user@example.com",
  "phoneNumber": "9999999999"
}
```

> At least one of `email` or `phoneNumber` is required.

**Response**

```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["user@example.com", "another@example.com"],
    "phoneNumbers": ["9999999999"],
    "secondaryContactIds": [2, 3]
  }
}
```

---

## 🗃️ Database Schema

```sql
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  phoneNumber VARCHAR,
  email VARCHAR,
  linkedId INTEGER,
  linkPrecedence VARCHAR NOT NULL CHECK (linkPrecedence IN ('primary', 'secondary')) DEFAULT 'primary',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP
);
```

---

## ☁️ Deployment on Render

1. Push your code to a GitHub repository.
2. On [Render](https://render.com/), create a **Web Service** with the following settings:

   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node app.js`

3. Add environment variables `DATABASE_URL` and `PORT` in Render's dashboard (matching your `.env`).
4. Create and link a PostgreSQL instance in Render if you haven't already. Make sure `DATABASE_URL` matches the Render PostgreSQL connection string.
5. Your service will auto-deploy on every push.

---

## 🙋‍♂️ Author

[Harsh](https://github.com/harzh1)

---

## 📜 License

This project is for learning and evaluation purposes only.
````
