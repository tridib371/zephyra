<div align="center">

# 🌬️ ZEPHYRA

### *Carry your story on the wind — to every corner, to every soul.*

[![Build Status](https://img.shields.io/badge/Build-Passing-emerald.svg?style=for-the-badge&logo=github)](https://github.com/tridib371/zephyra)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB.svg?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933.svg?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-amber.svg?style=for-the-badge)](LICENSE)

<br />

<p align="center">
  <b>Zephyra</b> is a modern, high-performance, distraction-free social platform engineered for creators, artists, and storytellers. Built with a bespoke <b>Glassmorphic Dark/Light Design Engine</b>, real-time interactive feeds, 6-digit OTP email verification, Google OAuth single sign-on, and an administrative control portal.
</p>

[Explore Features](#-key-features) • [Tech Stack](#%EF%B8%8F-technology-stack) • [Installation Guide](#-getting-started) • [API Reference](#-api-endpoints-reference) • [Project Architecture](#-project-architecture)

---

</div>

<br />

## ✨ Key Features

### 🔐 Authentication & Security
- **6-Digit OTP Email Verification**: Secure registration workflow powered by Nodemailer (Gmail SMTP). Sends time-sensitive 6-digit verification codes to valid email addresses.
- **Google OAuth 2.0 Integration**: Single-click sign-in using Google accounts with auto-fallback and account syncing.
- **Bcrypt Password Security & Live Checklist**: Enforces strict password complexity rules (8+ chars, uppercase, lowercase, numbers, special characters) with real-time visual strength checklist.
- **JWT Session Persistence**: Token-based authentication saved securely with automatic header injection via Axios interceptors.

### 📰 Story Feed & Interactive Content
- **Chronological Creator Feed**: Clean, distraction-free timeline displaying posts in chronological order without rage-bait algorithms.
- **Real-Time Like & Comment System**: Micro-animated heart reactions and threaded discussion comments with live relative timestamps (`date-fns`).
- **Multi-Platform Share Modal**: Native Web Share API integration, one-click direct link copy to clipboard, and instant sharing to X/Twitter, WhatsApp, and Facebook.
- **Media Asset Support**: High-resolution image upload support with cloud media management.

### 👤 Profile & Customization
- **Permanent Profile & Cover Persistence**: Upload custom profile avatars and cover banners stored permanently in MongoDB with Cloudinary support.
- **Custom Bio & Social Links**: Edit display name, username, location, personal website, and bio preferences.
- **Follow & Connection Network**: Interactive follower/following system with dedicated list modals.

### 🛡️ Administrative Portal (`/admin`)
- **Control Gate Authentication**: Passcode-gated administrative dashboard with dedicated login credentials.
- **Platform Analytics Overview**: Live statistics tracking total registered users, active posts, platform comments, and system health metrics.
- **User Moderation Tools**: Suspend, ban, or inspect user accounts and content across the network.

### 🔍 Discovery & Smart 404 Engine
- **Fuzzy Search & Filtering**: Global search for creators by name, username, or topic keywords.
- **Smart 404 Route Engine (`NotFound.jsx`)**: Intelligent URL pattern matching that automatically detects typos in URLs (e.g. `/logindfbgbhn`) and suggests the correct destination.

### 🎨 Design System & Accessibility
- **Glassmorphism Aesthetic**: Rich typography featuring Google Font **Fraunces** (editorial serif) and **Manrope**, paired with HSL color tokens (`#FF8F6B`, `#F5C36B`, `#0E1116`).
- **Dynamic Dark/Light Mode**: Seamless theme toggling with smooth transitions.
- **100% Mobile Responsive**: Customized layouts tuned for screens from 320px mobile displays to ultra-wide 4K viewports.

---

## 🛠️ Technology Stack

### **Frontend**
| Technology | Description |
| :--- | :--- |
| **React 19** | Core UI library for component architecture |
| **Vite 8** | Next-generation frontend build tooling |
| **TailwindCSS v4** | Utility-first styling with custom glassmorphic design tokens |
| **Framer Motion** | Physics-based spring micro-animations and layout transitions |
| **React Router v7** | Declarative client-side routing with scroll restoration |
| **React Icons (HI2)** | Modern Heroicons v2 outline vector icon library |
| **Axios** | Promise-based HTTP client with global request/response interceptors |
| **Date-fns** | Lightweight date formatting and relative time utility |

### **Backend**
| Technology | Description |
| :--- | :--- |
| **Node.js** | Server-side JavaScript runtime environment |
| **Express.js** | Fast, unopinionated REST API framework |
| **MongoDB & Mongoose** | NoSQL document database with strict schema modeling |
| **JSON Web Tokens (JWT)** | Secure, stateless authentication token handling |
| **Bcrypt.js** | Password hashing algorithm |
| **Nodemailer** | SMTP email transporter for OTP verification dispatch |
| **Google Auth Library** | Server-side verification for Google OAuth ID tokens |

---

## 📁 Project Architecture

```
zephyra/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection configuration
│   ├── middleware/
│   │   └── auth.js               # JWT protection & admin authorization middleware
│   ├── models/
│   │   ├── User.js               # User schema (profiles, auth, OTP, coverPhoto)
│   │   ├── Post.js               # Post schema (content, likes, comments)
│   │   └── Notification.js       # Notification schema (likes, comments, follows)
│   ├── routes/
│   │   ├── auth.js               # Registration, Login, OTP verification, Google OAuth
│   │   ├── users.js              # Profile updates, password changes, user search
│   │   ├── posts.js              # Post creation, feed retrieval, likes, comments
│   │   ├── notifications.js      # Notification feed & unread counts
│   │   └── admin.js              # Administrative statistics & moderation
│   ├── utils/
│   │   └── email.js              # Nodemailer SMTP transporter & OTP template
│   ├── server.js                 # Main Express server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # Pre-configured Axios instance with auth headers
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Responsive navigation header with unread badge
│   │   │   ├── Footer.jsx        # Footer links & copyright bar
│   │   │   ├── ShareModal.jsx    # React Portal share modal (X, WhatsApp, Facebook, Copy)
│   │   │   ├── ConfirmDialog.jsx # Custom modal dialog for destructive actions
│   │   │   ├── GoogleButton.jsx  # Google OAuth single sign-on trigger
│   │   │   └── ProtectedRoute.jsx# Auth wrapper for private views
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Global user state & login/logout handlers
│   │   │   └── NotificationContext.jsx # Real-time unread notification polling
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Hero landing page
│   │   │   ├── Login.jsx         # Sign-in page with eye toggle & inline errors
│   │   │   ├── Register.jsx      # Step-by-step registration & mobile 6-digit OTP
│   │   │   ├── Feed.jsx          # Timeline story feed with comments & likes
│   │   │   ├── CreatePost.jsx    # Story publishing view
│   │   │   ├── PostDetail.jsx    # Single post view with comment thread
│   │   │   ├── Profile.jsx       # User profile with custom media & posts
│   │   │   ├── Discover.jsx      # Trending content & creator recommendations
│   │   │   ├── Search.jsx        # Search stories & creators
│   │   │   ├── Messages.jsx      # Direct messaging interface
│   │   │   ├── Settings.jsx      # Password changes, preferences, danger zone
│   │   │   ├── Admin.jsx         # Administrative dashboard & control gate
│   │   │   ├── Support.jsx       # Help center & search
│   │   │   └── NotFound.jsx     # Smart 404 page with URL typo suggestions
│   │   ├── App.jsx               # Application routes & layout wrapper
│   │   └── main.jsx              # React DOM entrypoint
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### **Prerequisites**
- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher
- **MongoDB** local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI
- **Gmail Account** with an *App Password* enabled for OTP email sending

---

### **1. Clone the Repository**
```bash
git clone https://github.com/tridib371/zephyra.git
cd zephyra
```

---

### **2. Setup & Start Backend Server**
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment variables file
touch .env
```

Add the following environment variables to `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/zephyra?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_zephyra_2026
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Run the backend development server:
```bash
npm run dev
# Backend server runs on http://localhost:5000
```

---

### **3. Setup & Start Frontend App**
Open a new terminal window:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create frontend environment file
touch .env
```

Add the following environment variables to `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Run the frontend development server:
```bash
npm run dev
# Frontend app runs on http://localhost:5173
```

---

## 🔒 Environment Variables Reference

| Variable | Scope | Description |
| :--- | :--- | :--- |
| `PORT` | Backend | Port number for Express server (default: `5000`) |
| `MONGO_URI` | Backend | Connection string for MongoDB database |
| `JWT_SECRET` | Backend | Secret key used for signing JWT authentication tokens |
| `EMAIL_USER` | Backend | Sender email address for Nodemailer OTP delivery |
| `EMAIL_PASS` | Backend | App password generated from Google Account Security |
| `GOOGLE_CLIENT_ID` | Backend | Client ID used to verify Google OAuth ID tokens |
| `VITE_API_BASE_URL` | Frontend | Base REST API URL (`http://localhost:5000/api`) |
| `VITE_GOOGLE_CLIENT_ID` | Frontend | Google OAuth Client ID for Google Button component |

---

## 📡 API Endpoints Reference

### **Authentication (`/api/auth`)**
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register-request` | Public | Send 6-digit OTP code to email address |
| `POST` | `/api/auth/register-verify` | Public | Verify OTP code & complete account creation |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `POST` | `/api/auth/google` | Public | Authenticate or register using Google OAuth |
| `GET` | `/api/auth/me` | Private | Fetch authenticated user details |

### **Users (`/api/users`)**
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/search?q=...` | Private | Search users by name or username |
| `PUT` | `/api/users/me/profile` | Private | Update avatar, cover photo, bio, & details |
| `PUT` | `/api/users/me/password` | Private | Change password with current password verification |

### **Posts & Engagement (`/api/posts`)**
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts` | Private | Retrieve chronological post feed |
| `POST` | `/api/posts` | Private | Publish a new story or media post |
| `GET` | `/api/posts/:id` | Private | Fetch post details & comments |
| `DELETE` | `/api/posts/:id` | Private | Delete a published post |
| `POST` | `/api/posts/:id/like` | Private | Like a post |
| `DELETE` | `/api/posts/:id/like` | Private | Unlike a post |
| `POST` | `/api/posts/:id/comments` | Private | Post a comment on a story |
| `DELETE` | `/api/posts/:id/comments/:commentId` | Private | Delete a comment |

### **Notifications (`/api/notifications`)**
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | Private | Fetch user notification feed |
| `PUT` | `/api/notifications/mark-read` | Private | Mark unread notifications as read |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/tridib371/zephyra/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

Made with ❤️ by **Tridib Sarkar** • Designed for creators who wonder, wander, and drift between ideas.

<b>[Back to Top ⬆️](#%EF%B8%8F-zephyra)</b>

</div>
