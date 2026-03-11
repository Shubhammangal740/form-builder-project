# 📝 Dynamic Form Builder

A full-stack **MERN** web application that allows admins to create customizable, dynamic no-code forms and enables users to fill out and submit responses — all stored in a MongoDB database.

![Tech Stack](<https://img.shields.io/badge/Frontend-React%20(Vite)-61DAFB?logo=react&logoColor=white>)
![Tech Stack](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?logo=mongodb&logoColor=white)
![Deployment](https://img.shields.io/badge/Frontend-Vercel-000000?logo=vercel&logoColor=white)
![Deployment](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=white)

---

## 🚀 Live Demo

| Service         | URL                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------ |
| **Frontend**    | [https://form-builder-frontend.vercel.app](https://form-builder-frontend.vercel.app)             |
| **Backend API** | [https://form-builder-backend-wnlq.onrender.com](https://form-builder-backend-wnlq.onrender.com) |

> ⚠️ The backend is hosted on Render's free tier and may take ~30 seconds to wake up on the first request.

---

## ✨ Features

- **Admin Dashboard** — Manage all created forms from a central dashboard
- **Dynamic Form Builder** — Create forms with multiple configurable field types
- **Supported Field Types** — Text, Textarea, Number, Email, Dropdown, Radio, and Checkbox
- **Form UI Customization** — Customize colors, fonts, alignment, width, and button styling per form
- **Live Form Preview** — See real-time changes while building a form
- **Public Form Filling** — Share a link and let users fill & submit the form
- **Field-Type Validation** — Real-time and server-side validation based on field type (email format, number check, option matching, etc.)
- **Response Management** — View all submitted responses per form in a table
- **Responsive UI** — Works seamlessly across desktop, tablet, and mobile devices

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | React 18+ (Vite)                    |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB Atlas (Mongoose)            |
| Deployment | Vercel (Frontend), Render (Backend) |

---

## 📁 Project Structure

```
root/
├── Backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── formController.js    # Form CRUD logic
│   │   └── responseController.js# Response submission & retrieval
│   ├── models/
│   │   ├── Form.js              # Form schema with design settings
│   │   └── Response.js          # Response schema
│   ├── routes/
│   │   ├── formRoutes.js        # /api/forms routes
│   │   └── responseRoutes.js    # /api/responses routes
│   ├── server.js                # Express app entry point
│   └── package.json
│
└── Frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── FieldBuilder.jsx     # Field configuration UI
    │   │   ├── FieldPreview.jsx     # Field preview in builder
    │   │   ├── FormRenderer.jsx     # Renders form for public filling
    │   │   ├── Navbar.jsx           # Navigation bar
    │   │   └── ResponseTable.jsx    # Responses data table
    │   ├── pages/
    │   │   ├── CreateForm.jsx       # Form builder page
    │   │   ├── Dashboard.jsx        # Admin dashboard
    │   │   ├── FormFill.jsx         # Public form fill page
    │   │   ├── FormsList.jsx        # All forms listing
    │   │   └── ResponsesPage.jsx    # View responses for a form
    │   ├── routes/
    │   │   └── AppRoutes.jsx        # React Router configuration
    │   ├── services/
    │   │   └── api.js               # Centralized Axios instance
    │   ├── utils/
    │   │   └── constants.js         # API base URL & constants
    │   ├── App.jsx
    │   └── main.jsx
    ├── vercel.json              # Vercel rewrite rules for SPA
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Installation (Run Locally)

### Prerequisites

- **Node.js** v18+
- **npm** or **yarn**
- **MongoDB Atlas** account (or local MongoDB instance)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/form-builder.git
cd form-builder
```

### 2. Setup Backend

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
CORS_ORIGIN=http://localhost:5173
```

Start the backend server:

```bash
npm start
```

### 3. Setup Frontend

```bash
cd Frontend
npm install
```

Optionally create a `.env` file in the `Frontend/` directory to override the API URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> If omitted, the frontend defaults to the deployed backend URL.

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🌐 Environment Variables

### Backend (`Backend/.env`)

| Variable      | Description               | Example                                  |
| ------------- | ------------------------- | ---------------------------------------- |
| `PORT`        | Server port               | `5000`                                   |
| `MONGO_URI`   | MongoDB connection string | `mongodb+srv://user:pass@cluster/dbname` |
| `CORS_ORIGIN` | Allowed frontend origin   | `http://localhost:5173`                  |

### Frontend (`Frontend/.env`)

| Variable            | Description          | Example                     |
| ------------------- | -------------------- | --------------------------- |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 🚢 Deployment

### Frontend — Vercel

1. Push the `Frontend/` folder to a GitHub repository
2. Import the repository on [Vercel](https://vercel.com)
3. Set the **Root Directory** to `Frontend`
4. Set the **Build Command** to `npm run build`
5. Set the **Output Directory** to `dist`
6. The `vercel.json` rewrite rule ensures client-side routing works correctly

### Backend — Render

1. Push the `Backend/` folder to a GitHub repository
2. Create a new **Web Service** on [Render](https://render.com)
3. Set the **Root Directory** to `Backend`
4. Set the **Build Command** to `npm install`
5. Set the **Start Command** to `node server.js`
6. Add the environment variables (`MONGO_URI`, `CORS_ORIGIN`) in the Render dashboard

---

## 🔮 Future Improvements

- [ ] User authentication and role-based access control
- [ ] Form sharing via unique public links with expiry
- [ ] Export responses as CSV / Excel
- [ ] Drag-and-drop field reordering in the form builder
- [ ] File upload field type support
- [ ] Form analytics and submission statistics
- [ ] Email notifications on new form submissions
- [ ] Dark mode support

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
