# 🎓 StudyNotion - EdTech Learning Platform

StudyNotion is a full-stack EdTech platform built using the **MERN Stack** that enables students to enroll in courses, instructors to create and manage courses, and administrators to oversee the platform. It provides a modern learning experience with secure authentication, online payments, and an intuitive dashboard.

---

## 🚀 Live Demo

* **Frontend:** *Add your deployed frontend URL here*
* **Backend API:** *Add your deployed backend URL here*

---

# 📌 Features

## 👨‍🎓 Student Features

* User Registration & Login
* Email OTP Verification
* Secure JWT Authentication
* Browse Available Courses
* Purchase Courses
* Razorpay Payment Integration
* View Enrolled Courses
* Video Lecture Access
* Progress Tracking
* User Profile Management
* Change Password

---

## 👨‍🏫 Instructor Features

* Instructor Dashboard
* Create Courses
* Edit Course Details
* Upload Course Thumbnail
* Add Sections & Subsections
* Upload Lecture Videos
* Publish/Unpublish Courses
* View Student Enrollments
* Revenue Analytics

---

## 🛡 Admin Features

* User Management
* Course Monitoring
* Category Management
* Platform Analytics

---

# 🛠 Tech Stack

### Frontend

* React.js
* Redux Toolkit
* React Router DOM
* Tailwind CSS
* Axios
* React Icons
* React Hot Toast
* Chart.js

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* Bcrypt.js
* Nodemailer
* Cloudinary
* Razorpay
* Cookie Parser
* Dotenv

---

# 📂 Project Structure

```text
StudyNotion/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── redux/
│   │   ├── hooks/
│   │   ├── assets/
│   │   └── App.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── mail/
│   └── index.js
│
├── README.md
└── package.json
```

---

# 🔐 Authentication

* JWT Authentication
* OTP Verification through Email
* Password Hashing using Bcrypt
* Protected Routes
* Role-Based Authorization

  * Student
  * Instructor
  * Admin

---

# 💳 Payment Gateway

Integrated with **Razorpay** for secure online course purchases.

Features include:

* Order Creation
* Payment Verification
* Payment Signature Validation
* Purchase History

---

# ☁ Cloud Storage

Course thumbnails and lecture videos are stored securely using **Cloudinary**.

---

# 📊 Dashboards

### Student Dashboard

* Enrolled Courses
* Learning Progress
* Profile Management

### Instructor Dashboard

* Total Courses
* Total Students
* Total Revenue
* Course Analytics
* Revenue Overview

---

# 📧 Email Services

Nodemailer is used for:

* OTP Verification
* Password Reset
* Account Notifications

---

# ⚙ Environment Variables

Create a `.env` file inside the **server** directory.

```env
PORT=

MONGODB_URL=

JWT_SECRET=

MAIL_HOST=
MAIL_USER=
MAIL_PASS=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY=
RAZORPAY_SECRET=

FOLDER_NAME=
```

---

# 📥 Installation

## Clone Repository

```bash
git clone https://github.com/dev-amanpandey/StudyNotion.git
```

```bash
cd StudyNotion
```

---

## Install Dependencies

### Frontend

```bash
cd client
npm install
```

### Backend

```bash
cd server
npm install
```

---

## Start Development Server

### Backend

```bash
npm run dev
```

### Frontend

```bash
npm run dev
```

---

# 📸 Screenshots

Add screenshots here:

* Home Page
* Login Page
* Signup Page
* Course Details
* Student Dashboard
* Instructor Dashboard
* Payment Page

---

# 🔮 Future Enhancements

* AI Course Recommendation System
* Certificate Generation
* Course Reviews & Ratings
* Live Classes
* Discussion Forum
* Assignment Submission
* Quiz & Assessments
* Dark Mode
* Mobile Responsive Improvements
* Instructor Earnings Report
* Notification System

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a new branch.
3. Commit your changes.
4. Push to your branch.
5. Open a Pull Request.

---

# ⭐ Support

If you found this project helpful, please consider giving it a **⭐ Star** on GitHub.

---

# 👨‍💻 Author

**Aman Pandey**

* GitHub: https://github.com/dev-amanpandey
* LinkedIn: *Add your LinkedIn profile here*

---

# 📜 License

This project is licensed under the **MIT License**.

Feel free to use, modify, and contribute.
