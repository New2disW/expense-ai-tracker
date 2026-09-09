import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import AddExpense from '@/pages/AddExpense';
import Expenses from '@/pages/Expenses';
import Chat from '@/pages/Chat';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/Dashboard" />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/AddExpense" element={<AddExpense />} />
          <Route path="/Expenses" element={<Expenses />} />
          <Route path="/Chat" element={<Chat />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
