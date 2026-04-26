# 📝 Minimal Todo App

A simple full-stack todo application built with React, TypeScript, Node.js and SQLite.

## 🚀 Features

- Create, delete and complete todos
- Default fields: Full Name, Email, Phone, Address
- Dynamic custom fields (text, number, email, phone, date)
- Search and filtering (All / Active / Completed)

## 🛠️ Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express
- Database: SQLite

## 📁 Project Structure

```
lite-todo-app/
├── client/               # React frontend
│   └── src/
│       ├── App.tsx
│       ├── api.ts
│       ├── types.ts
│       └── components/
│           ├── TodoForm.tsx
│           ├── TodoList.tsx
│           ├── TodoItem.tsx
│           └── CustomFieldManager.tsx
└── server/               # Node.js backend
    └── src/
        ├── index.ts
        ├── db.ts
        └── routes/
            ├── todos.ts
            └── customFields.ts
```

## 📦 Installation

```bash
git clone https://github.com/YOUR_USERNAME/minimal-todo-app.git
cd minimal-todo-app
npm install
npm run dev
```

## 🌐 Usage

Open in browser:

```
http://localhost:5173
```

## 💡 Future Improvements

- Edit todos
- Authentication
- Deploy to cloud
- Switch to PostgreSQL

## 📄 License

MIT
