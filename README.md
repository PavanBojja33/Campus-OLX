🎓 Campus OLX – Verified Student Marketplace (MERN Stack)

Campus OLX is a college-exclusive online marketplace that enables students to buy and sell semester-specific academic items such as textbooks, calculators, drafters, and lab equipment securely within their campus community.

🚩 Problem Statement

In many colleges, students purchase academic items for a single semester, which often remain unused afterward. At the same time, junior students struggle to find these essentials at affordable prices. Existing informal solutions like WhatsApp groups are unorganized, unreliable, and lack proper student verification.

There is a need for a secure, structured, and verified platform dedicated to student-to-student exchange of academic resources.

🎯 Objective

To design and develop a student-only marketplace that:

Allows seniors to list pre-used academic items

Enables juniors to buy items at lower costs

Ensures authenticity using college email verification

Provides a clean, secure, and scalable system

🛠️ Tech Stack
Frontend

React.js (Vite)

React Router DOM

Axios

Backend

Node.js

Express.js

MongoDB (Mongoose)

Authentication & Security

JWT (JSON Web Tokens)

Bcrypt (password hashing)

College Email Verification (Nodemailer)

Media Storage

Cloudinary (Image Uploads)

Tools

Postman (API testing)

MongoDB Atlas

Git & GitHub

🧱 System Architecture
React (Frontend)
     |
Axios API Calls
     |
Node.js + Express (Backend)
     |
MongoDB (Database)
     |
Cloudinary (Images)

✨ Features
🔐 Authentication

Student registration using college email

Email verification before login

JWT-based secure login

Protected frontend routes

📦 Item Management

Add items with multiple images

Edit / delete items (seller only)

Mark items as sold

Pagination for performance

Filter by semester, department, and category

🛡️ Authorization

Seller-only actions (edit, delete, mark sold)

Protected backend APIs

Secure middleware-based access control

🖼️ Media Handling

Image upload using Multer + Cloudinary

Optimized cloud storage

URLs stored in database

📂 Project Structure
Backend
backend/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middleware/
 ├── utils/
 ├── config/
 ├── server.js
 └── .env

Frontend
frontend/
 ├── pages/
 ├── components/
 ├── services/
 ├── context/
 ├── App.jsx
 └── main.jsx

🔄 Application Flow

User registers using college email

Verification email is sent

User verifies email

Login generates JWT token

Token stored in browser

Authenticated user can:

Add items

View items

Edit/delete own items

Buyers can view and contact sellers

🧪 Testing

All backend APIs tested using Postman

Authentication, authorization, and error handling verified

Database updates confirmed via MongoDB Atlas

Image uploads verified in Cloudinary dashboard

🚀 Deployment (Recommended)

Frontend: Vercel / Netlify

Backend: Render / Railway

Database: MongoDB Atlas

Images: Cloudinary

🏆 Key Learnings

Full-stack MERN development

Secure JWT authentication & authorization

Email verification workflows

Cloud-based media management

RESTful API design

Frontend–backend integration

Real-world debugging and testing

📌 Resume Highlights

Built a secure campus-exclusive marketplace using MERN stack

Implemented JWT authentication with college email verification

Integrated Cloudinary for scalable image uploads

Developed seller-only authorization using custom middleware

Designed filtering, pagination, and CRUD APIs

Tested and validated APIs using Postman

🔮 Future Enhancements

Real-time chat using Socket.io

Admin dashboard for moderation

Item reporting system

User ratings & reviews

Deployment with CI/CD

Progressive Web App (PWA)

👨‍💻 Author

Pavan Bojja
B.Tech Student
Aspiring Full Stack Developer (MERN)
