# 🌐 Blog Web App (MERN Stack)

A full-stack **MERN** (MongoDB, Express, React, Node.js) blog application with user authentication, real-time interactions, and role-based access control.

##### visit: https://blog-web-appx.netlify.app

## 🚀 Features

### ✨ Key Features:

- **📝 Interactive Posts**: Users can **create, edit, and delete** their own blog posts, with **real-time like, dislike, and comment counters**.
- **💬 Commenting System**: Includes **replies on comments** with **like/dislike** functionality for both **comments** and **replies**.
- **👤 Personalized Profiles**:
  - **For Authors**: Access a customized layout to manage posts, create or edit teams, and update content.
  - **For Visitors**: Explore the profiles of authors to learn more about their work.
- **🔒 Role-Specific Access**:
  - **Logged-In Users**: Engage with posts via **likes, dislikes, comments, and replies**.
  - **Visitors**: View posts without the ability to interact, ensuring clear boundaries for non-users.

---

### Backend:

- **Node.js** + **Express.js** - Server-side framework
- **MongoDB** + **Mongoose** - Database & ODM
- **Multer** - File uploads
- **Cloudinary** - Image hosting
- **bcrypt.js** - Password hashing
- **JWT (JSON Web Token)** - Authentication

### Frontend:

- **React.js** (Vite) - Frontend framework
- **Zustand** - State management
- **React Router** - Client-side navigation
- **Axios** - HTTP requests
- **React Hook Form** - Form validation
- **React Quill** / **TinyMCE** - Rich text editors
- **DOMPurify** - Prevents XSS attacks
- **Lucide-react** / **React Icons** - UI Icons
- **SweetAlert2** - Alerts & popups
- **DaisyUI + TailwindCSS** - UI styling
- **AOS (Animate on Scroll)** - Smooth animations

---

## 🏗 Installation & Setup

### 1️⃣ Clone the Repository:

```sh
git clone https://github.com/LaZyFee/Blog_app
cd blog-web-app
```

### 2️⃣ Install Backend Dependencies:

```sh
cd server
npm install
```

### 3️⃣ Set Up Environment Variables (.env in server):

```sh
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

### 4️⃣ Start Backend Server:

```sh
npm start
```

By default, the backend runs on http://localhost:5000.

### 5️⃣ Install Frontend Dependencies:

```sh
cd ../client
npm install
```

### 6️⃣ Set Up Frontend Environment Variables (.env in client):

```sh
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### 7️⃣ Start Frontend:

```sh
npm run dev
```

By default, the frontend runs on http://localhost:5173.

## 🚀 Deployment Guide

### 🔹 **Backend Deployment** (Vercel, Render, or Railway)

1. Create a MongoDB Atlas database: [MongoDB Atlas](https://www.mongodb.com/atlas)

2. Deploy your backend on one of the following platforms:
   - [Vercel](https://vercel.com)
   - [Render](https://render.com)
   - [Railway](https://railway.app)
3. Update your `.env` file with the **deployed backend URL**.

### 🔹 **Frontend Deployment** (Netlify or Vercel)

1. Choose a hosting provider:

   - [Netlify](https://www.netlify.com/)
   - [Vercel](https://vercel.com/)

2. Link your **GitHub repository** and deploy your app.

3. Update your `.env` file in the frontend:
   ```plaintext
   VITE_API_BASE_URL=https://your-deployed-backend-url/api
   ```

---

## 🖼️ Screenshots

| Home Page                      | Main Section                   | Profile                              | Create-blog                        |
| ------------------------------ | ------------------------------ | ------------------------------------ | ---------------------------------- |
| ![Home](Screenshoots\home.png) | ![Main](Screenshoots\main.png) | ![Profile](Screenshoots\profile.png) | ![create](Screenshoots\create.png) |

---

## 💡 Future Enhancements

| Feature                                        | Category             | Priority  |
| ---------------------------------------------- | -------------------- | --------- |
| 🔐 OAuth Authentication (Google, GitHub, etc.) | Security             | 🔴 High   |
| 🏷️ Category & Tag-Based Blog Filtering         | User Experience      | 🔴 High   |
| 🔍 Search & Sorting for Blogs                  | User Experience      | 🔴 High   |
| 🖼️ Add Table & Image Support in Content Editor | Content Management   | 🔴 High   |
| 📄 Pagination for Blogs                        | Performance          | 🔴 High   |
| 📌 Bookmark & Save Posts                       | User Engagement      | 🟡 Medium |
| 🔗 Social Media Sharing for Posts              | User Engagement      | 🟡 Medium |
| 📩 Email Notifications for Comments & Replies  | User Experience      | 🟡 Medium |
| 📱 PWA (Progressive Web App) Support           | Mobile Optimization  | 🟢 Low    |
| 📊 Analytics Dashboard for Authors             | Insights & Analytics | 🟢 Low    |

---

## 🤝 _Contributing_

1. _Fork_ the repository.
2. _Create a branch_ (`git checkout -b feature-branch`).
3. _Commit your changes_ (`git commit -m 'Added new feature'`).
4. _Push_ to the branch (`git push origin feature-branch`).
5. _Create a Pull Request_.

---

## 📞 _Contact_

- **Email**: *rhr277@gmail.com*
- **GitHub**: _[LaZyFee](https://github.com/LaZyFee)_
- **LinkedIn**: _[Rabiul_Rafee](https://www.linkedin.com/in/rabiul-rafee-361224183)_

---

_Made with ❤️ by **[Rabiul Rafee]**_
