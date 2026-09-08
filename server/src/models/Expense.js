import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Indexing by user
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      "food_dining", "transportation", "shopping", "entertainment", 
      "utilities", "healthcare", "education", "travel", "business", 
      "home_garden", "personal_care", "gifts_donations", 
      "subscriptions", "other"
    ]
  },
  date: {
    type: Date,
    required: true,
    index: true // Indexing by date
  },
  payment_method: {
    type: String,
    enum: [
      "cash", "credit_card", "debit_card", "bank_transfer", "digital_wallet"
    ],
    default: "credit_card"
  },
  notes: {
    type: String,
    trim: true
  }
}, { timestamps: true });

// Compound index for user and date
expenseSchema.index({ user: 1, date: -1 });

export const Expense = mongoose.model('Expense', expenseSchema);
