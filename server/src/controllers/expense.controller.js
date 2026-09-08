import * as expenseService from '../services/expense.service.js';

export const getExpenses = async (req, res, next) => {
  try {
    const { page, limit, sortBy } = req.query;
    const result = await expenseService.getExpenses(req.user._id, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 50,
      sortBy: sortBy || '-date'
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.getExpenseById(req.params.id, req.user._id);
    res.json(expense);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

export const createExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.createExpense(req.user._id, req.body);
    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.updateExpense(req.params.id, req.user._id, req.body);
    res.json(expense);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    await expenseService.deleteExpense(req.params.id, req.user._id);
    res.json({ message: 'Expense removed' });
  } catch (error) {
    res.status(404);
    next(error);
  }
};
