Here's the updated `README.md` with your requested `.env` format and a few minor enhancements for clarity and consistency:

```markdown
# 🧠 Bitespeed Identity Reconciliation

This project solves the **Identity Reconciliation** problem for Bitespeed's backend task. It ensures that multiple contacts with shared identifiers (email or phone number) are logically linked under a unified identity.

🔗 **Live Demo:** 👉 [https://bitespeed-identity-reconciliation-u6k9.onrender.com](https://bitespeed-identity-reconciliation-u6k9.onrender.com)

---

## 📌 Features

- Accepts contact input via `email` and/or `phoneNumber`.
- Identifies whether the contact exists.
- Creates new or links to existing contact(s) intelligently.
- Distinguishes between **primary** and **secondary** contacts.
- Returns a clean, merged view of all related contacts.

---

## 🚀 Tech Stack

- **Backend:** Node.js (ES Modules)
- **Database:** PostgreSQL (hosted on Render)
- **Deployment:** Render Web Service
- **Package Manager:** npm
- **Environment Variables:** `.env` file

---

## 📂 Project Structure
```

.
├── controllers/
│ └── identifyController.js
├── routes/
│ └── identifyRoute.js
├── utils/
│ └── db.js \# PostgreSQL connection logic
├── app.js \# Main entry point
├── package.json
└── README.md

````

---

## 🔧 Setup & Installation

1.  **Clone the repository**

    ```bash
    git clone [https://github.com/your-username/Bitespeed-Identity-Reconciliation.git](https://github.com/your-username/Bitespeed-Identity-Reconciliation.git)
    cd Bitespeed-Identity-Reconciliation
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Create a `.env` file**

    Add your PostgreSQL connection string and desired port:

    ```env
    DATABASE_URL=postgresql://db_name:pass@host_name:5432/db_name
    PORT=3000
    ```

4.  **Run the server**

    ```bash
    node app.js
    ```

    The server runs at `http://localhost:3000`.

---

### 📨 API Endpoint

**`POST /identify`**

**Request Body Raw**

```json
{
  "email": "user@example.com",
  "phoneNumber": "9999999999"
}
````

_At least one of `email` or `phoneNumber` is required._

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

### 🗃️ Database Schema

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

## 🚀 Deployment on Render

1.  Push your code to a GitHub repo.
2.  Go to [Render](https://render.com/) and create a **Web Service**:
    - **Environment:** Node
    - **Build Command:** `npm install`
    - **Start Command:** `node app.js`
3.  Add environment variables: For `DATABASE_URL` and `PORT`, use the values from your `.env` file. Render will automatically expose these to your application.
4.  If not already linked, create a PostgreSQL instance in Render and connect it to your web service. Ensure your `DATABASE_URL` in Render matches the connection string provided by your Render PostgreSQL instance.
5.  Done\! Your service will auto-deploy on every push.

---

## 🙋‍♂️ Author

[Harsh](https://www.google.com/search?q=https://github.com/your-username) (replace `your-username` with your actual GitHub username)

---

## 🛠 License

This project is for learning and evaluation purposes only.

```

```
