import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import AddExpense from '@/pages/AddExpense';
import Expenses from '@/pages/Expenses';
import Chat from '@/pages/Chat';

// A wrapper that combines the auth check and the sidebar layout
const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes inside the Layout */}
        <Route element={<ProtectedLayout />}>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/AddExpense" element={<AddExpense />} />
          <Route path="/Expenses" element={<Expenses />} />
          <Route path="/Chat" element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
