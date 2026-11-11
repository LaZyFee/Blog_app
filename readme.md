# 🌐 Blog Web App (MERN Stack)

A full-stack MERN blog application with authentication, comments, reactions, author profiles, and a content-rich blogging experience.

## Live Demo

- Website: https://blog-web-appx.netlify.app

## Features

- Create, edit, and delete blog posts
- Comments and nested replies
- Likes and dislikes for blogs, comments, and replies
- Author profiles and blog collections
- Role-based access control
- Cloudinary-powered image uploads

## Project Structure

```text
Blog_app/
├── client/                 # React + Vite frontend
├── src/                    # Express backend
├── index.js                # backend entry point
├── package.json            # root scripts and dependencies
├── readme.md              # project docs
├── docker-compose.yaml     # local development services
└── .env.example           # optional environment template
```

## Installation & Setup

### 1. Clone the repository

```sh
git clone https://github.com/LaZyFee/Blog_app.git
cd Blog_app
```

### 2. Install backend dependencies

```sh
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root with the following values:

```env
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
PORT=5000
```

### 4. Start the backend

```sh
npm run server
```

By default the backend runs on http://localhost:5000.

### 5. Install client dependencies

```sh
cd client
npm install
```

### 6. Set up frontend environment variables

Create a `.env` in `client/` with:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 7. Start the frontend

```sh
npm run dev
```

By default the frontend runs on http://localhost:5173.

### 8. Run everything together

From the root directory:

```sh
npm run dev
```

This starts the backend and frontend concurrently.

## Deployment Guide

### Backend

- Deploy to Render, Railway, or Vercel
- Set the same environment variables in the hosting platform

### Frontend

- Deploy to Netlify or Vercel
- Set `VITE_API_URL` to the deployed backend URL

## Security and Quality Improvements Added

- Auth middleware now handles missing and invalid tokens safely
- Blog update/delete routes are protected by authentication
- Only the owner or admin can mutate a blog
- Pagination is included for blog listing results
- Setup instructions have been corrected for the actual repo structure

## Future Enhancements

- OAuth login
- Drafts and scheduled publishing
- Followers / reading lists
- Post moderation and reporting
- Revision history
- Search, filtering, and tags
- RSS and SEO metadata

## Contributing

1. Fork the project
2. Create a branch
3. Commit your changes
4. Open a pull request
