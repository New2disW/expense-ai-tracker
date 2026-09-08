import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Edit, Trash2, CreditCard, Wallet } from "lucide-react";

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

const paymentIcons = {
  credit_card: CreditCard,
  debit_card: CreditCard,
  cash: Wallet,
  bank_transfer: CreditCard,
  digital_wallet: Wallet
};

export default function ExpenseCard({ expense, onEdit, onDelete }) {
  const PaymentIcon = paymentIcons[expense.payment_method] || CreditCard;
  
  return (
    <Card className="bg-white border shadow-md rounded-lg hover-lift transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="font-bold text-lg" style={{ color: '#1A1A1A' }}>
                {expense.description}
              </h3>
              <Badge 
                className="border-0 font-medium px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: '#4ECDC4' }}
              >
                {categoryLabels[expense.category]}
              </Badge>
            </div>
            <p className="text-3xl font-bold" style={{ color: '#4ECDC4' }}>
              ${expense.amount.toFixed(2)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(expense)}
              className="rounded-full border-2 hover:border-gray-300 transition-all duration-200 hover-lift"
            >
              <Edit className="w-4 h-4" style={{ color: '#1A1A1A' }} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(expense.id)}
              className="rounded-full border-2 hover:border-red-300 hover:bg-red-50 transition-all duration-200 hover-lift"
            >
              <Trash2 className="w-4 h-4 hover:text-red-600" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <PaymentIcon className="w-4 h-4" style={{ color: '#4ECDC4' }} />
            <span className="capitalize font-medium">{expense.payment_method.replace('_', ' ')}</span>
          </div>
          <span className="font-medium">{format(new Date(expense.date), "MMM d, yyyy")}</span>
        </div>
        
        {expense.notes && (
          <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
            <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{expense.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}