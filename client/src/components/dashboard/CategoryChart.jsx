import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = [
  '#34d399', '#fbbf24', '#60a5fa', '#f87171', 
  '#818cf8', '#a78bfa', '#f472b6', '#4ade80'
];

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

export default function CategoryChart({ expenses }) {
  const categoryData = expenses.reduce((acc, expense) => {
    const category = expense.category || 'other';
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {});

  const chartData = Object.entries(categoryData).map(([category, amount]) => ({
    name: categoryLabels[category] || category,
    value: amount,
    category: category
  })).sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return (
      <Card className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-white">
            Spending by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-slate-400">
            <p>No expense data available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-lg hover-lift">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-white">
          Spending by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                animationDuration={1000}
                className="animate-chart-draw"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => (
                  <span className="text-sm font-medium text-slate-200">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}