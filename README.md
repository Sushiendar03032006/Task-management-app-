# ✅ Taskify - Smart Task Manager

Taskify is a modern, responsive task management web application built using **HTML, CSS, JavaScript, Firebase, Tailwind CSS, and Chart.js**.  
It helps users organize, track, and analyze their daily tasks with secure authentication and real-time database support.

---

## 🚀 Features

- 🔐 User Authentication (Login / Signup / Reset Password)
- ☁️ Cloud Database with Firebase Firestore
- 📝 Add, Edit, Delete Tasks
- ✅ Mark Tasks as Completed
- 🔍 Search & Filter (All / Active / Completed)
- 📊 Task Progress Chart (Completed vs Pending)
- 🌗 Dark / Light Mode
- 📱 Fully Responsive Design
- ⚡ Real-time Updates
- 🗑 Clear Completed Tasks
- 📈 Live Progress Bar

---

## 🛠️ Technologies Used

| Technology     | Purpose                 |
|----------------|-------------------------|
| HTML5          | Structure               |
| CSS3           | Styling                 |
| JavaScript     | Logic & Interactions    |
| Tailwind CSS   | Responsive UI Design    |
| Firebase Auth  | User Authentication     |
| Firestore DB   | Cloud Database          |
| Chart.js       | Data Visualization      |

---

## 📂 Project Structure
task-manager/
│
├── index.html # Login & Signup Page
├── dashboard.html # Main Dashboard
├── auth.js # Authentication Logic
├── task.js # Task Management Logic
├── firebase-config.js # Firebase Configuration
└── README.md # Project Documentation


---

## 📸 Project Screenshots

> Add your output images here

### 🔹 Login Page
![Login Page](assets/login.png)

### 🔹 Dashboard
![Dashboard](assets/dashboard.png)

### 🔹 Task Chart
![Task Chart](assets/chart.png)


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/taskify.git
```

2️⃣ Open Project Folder
cd task-manager
3️⃣ Create Firebase Project

Go to: https://firebase.google.com/

Create a new project

Enable:

Authentication (Email/Password)

Firestore Database

4️⃣ Configure Firebase

Create firebase-config.js file and add:

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
5️⃣ Run the Project

Open:

index.html

in your browser.

✔ No server required.

📊 Dashboard Overview

Task Progress Graph

Completion Percentage

Pending Task Counter

Real-time Updates

🔒 Security

Secure Firebase Authentication

User-specific Firestore data

Protected routes

Session management

🌟 Future Enhancements

📅 Calendar Integration

🔔 Notifications

🤖 AI Task Suggestions

📱 Mobile App Version

☁️ Cloud Sync

🗃 Task Categories
