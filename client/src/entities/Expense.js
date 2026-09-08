import api from '../api';

export const Expense = {
  name: "Expense",
  type: "object",
  properties: {
    amount: { type: "number", description: "The expense amount" },
    description: { type: "string", description: "Description of the expense" },
    category: {
      type: "string",
      enum: [
        "food_dining", "transportation", "shopping", "entertainment",
        "utilities", "healthcare", "education", "travel", "business",
        "home_garden", "personal_care", "gifts_donations",
        "subscriptions", "other",
      ],
      description: "Expense category",
    },
    date: { type: "string", format: "date", description: "Date of the expense" },
    payment_method: {
      type: "string",
      enum: [
        "cash", "credit_card", "debit_card", "bank_transfer", "digital_wallet",
      ],
      default: "credit_card",
      description: "Payment method used",
    },
    notes: { type: "string", description: "Additional notes" },
  },
  required: ["amount", "description", "category", "date"],

  list: async (sortBy = '-date', limit = 50, page = 1) => {
    try {
      const response = await api.get('/expenses', {
        params: { sortBy, limit, page }
      });
      // The API returns { expenses, total, page, pages }
      // The React frontend maps over `id`, MongoDB uses `_id`. We map it to avoid breaking frontend.
      return response.data.expenses.map(exp => ({ ...exp, id: exp._id }));
    } catch (error) {
      console.error("API List Error:", error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/expenses', data);
      return { ...response.data, id: response.data._id };
    } catch (error) {
      console.error("API Create Error:", error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/expenses/${id}`, data);
      return { ...response.data, id: response.data._id };
    } catch (error) {
      console.error("API Update Error:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/expenses/${id}`);
      return response.data;
    } catch (error) {
      console.error("API Delete Error:", error);
      throw error;
    }
  }
};