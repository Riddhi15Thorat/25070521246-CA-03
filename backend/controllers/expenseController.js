import expenseModel from "../models/expenseModel.js";  
import getDateRange from "../utils/getDateRange.js";
import XLSX from "xlsx";

// add expense
export async function addExpense(req, res) {
    const userId = req.user._id; 
    const { description, amount, category, date } = req.body;
    
    try {
        if (!description || !amount || !category || !date) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const newExpense = new expenseModel({
            userId,
            description,
            amount,
            category,
            date: new Date(date)
        }); 
        
        await newExpense.save();
        
        res.status(201).json({
            success: true,
            message: "Expense added successfully"
        }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

// to get all expenses
export async function getAllExpenses(req, res) {
    const userId = req.user._id; 
    try {
        const expenses = await expenseModel.find({ userId }).sort({ date: -1 });
        res.json({ success: true, expenses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

// update expense
export async function updateExpense(req, res) {
    const { id } = req.params;
    const userId = req.user._id;
    const { description, amount, category, date } = req.body;

    try {
        const updatedExpense = await expenseModel.findOneAndUpdate(
            { _id: id, userId },
            { description, amount, category, date: new Date(date) },
            { new: true }
        );
        if (!updatedExpense) {
            return res.status(404).json({ success: false, message: "Expense not found or not authorized" });
        }
        res.json({ success: true, message: "Expense updated successfully", expense: updatedExpense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

// delete expense
export async function deleteExpense(req, res) {
    const { id } = req.params;
    const userId = req.user._id;
    
    try {
        const deletedExpense = await expenseModel.findOneAndDelete({ _id: id, userId });
        if (!deletedExpense) {
            return res.status(404).json({ success: false, message: "Expense not found or not authorized" });
        }
        res.json({ success: true, message: "Expense deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

// download excel for expenses
export async function downloadExpenses(req, res) {
    const userId = req.user._id;
    try {
        const expenses = await expenseModel.find({ userId }).sort({ date: -1 });
        const plainData = expenses.map(expense => ({
            Description: expense.description,
            Amount: expense.amount,
            Category: expense.category,
            Date: new Date(expense.date).toLocaleDateString()
        }));

        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
        
        const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

        res.setHeader("Content-Disposition", "attachment; filename=expense_details.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

// to get overview of expenses
export async function getExpenseOverview(req, res) {
    try {
        const userId = req.user._id;
        const { range = "monthly" } = req.query;
        const { startDate, endDate } = getDateRange(range);

        const expenses = await expenseModel.find({
            userId,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: -1 });

         const totalExpense = expense.reduce((acc, cur) => acc + cur.amount, 0);
    const averageExpense =
      expense.length > 0 ? totalExpense / expense.length : 0;
    const numberOfTransactions = expense.length;
    const recentTransactions = expense.slice(0, 5);
        res.json({
            success: true,
            data: {
                totalExpense,
                averageExpense,
                numberOfTransactions,
                recentTransactions,
                range
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}