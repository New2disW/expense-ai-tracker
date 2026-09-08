import { Expense } from '../models/Expense.js';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const syncWithAIService = async (action, expense, userId, retries = 3) => {
  const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
  const serviceSecret = process.env.SERVICE_SECRET || 'your_service_secret_here';
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(`${aiServiceUrl}/api/expenses/sync`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-service-secret': serviceSecret 
        },
        body: JSON.stringify({
          action,
          expense_id: expense._id.toString(),
          user_id: userId.toString(),
          amount: expense.amount || 0,
          description: expense.description || '',
          category: expense.category || '',
          date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : ''
        })
      });
      
      if (response.ok) return; // Sync successful
      console.warn(`AI Sync non-ok response: ${response.status}`);
    } catch (error) {
      console.error(`Error syncing with AI service (Attempt ${i + 1}/${retries}):`, error.message);
    }
    
    // Exponential backoff
    if (i < retries - 1) {
      await sleep(1000 * Math.pow(2, i));
    }
  }
  
  console.error(`CRITICAL: AI Sync failed for expense ${expense._id} after ${retries} attempts. FAISS index may be stale.`);
};

export const getExpenses = async (userId, { page = 1, limit = 50, sortBy = '-date' }) => {
  const skip = (page - 1) * limit;
  const sort = sortBy.startsWith('-') 
    ? { [sortBy.substring(1)]: -1 } 
    : { [sortBy]: 1 };

  const expenses = await Expense.find({ user: userId })
    .sort(sort)
    .skip(skip)
    .limit(limit);
  
  const total = await Expense.countDocuments({ user: userId });

  return { expenses, total, page, pages: Math.ceil(total / limit) };
};

export const getExpenseById = async (expenseId, userId) => {
  const expense = await Expense.findOne({ _id: expenseId, user: userId });
  if (!expense) throw new Error('Expense not found');
  return expense;
};

export const createExpense = async (userId, expenseData) => {
  const expense = await Expense.create({ ...expenseData, user: userId });
  await syncWithAIService('upsert', expense, userId);
  return expense;
};

export const updateExpense = async (expenseId, userId, expenseData) => {
  const expense = await Expense.findOneAndUpdate(
    { _id: expenseId, user: userId },
    expenseData,
    { new: true, runValidators: true }
  );
  if (!expense) throw new Error('Expense not found');
  await syncWithAIService('upsert', expense, userId);
  return expense;
};

export const deleteExpense = async (expenseId, userId) => {
  const expense = await Expense.findOneAndDelete({ _id: expenseId, user: userId });
  if (!expense) throw new Error('Expense not found');
  await syncWithAIService('delete', expense, userId);
  return { id: expenseId };
};

