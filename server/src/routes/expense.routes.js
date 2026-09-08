import express from 'express';
import { z } from 'zod';
import { 
  getExpenses, 
  getExpense, 
  createExpense, 
  updateExpense, 
  deleteExpense 
} from '../controllers/expense.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const expenseSchema = z.object({
  body: z.object({
    amount: z.number().min(0, "Amount must be positive"),
    description: z.string().min(1, "Description is required"),
    category: z.enum([
      "food_dining", "transportation", "shopping", "entertainment", 
      "utilities", "healthcare", "education", "travel", "business", 
      "home_garden", "personal_care", "gifts_donations", 
      "subscriptions", "other"
    ]),
    date: z.string().datetime().or(z.date()).or(z.string()), // Accept various date formats, will be parsed by mongoose
    payment_method: z.enum([
      "cash", "credit_card", "debit_card", "bank_transfer", "digital_wallet"
    ]).optional(),
    notes: z.string().optional()
  })
});

const querySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional()
  })
});

router.route('/')
  .get(protect, validate(querySchema), getExpenses)
  .post(protect, validate(expenseSchema), createExpense);

router.route('/:id')
  .get(protect, getExpense)
  .put(protect, validate(expenseSchema), updateExpense)
  .delete(protect, deleteExpense);

export default router;
