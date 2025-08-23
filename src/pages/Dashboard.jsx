import React, { useState, useEffect } from "react";
import { Expense } from "@/entities/Expense";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign, Calendar, TrendingUp, Receipt } from "lucide-react";
import StatsCard from "../components/dashboard/StatsCard";
import CategoryChart from "../components/dashboard/CategoryChart";
import ExpenseCard from "../components/expense/ExpenseForm";

// Define keyframes for background animations
const backgroundKeyframes = `
  @keyframes gradient-move {
    0% { background-position: 0% 0%; }
    50% { background-position: 100% 100%; }
    100% { background-position: 0% 0%; }
  }
  @keyframes fade-in-out {
    0% { opacity: 0.1; }
    25% { opacity: 0.2; }
    50% { opacity: 0.1; }
    75% { opacity: 0.2; }
    100% { opacity: 0.1; }
  }
`;

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await Expense.list('-created_date', 50);
      setExpenses(data);
    } catch (error) {
      console.error("Error loading expenses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (expenseId) => {
    try {
      await Expense.delete(expenseId);
      loadExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
  });
  const thisMonthAmount = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const avgExpense = expenses.length > 0 ? totalAmount / expenses.length : 0;
  const recentExpenses = expenses.slice(0, 6);

  if (isLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-950">
        {/* Embed keyframes for background animation */}
        <style dangerouslySetInnerHTML={{ __html: backgroundKeyframes }} />
        {/* Animated Background Layers for loading state */}
        <div className="fixed inset-0 w-full h-full -z-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
              style={{ backgroundSize: '200% 200%', animation: 'gradient-move 20s ease infinite alternate' }}>
        </div>
        {/* Overlay to ensure darkness */}
        <div className="fixed inset-0 w-full h-full bg-slate-900/80 -z-10"></div>

        <div className="p-6 md:p-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-700 rounded-lg w-64"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-32 bg-gray-700 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Embed keyframes for background animation */}
      <style dangerouslySetInnerHTML={{ __html: backgroundKeyframes }} />
      {/* Animated Background Layers */}
      <div className="fixed inset-0 w-full h-full -z-10 bg-slate-950">
        {/* Layer 1: Subtle moving gradient */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-900/10 via-slate-900/50 to-indigo-900/10"
              style={{ backgroundSize: '200% 200%', animation: 'gradient-move 30s ease infinite alternate' }}></div>
        {/* Layer 2: Radial blobs fading in/out */}
        <div className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(6,182,212,0.1) 0%, transparent 30%), radial-gradient(circle at 90% 80%, rgba(2,132,199,0.1) 0%, transparent 30%)',
                animation: 'fade-in-out 25s ease infinite alternate'
              }}></div>
        {/* Layer 3: Dark overlay for content readability */}
        <div className="absolute inset-0 w-full h-full bg-slate-900/80"></div>
      </div>

      <div className="relative z-10 p-6 md:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                Dashboard
              </h1>
              <p className="text-slate-300 font-medium">Your financial overview at a glance.</p>
            </div>
            <Link to={createPageUrl("AddExpense")}>
              <Button className="rounded-full px-8 py-3 accent-gradient-emerald text-white border-0 hover:opacity-90 font-bold shadow-lg shadow-emerald-500/20 hover-lift">
                <Plus className="w-5 h-5 mr-2" />
                Add Expense
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Expenses"
              value={`$${totalAmount.toFixed(2)}`}
              icon={DollarSign}
              change={`${expenses.length} transactions`}
            />
            <StatsCard
              title="This Month"
              value={`$${thisMonthAmount.toFixed(2)}`}
              icon={Calendar}
              change={`${thisMonthExpenses.length} this month`}
            />
            <StatsCard
              title="Average Expense"
              value={`$${avgExpense.toFixed(2)}`}
              icon={TrendingUp}
              change="per transaction"
            />
            <StatsCard
              title="Total Transactions"
              value={expenses.length.toString()}
              icon={Receipt}
              change="all time"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Recent Expenses</h2>
                  <Link to={createPageUrl("Expenses")}>
                    <Button
                      variant="outline"
                      className="rounded-full border-2 font-bold hover:bg-white/10 text-white border-white/30 hover-lift"
                    >
                      View All
                    </Button>
                  </Link>
                </div>

                {recentExpenses.length > 0 ? (
                  <div className="grid gap-4">
                    {recentExpenses.map((expense) => (
                      <ExpenseCard
                        key={expense.id}
                        expense={expense}
                        onEdit={(expense) => window.location.href = createPageUrl(`AddExpense?edit=${expense.id}`)}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-lg">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-emerald-500/10">
                      <Receipt className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-white">No expenses yet</h3>
                    <p className="text-slate-300 mb-6 font-medium">Add an expense to start tracking your finances.</p>
                    <Link to={createPageUrl("AddExpense")}>
                      <Button className="rounded-full px-8 py-3 accent-gradient-emerald text-white border-0 hover:opacity-90 font-bold shadow-lg shadow-emerald-500/20">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Expense
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div>
              <CategoryChart expenses={expenses} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}