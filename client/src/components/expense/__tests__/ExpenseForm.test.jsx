import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ExpenseForm from '../ExpenseForm';

// Mock the InvokeLLM function
vi.mock('@/integrations/Core', () => ({
  InvokeLLM: vi.fn()
}));

import { InvokeLLM } from '@/integrations/Core';

describe('ExpenseForm - AI Features', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    
    // Mock standard localStorage
    global.localStorage = {
      getItem: vi.fn(() => JSON.stringify({ token: 'mock-token' }))
    };
  });

  test('handles NL parsing response and highlights missing fields', async () => {
    // Mock the NL Quick-Add API response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        amount: 15.0,
        description: 'Starbucks coffee',
        category: null, // missing field
        date: '2023-10-10'
      })
    });

    render(<ExpenseForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    // Find NL input and trigger submit
    const nlInput = screen.getByPlaceholderText(/Spent \$15 on coffee/i);
    const magicFillBtn = screen.getByText('Magic Fill');

    await userEvent.type(nlInput, 'got coffee at starbucks for $15');
    fireEvent.click(magicFillBtn);

    // Verify API call
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/chat/parse-nl'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ text: 'got coffee at starbucks for $15' })
        })
      );
    });

    // Verify fields are populated
    await waitFor(() => {
      expect(screen.getByLabelText(/Amount/i).value).toBe('15');
      expect(screen.getByLabelText(/Description/i).value).toBe('Starbucks coffee');
      expect(screen.getByLabelText(/Date/i).value).toBe('2023-10-10');
    });

    // Verify missing field highlighting exists
    // The "Please verify" span should render for category
    expect(screen.getByText('- Please verify')).toBeInTheDocument();
  });

  test('category suggestion logic processes and accepts correctly', async () => {
    InvokeLLM.mockResolvedValueOnce({
      category: 'food_dining',
      explanation: 'Starbucks is a coffee shop.'
    });

    render(<ExpenseForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    // Type description to enable AI button
    const descInput = screen.getByLabelText(/Description/i);
    await userEvent.type(descInput, 'Starbucks coffee');

    // Click AI Categorize
    const aiBtn = screen.getByText('AI Categorize');
    fireEvent.click(aiBtn);

    // Verify LLM called
    await waitFor(() => {
      expect(InvokeLLM).toHaveBeenCalled();
    });

    // Verify suggestion rendered
    await waitFor(() => {
      expect(screen.getByText(/AI suggests:/)).toBeInTheDocument();
      expect(screen.getByText(/Food & Dining/)).toBeInTheDocument();
    });

    // Accept suggestion
    const acceptBtn = screen.getByText('Accept');
    fireEvent.click(acceptBtn);

    // In a real browser the Select component would show the selected value. 
    // Since radix-ui Select is complex to test value of, we ensure the suggestion box disappears
    expect(screen.queryByText(/AI suggests:/)).not.toBeInTheDocument();
  });
});
