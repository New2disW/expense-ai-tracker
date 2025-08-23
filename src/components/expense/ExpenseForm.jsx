
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Save } from "lucide-react";
import { InvokeLLM } from "@/integrations/Core";

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

const paymentMethods = [
  { value: "credit_card", label: "Credit Card" },
  { value: "debit_card", label: "Debit Card" },
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "digital_wallet", label: "Digital Wallet" }
];

export default function ExpenseForm({ expense, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState(expense || {
    amount: "",
    description: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
    payment_method: "credit_card",
    notes: ""
  });

  const [isCategorizingAI, setIsCategorizingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const categorizeWithAI = async () => {
    if (!formData.description.trim()) return;

    setIsCategorizingAI(true);
    try {
      const response = await InvokeLLM({
        prompt: `Analyze this expense description and categorize it: "${formData.description}"

        Available categories:
        - food_dining: Restaurants, groceries, coffee, meals
        - transportation: Gas, public transit, rideshare, parking
        - shopping: Clothes, electronics, household items, online purchases
        - entertainment: Movies, concerts, games, streaming
        - utilities: Electricity, water, gas, internet, phone
        - healthcare: Doctor visits, pharmacy, medical bills
        - education: Books, courses, school fees, training
        - travel: Hotels, flights, vacation expenses
        - business: Work-related expenses, office supplies
        - home_garden: Furniture, home improvement, gardening
        - personal_care: Haircut, cosmetics, spa, gym
        - gifts_donations: Presents, charity, tips
        - subscriptions: Monthly services, software, memberships
        - other: Anything that doesn't fit other categories

        Return only the category key (e.g., "food_dining") and a brief explanation.`,
        response_json_schema: {
          type: "object",
          properties: {
            category: { type: "string" },
            explanation: { type: "string" }
          }
        }
      });

      setAiSuggestion(response);
    } catch (error) {
      console.error("AI categorization failed:", error);
    }
    setIsCategorizingAI(false);
  };

  const acceptAISuggestion = () => {
    if (aiSuggestion) {
      handleInputChange('category', aiSuggestion.category);
      setAiSuggestion(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto rounded-lg bg-slate-900/60 backdrop-blur-md border border-slate-700/50">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-white">
          {expense ? 'Edit Expense Details' : 'Log a New Expense'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-bold text-slate-300">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="text-lg font-medium rounded-lg bg-slate-800/80 border-slate-600 text-white placeholder-slate-400 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-bold text-slate-300">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="rounded-lg bg-slate-800/80 border-slate-600 text-white placeholder-slate-400 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-bold text-slate-300">Description</Label>
            <div className="relative">
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="What did you spend money on?"
                className="resize-none rounded-lg bg-slate-800/80 border-slate-600 text-white placeholder-slate-400 focus:ring-emerald-500 focus:border-emerald-500"
                rows={3}
                required
              />
              <Button
                type="button"
                size="sm"
                onClick={categorizeWithAI}
                disabled={!formData.description.trim() || isCategorizingAI}
                className="absolute top-3 right-3 rounded-full bg-gradient-to-r from-[#4ECDC4] to-[#3CB3A6] text-white border-0 hover:opacity-90 transition-all duration-200 shadow-md shadow-[rgba(78,205,196,0.4)] flex items-center gap-2"
              >
                {isCategorizingAI ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                AI Categorize
              </Button>
            </div>
          </div>

          {aiSuggestion && (
            <div className="p-4 rounded-lg bg-emerald-900/30 border border-emerald-500/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">
                    AI suggests: <span className="font-bold text-emerald-300">{categoryLabels[aiSuggestion.category]}</span>
                  </p>
                  <p className="text-sm font-medium text-slate-300 mt-1">{aiSuggestion.explanation}</p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={acceptAISuggestion}
                  className="rounded-full bg-gradient-to-r from-[#4ECDC4] to-[#3CB3A6] text-white hover:opacity-90 transition-all duration-200"
                >
                  Accept
                </Button>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-bold text-slate-300">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
                required
              >
                <SelectTrigger
                  className="rounded-lg bg-slate-800/80 border-slate-600 text-white placeholder-slate-400 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_method" className="text-sm font-bold text-slate-300">Payment Method</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value) => handleInputChange('payment_method', value)}
              >
                <SelectTrigger
                  className="rounded-lg bg-slate-800/80 border-slate-600 text-white placeholder-slate-400 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                  {paymentMethods.map(method => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-bold text-slate-300">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes..."
              className="resize-none rounded-lg bg-slate-800/80 border-slate-600 text-white placeholder-slate-400 focus:ring-emerald-500 focus:border-emerald-500"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="rounded-full px-6 border-2 font-bold hover:bg-slate-800 transition-all duration-200 hover-lift text-white border-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-full px-8 accent-gradient text-white border-0 hover:opacity-90 font-bold teal-shadow hover-lift transition-all duration-200"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {expense ? 'Update' : 'Save'} Expense
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
