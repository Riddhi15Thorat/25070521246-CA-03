import express from "express";
import cors from "cors";
import "dotenv/config"; // ya dotenv/config
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import incomeRouter from "./routes/incomeRoute.js";
import expenseRouter from "./routes/expenseRoute.js";
import dashboardRouter from "./routes/dashboardRoute.js";

const app = express(); // <-- Yeh line middleware (app.use) aur routes se pehle honi chahiye
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Connection
connectDB();

// Routes
app.use("/api/dashboard", dashboardRouter);
app.use("/api/user", userRouter);
app.use("/api/income", incomeRouter);
app.use("/api/expense", expenseRouter);

app.get("/", (req, res) => {
    res.send("API WORKING");
});

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});