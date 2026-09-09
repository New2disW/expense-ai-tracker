import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '@/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wallet, Loader2 } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/Dashboard';

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      navigate(from, { replace: true });
    } catch (err) {
      if (!err.response) {
        setError("Can't reach the server, please try again");
      } else if (err.response.status === 400 || err.response.status === 409) {
        // Backend returns 400 for 'User already exists'
        setError("An account with this email already exists");
      } else {
        setError(err.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans slideshow-bg">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 accent-gradient-emerald rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">ExpenseAI</span>
        </Link>
        
        <Card className="bg-slate-900/80 border-white/10 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-white text-center">Create an account</CardTitle>
            <CardDescription className="text-slate-400 text-center">
              Enter your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm mb-6">
                {error}
              </div>
            )}
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                <Input 
                  id="name" 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  className="bg-slate-950/50 border-white/10 text-white focus:border-emerald-500"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="bg-slate-950/50 border-white/10 text-white focus:border-emerald-500"
                  placeholder="name@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  minLength={6}
                  className="bg-slate-950/50 border-white/10 text-white focus:border-emerald-500"
                />
              </div>
              
              <Button type="submit" disabled={loading} className="w-full h-11 accent-gradient-emerald border-0 text-white mt-6">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign up'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" state={{ from: location.state?.from }} className="text-emerald-400 hover:text-emerald-300 font-medium">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
