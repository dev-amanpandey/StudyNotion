// const express = require("express");
// const app = express();
// const dotenv = require("dotenv");

// // Load environment variables before importing routes/controllers. The Razorpay
// // client is constructed during module import and needs these values then.
// dotenv.config();

// const userRoutes = require("./routes/User");
// const profileRoutes = require("./routes/Profile");
// const paymentRoutes = require("./routes/Payments");
// const courseRoutes = require("./routes/Course");

// const database = require("./config/database");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const {cloudinaryConnect} = require("./config/cloudinary");
// const fileUpload = require("express-fileupload");
// const os = require("os");

// const PORT = process.env.PORT || 4000;

// //database connect
// database.connect();
// //middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(
//     cors({
//         origin:["http://localhost:3000", "http://localhost:5173"],
//         credentials:true,
//     })
// )
// app.use(
//     fileUpload({
//         useTempFiles: true,
//         tempFileDir: os.tmpdir()
//     })
// )
// //cloudinary connect
// cloudinaryConnect();

// //routes
// app.use("/api/v1/auth", userRoutes);
// app.use("/api/v1/profile", profileRoutes);
// app.use("/api/v1/course", courseRoutes);
// app.use("/api/v1/payment", paymentRoutes);


// //def route

// app.get("/",(_req,res)=>{
//     return res.json({
//         success:true,
//         message: 'your server is running....'
//     });
// });

// app.listen(PORT,()=>{
//     // console.log('app is running at ${PORT}')
//     console.log(`app is running at ${PORT}`);
// })
const express = require("express");
const app = express();
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const os = require("os");

const PORT = process.env.PORT || 4000;

// Connect Database
database.connect();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Allowed Origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

// CORS Configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// File Upload Middleware
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
  })
);

// Cloudinary Connection
cloudinaryConnect();

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);

// Default Route
app.get("/", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "Your server is running successfully!",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});