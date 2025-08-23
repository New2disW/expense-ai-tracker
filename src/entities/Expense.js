// src/entities/Expense.js

export const Expense = {
  name: "Expense",
  type: "object",
  properties: {
    amount: {
      type: "number",
      description: "The expense amount",
    },
    description: {
      type: "string",
      description: "Description of the expense",
    },
    category: {
      type: "string",
      enum: [
        "food_dining",
        "transportation",
        "shopping",
        "entertainment",
        "utilities",
        "healthcare",
        "education",
        "travel",
        "business",
        "home_garden",
        "personal_care",
        "gifts_donations",
        "subscriptions",
        "other",
      ],
      description: "Expense category",
    },
    date: {
      type: "string",
      format: "date",
      description: "Date of the expense",
    },
    payment_method: {
      type: "string",
      enum: [
        "cash",
        "credit_card",
        "debit_card",
        "bank_transfer",
        "digital_wallet",
      ],
      default: "credit_card",
      description: "Payment method used",
    },
    notes: {
      type: "string",
      description: "Additional notes",
    },
  },
  required: ["amount", "description", "category", "date"],
};