
import React, { useState, useEffect } from "react";
import { Expense } from "@/entities/Expense";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ExpenseForm from "../components/expense/ExpenseForm";

export default function AddExpense() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    
    if (editId) {
      loadExpenseForEdit(editId);
    }
  }, []);

  const loadExpenseForEdit = async (expenseId) => {
    try {
      const expenses = await Expense.list();
      const expense = expenses.find(e => e.id === expenseId);
      if (expense) {
        setEditingExpense(expense);
      }
    } catch (error) {
      console.error("Error loading expense for edit:", error);
    }
  };

  const handleSubmit = async (expenseData) => {
    setIsLoading(true);
    try {
      if (editingExpense) {
        await Expense.update(editingExpense.id, expenseData);
      } else {
        await Expense.create(expenseData);
      }
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Error saving expense:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(createPageUrl("Dashboard"));
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={handleCancel}
            className="rounded-full border-2 hover:bg-white/10 transition-all duration-200 text-white border-white/30"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h1>
            <p className="text-slate-300 font-medium">
              {editingExpense ? 'Update your expense details' : 'Track your spending with AI-powered categorization'}
            </p>
          </div>
        </div>

        <ExpenseForm
          expense={editingExpense}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
