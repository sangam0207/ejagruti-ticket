import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connectDB } from "./configs/db.config.js";
import dotenv from 'dotenv';
import ticketRoutes from './routes/tickets.route.js'
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js  '
dotenv.config(); 

const app = express();
const port = process.env.APP_PORT || 8000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello, I am your ai assistant');
});
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api', ticketRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDB();
});
