// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import { connectDB } from "./configs/db.config.js";
// import dotenv from 'dotenv';
// import ticketRoutes from './routes/tickets.route.js'
// import authRoutes from './routes/auth.route.js'
// import userRoutes from './routes/user.route.js  '
// dotenv.config(); 

// const app = express();
// const port = process.env.APP_PORT || 8000;

// app.use(cors());
// app.use(express.urlencoded({ extended: false }));
// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
// app.use(express.json());

// app.get('/', (req, res) => {
//     res.send('hello, I am your ai assistant');
// });
// app.use('/api/auth', authRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api', ticketRoutes);


// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//     connectDB();
// });

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connectDB } from "./configs/db.config.js";
import dotenv from "dotenv";
import ticketRoutes from "./routes/tickets.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js"; // <-- fixed trailing spaces/quote
dotenv.config();

const app = express();
const port = process.env.APP_PORT || 8000;

// --- CORS setup ---
const allowedOrigins = [
  "https://government-chat-bot-iota.vercel.app",   // prod vercel
  "http://localhost:3000",                         // local dev (Next/React)
  "http://127.0.0.1:3000",
  "http://localhost:5173",                         // local dev (Vite)
  "http://127.0.0.1:5173",
];

// optional: allow vercel preview URLs for THIS project
const vercelPreviewRegex = /^https:\/\/government-chat-bot-iota-.*\.vercel\.app$/;

const corsOptions = {
  origin: (origin, cb) => {
    // allow non-browser tools (curl/Postman) which send no Origin
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin) || vercelPreviewRegex.test(origin)) {
      return cb(null, true);
    }
    return cb(new Error("Not allowed by CORS: " + origin));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,       // set to true only if you use cookies/auth headers with credentials
  maxAge: 86400,           // cache preflight for 24h
};

// Use CORS BEFORE routes
app.use(cors(corsOptions));
// Handle preflight quickly
app.options("*", cors(corsOptions));

// Body parsers & security
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
// if you serve images/files cross-origin, keep this; otherwise you can remove it
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Routes
app.get("/", (req, res) => {
  res.send("hello, I am your ai assistant");
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api", ticketRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});
