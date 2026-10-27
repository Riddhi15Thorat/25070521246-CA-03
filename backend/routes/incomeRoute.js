import express from "express";
import authMiddleware from "../middleware/auth.js";
import { addIncome, getAllIncome, updateIncome, deleteIncome, downloadIncomeExcel, getIncomeOverview } from "../controllers/incomeController.js";
const incomeRouter = express.Router();

incomeRouter.post("/add", authMiddleware, addIncome); // yahan "-income" hata kar "/add" kar diya
incomeRouter.get("/get", authMiddleware, getAllIncome); // yahan bhi "/get" kar sakte hain
incomeRouter.put("/update/:id", authMiddleware, updateIncome);
incomeRouter.delete("/delete/:id", authMiddleware, deleteIncome);
incomeRouter.get("/downloadexcel", authMiddleware, downloadIncomeExcel);

export default incomeRouter;