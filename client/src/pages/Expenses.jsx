
import React, { useState, useEffect } from "react";
import { Expense } from "@/entities/Expense";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ExpenseCard from "../components/expense/ExpenseForm";

const categoryLabels = {
  food_dining: "Food & Dining",
  transportation: "Transportation",
  shopping: "Shopping",
  entertainment: "Entertainment",
  utilities: "Utilities",
  healthcare: "Healthcare",
  education: "Education",
  travel: "Travel",
  business: "Business",
  home_garden: "Home & Garden",
  personal_care: "Personal Care",
  gifts_donations: "Gifts & Donations",
  subscriptions: "Subscriptions",
  other: "Other"
};

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    filterAndSortExpenses();
  }, [expenses, searchTerm, categoryFilter, sortBy]);

  const loadExpenses = async () => {
    try {
      const data = await Expense.list('-created_date');
      setExpenses(data);
    } catch (error) {
      console.error("Error loading expenses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortExpenses = () => {
    let filtered = [...expenses];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(expense => expense.category === categoryFilter);
    }

    // Sort expenses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date) - new Date(a.date);
        case "amount_high":
          return b.amount - a.amount;
        case "amount_low":
          return a.amount - b.amount;
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    setFilteredExpenses(filtered);
  };

  const handleDelete = async (expenseId) => {
    try {
      await Expense.delete(expenseId);
      loadExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleEdit = (expense) => {
    window.location.href = createPageUrl(`AddExpense?edit=${expense.id}`);
  };

  const exportExpenses = () => {
    const csvContent = [
      ['Date', 'Description', 'Amount', 'Category', 'Payment Method', 'Notes'].join(','),
      ...filteredExpenses.map(expense => [
        expense.date,
        `"${expense.description}"`,
        expense.amount,
        categoryLabels[expense.category],
        expense.payment_method.replace('_', ' '),
        `"${expense.notes || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'expenses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (isLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-900">
        <style>
          {`
            .slideshow-background {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              overflow: hidden;
              z-index: -1;
            }

            .slideshow-image {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-size: cover;
              background-position: center;
              opacity: 0;
              animation: imageAnimation 30s infinite;
              filter: brightness(0.6) blur(2px);
              transform: scale(1);
            }

            .slideshow-image:nth-child(1) {
              background-image: url('https://images.unsplash.com/photo-1542831371-d68b64e62a0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzcxMjV8MHwxfHNlYXJjaHwxfHxkYXJrJTIwY3liYmVycHVua3xlbnwwfHx8fDE3MDYyNzAwNDJ8MA&ixlib=rb-4.0.3&q=80&w=1080');
            }
            .slideshow-image:nth-child(2) {
              background-image: url('https://images.unsplash.com/photo-1522252234503-e856403721c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzcxMjV8MHwxfHNlYXJjaHwxfHxkYXJrJTIwdGVjaG5vbG9neXxlbnwwfHx8fDE3MDYyNzAwNzR8MA&ixlib=rb-4.0.3&q=80&w=1080');
              animation-delay: 7.5s;
            }
            .slideshow-image:nth-child(3) {
              background-image: url('https://images.unsplash.com/photo-1509062970795-0f8c85775c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzcxMjV8MHwxfHNlYXJjaHwxfHxkYXJrJTIwYWJzdHJhY3R8ZW5mY3wxfHx8MTcwNjI3MDEwM3ww&ixlib=rb-4.0.3&q=80&w=1080');
              animation-delay: 15s;
            }
            .slideshow-image:nth-child(4) {
              background-image: url('https://images.unsplash.com/photo-1533276537750-71649646b9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzcxMjV8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZmFudGFzeXxlbnwwfHx8fDE3MDYyNzAwODJ8MA&ixlib=rb-4.0.3&q=80&w=1080');
              animation-delay: 22.5s;
            }

            @keyframes imageAnimation {
              0% { opacity: 0; animation-timing-function: ease-in; transform: scale(1); }
              10% { opacity: 1; transform: scale(1.05); animation-timing-function: ease-out; }
              25% { opacity: 1; transform: scale(1.1); }
              35% { opacity: 0; transform: scale(1.1); }
              100% { opacity: 0; }
            }

            .accent-gradient-gold {
              background-image: linear-gradient(to right, #FFD700, #FFA500, #FFD700);
            }
          `}
        </style>
        <div className="slideshow-background">
          <div className="slideshow-image"></div>
          <div className="slideshow-image"></div>
          <div className="slideshow-image"></div>
          <div className="slideshow-image"></div>
        </div>
        <div className="p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-slate-700 rounded w-64"></div>
              <div className="grid gap-4">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-32 bg-slate-800 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900">
      <style>
        {`
          .slideshow-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: -1;
          }

          .slideshow-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
            opacity: 0;
            animation: imageAnimation 30s infinite;
            filter: brightness(0.6) blur(2px);
            transform: scale(1);
          }

          .slideshow-image:nth-child(1) {
            background-image: url('https://images.unsplash.com/photo-1542831371-d68b64e62a0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzcxMjV8MHwxfHNlYXJjaHwxfHxkYXJrJTIwY3liYmVycHVua3xlbnwwfHx8fDE3MDYyNzAwNDJ8MA&ixlib=rb-4.0.3&q=80&w=1080');
          }
          .slideshow-image:nth-child(2) {
            background-image: url('https://images.unsplash.com/photo-1522252234503-e856403721c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzcxMjV8MHwxfHNlYXJjaHwxfHxkYXJrJTIwdGVjaG5vbG9neXxlbnwwfHx8fDE3MDYyNzAwNzR8MA&ixlib=rb-4.0.3&q=80&w=1080');
            animation-delay: 7.5s;
          }
          .slideshow-image:nth-child(3) {
            background-image: url('https://images.unsplash.com/photo-1509062970795-0f8c85775c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzcxMjV8MHwxfHNlYXJjaHwxfHxkYXJrJTIwYWJzdHJhY3R8ZW5mY3wxfHx8MTcwNjI3MDEwM3ww&ixlib=rb-4.0.3&q=80&w=1080');
            animation-delay: 15s;
          }
          .slideshow-image:nth-child(4) {
            background-image: url('https://images.unsplash.com/photo-1533276537750-71649646b9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzcxMjV8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZmFudGFzeXxlbnwwfHx8fDE3MDYyNzAwODJ8MA&ixlib=rb-4.0.3&q=80&w=1080');
            animation-delay: 22.5s;
          }

          @keyframes imageAnimation {
            0% { opacity: 0; animation-timing-function: ease-in; transform: scale(1); }
            10% { opacity: 1; transform: scale(1.05); animation-timing-function: ease-out; }
            25% { opacity: 1; transform: scale(1.1); }
            35% { opacity: 0; transform: scale(1.1); }
            100% { opacity: 0; }
          }

          .accent-gradient-gold {
            background-image: linear-gradient(to right, #FFD700, #FFA500, #FFD700);
          }
        `}
      </style>
      <div className="slideshow-background">
        <div className="slideshow-image"></div>
        <div className="slideshow-image"></div>
        <div className="slideshow-image"></div>
        <div className="slideshow-image"></div>
      </div>

      <div className="p-6 md:p-8 min-h-screen relative z-10"> {/* Added relative z-10 to ensure content is above background */}
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                All Expenses
              </h1>
              <div className="flex items-center gap-4 text-slate-300">
                <span className="font-medium">{filteredExpenses.length} expenses</span>
                <Badge
                  className="border-0 font-bold px-4 py-1 rounded-full text-white accent-gradient-gold"
                >
                  Total: ${totalAmount.toFixed(2)}
                </Badge>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={exportExpenses}
                disabled={filteredExpenses.length === 0}
                className="rounded-full border-2 font-bold hover:bg-gray-800 hover-lift transition-all duration-200 text-white border-slate-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Link to={createPageUrl("AddExpense")}>
                <Button className="rounded-full px-8 py-3 accent-gradient-indigo text-white border-0 hover:opacity-90 font-bold indigo-shadow hover-lift transition-all duration-200">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Expense
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-lg p-6 hover-lift">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800/80 rounded-lg border-slate-600 text-white placeholder-slate-400 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48 bg-slate-800/80 border-slate-600 text-white rounded-lg">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48 bg-slate-800/80 border-slate-600 text-white rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                  <SelectItem value="date">Sort by Date</SelectItem>
                  <SelectItem value="amount_high">Amount: High to Low</SelectItem>
                  <SelectItem value="amount_low">Amount: Low to High</SelectItem>
                  <SelectItem value="category">Sort by Category</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-slate-900/60 backdrop-blur-md rounded-lg border border-slate-700/50 shadow-md">
                <div className="w-20 h-20 mx-auto mb-6 rounded-lg flex items-center justify-center bg-indigo-500/10">
                  <Search className="w-10 h-10 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">
                  {expenses.length === 0 ? "No expenses yet" : "No expenses match your filters"}
                </h3>
                <p className="text-slate-300 mb-6 font-medium">
                  {expenses.length === 0
                    ? "Start tracking your expenses to see them here"
                    : "Try adjusting your search or filters"
                  }
                </p>
                {expenses.length === 0 && (
                  <Link to={createPageUrl("AddExpense")}>
                    <Button className="rounded-full px-8 py-3 accent-gradient-indigo text-white border-0 hover:opacity-90 font-bold indigo-shadow transition-all duration-200">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Expense
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
