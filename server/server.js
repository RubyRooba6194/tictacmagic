// // require("dotenv").config();
// // const express = require("express");
// // const http = require("http");
// // const cors = require("cors");
// // const mongoose = require("mongoose");
// // const socketHandler = require("./sockets/socketHandler");
// // const gameRoutes = require("./routes/gameRoutes");

// // const app = express();
// // const server = http.createServer(app);
// // const io = require("socket.io")(server, {
// //   cors: { origin: "*" },
// // });

// // app.use(cors());
// // app.use(express.json());
// // app.use("/api/game", gameRoutes);

// // mongoose
// //   .connect(process.env.MONGO_URI)
// //   .then(() => console.log("MongoDB connected"))
// //   .catch((err) => console.error("MongoDB error:", err));

// // socketHandler(io);

// // const PORT = process.env.PORT || 5000;
// // server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// require("dotenv").config();
// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const socketHandler = require("./sockets/socketHandler");
// const gameRoutes = require("./routes/gameRoutes");

// const app = express();
// const server = http.createServer(app);
// const io = require("socket.io")(server, {
//   cors: { origin: "*" },
// });

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/game", gameRoutes);

// // Health check endpoint
// app.get("/health", (req, res) => {
//   res.json({ status: "Server is running", timestamp: new Date() });
// });

// // MongoDB connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected successfully"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Socket.io handler
// socketHandler(io);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: "Something went wrong!" });
// });

// // Handle unhandled promise rejections
// process.on("unhandledRejection", (err, promise) => {
//   console.error("Unhandled Promise Rejection:", err);
// });

// // Handle uncaught exceptions
// process.on("uncaughtException", (err) => {
//   console.error("Uncaught Exception:", err);
//   process.exit(1);
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
// });


// server.js

require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors"); // Ensure cors package is installed: npm install cors
const mongoose = require("mongoose");
const socketIo = require("socket.io"); // Import socket.io separately
const socketHandler = require("./sockets/socketHandler");
const gameRoutes = require("./routes/gameRoutes");

const app = express();
const server = http.createServer(app);

// --- CORS Configuration ---
// Define allowed origins for both HTTP/Express and Socket.IO
// IMPORTANT: Replace 'https://tictacmagic.vercel.app' with your actual deployed Vercel frontend URL
const allowedOrigins = [
  "http://localhost:5173", // For your local frontend development
  "http://localhost:3000", // If you use Create React App with default port
  "https://tictacmagic.vercel.app", // Your deployed Vercel frontend URL
  // Add any custom domains for your frontend if you use them (e.g., 'https://www.yourdomain.com')
];

// Configure CORS for Express (HTTP requests)
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests, or same-origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin: " +
          origin;
        console.warn(msg); // Log the blocked origin for debugging
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // Allow cookies, authorization headers, etc. to be sent
  })
);

// Configure CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins, // Use the same allowedOrigins array for Socket.IO
    methods: ["GET", "POST"], // Specify allowed methods for Socket.IO handshakes
    credentials: true,
  },
});

// Middleware for parsing JSON requests
app.use(express.json());

// Routes
app.use("/api/game", gameRoutes);

// Health check endpoint (useful for monitoring deployment)
app.get("/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Socket.io handler
socketHandler(io);

// Generic Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong on the server!" });
});

// Handle unhandled promise rejections (e.g., failed DB operations without .catch)
process.on("unhandledRejection", (err, promise) => {
  console.error("Unhandled Promise Rejection:", err);
  // Optional: Gracefully close server or exit process if critical
  // server.close(() => {
  //   process.exit(1);
  // });
});

// Handle uncaught exceptions (e.g., sync errors outside promise chain)
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Exit process to prevent application from running in an unstable state
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});