import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wallet, Sparkles, TrendingUp, Shield, Zap, ArrowRight } from 'lucide-react';

export default function Landing() {
  const userInfo = localStorage.getItem('userInfo');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans slideshow-bg">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 accent-gradient-emerald rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">ExpenseAI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">How it Works</a>
              <a href="#faq" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">FAQ</a>
            </div>
            <div className="flex items-center gap-4">
              {userInfo ? (
                <>
                  <Button variant="ghost" asChild className="hidden sm:inline-flex text-slate-300 hover:text-white hover:bg-white/10">
                    <Link to="/Dashboard">Dashboard</Link>
                  </Button>
                  <Button asChild className="accent-gradient-emerald border-0 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 text-white font-medium">
                    <Link to="/Dashboard">Go to App <ArrowRight className="w-4 h-4 ml-2" /></Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="hidden sm:inline-flex text-slate-300 hover:text-white hover:bg-white/10">
                    <Link to="/login">Log in</Link>
                  </Button>
                  <Button asChild className="accent-gradient-emerald border-0 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 text-white font-medium">
                    <Link to="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Financial Clarity</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Smart Expense Tracking <br className="hidden sm:block" />
            <span className="text-emerald-400">On Autopilot</span>
          </h1>
          <p className="mt-4 text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Stop categorizing spreadsheets manually. ExpenseAI uses advanced natural language processing to organize, categorize, and analyze your spending instantly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild className="h-14 px-8 text-lg accent-gradient-emerald border-0 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all duration-300">
              <Link to={userInfo ? "/Dashboard" : "/register"}>
                Start Tracking Free <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-14 px-8 text-lg border-white/20 hover:bg-white/5 text-slate-950 bg-white">
              <a href="#features">Explore Features</a>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-slate-900/50 border-y border-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything you need to take control</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Powerful features designed to make managing your finances effortless and insightful.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-slate-800/50 border border-white/10 hover-lift">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Instant Categorization</h3>
                <p className="text-slate-400 leading-relaxed">Just type "Bought coffee at Starbucks for $4.50" and our AI instantly parses the amount, vendor, and category.</p>
              </div>
              <div className="p-8 rounded-2xl bg-slate-800/50 border border-white/10 hover-lift">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Visual Insights</h3>
                <p className="text-slate-400 leading-relaxed">Beautiful, interactive charts that help you understand your spending habits at a glance.</p>
              </div>
              <div className="p-8 rounded-2xl bg-slate-800/50 border border-white/10 hover-lift">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
                <p className="text-slate-400 leading-relaxed">Your financial data is encrypted and strictly private. We never sell your data or show advertisements.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How it works</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Get started in seconds, not hours.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-2xl font-bold mb-6">1</div>
                <h3 className="text-xl font-bold mb-2">Create an account</h3>
                <p className="text-slate-400">Sign up securely in under a minute.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-2xl font-bold mb-6">2</div>
                <h3 className="text-xl font-bold mb-2">Log your expenses</h3>
                <p className="text-slate-400">Use natural language or our chat interface to quickly add transactions.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-2xl font-bold mb-6">3</div>
                <h3 className="text-xl font-bold mb-2">Gain insights</h3>
                <p className="text-slate-400">Watch your dashboard populate with actionable financial metrics.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-slate-900/50 border-y border-white/5">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-slate-800/50 border border-white/10">
                <h4 className="text-lg font-bold mb-2">Is ExpenseAI free to use?</h4>
                <p className="text-slate-400">Yes, the core tracking and AI categorization features are currently completely free.</p>
              </div>
              <div className="p-6 rounded-xl bg-slate-800/50 border border-white/10">
                <h4 className="text-lg font-bold mb-2">How accurate is the AI categorization?</h4>
                <p className="text-slate-400">Our AI uses state-of-the-art LLMs to understand context, making it over 95% accurate for typical transactions.</p>
              </div>
              <div className="p-6 rounded-xl bg-slate-800/50 border border-white/10">
                <h4 className="text-lg font-bold mb-2">Do I need to link my bank account?</h4>
                <p className="text-slate-400">No! ExpenseAI is designed for manual entry via natural language, keeping you fully in control of your data without requiring bank credentials.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Wallet className="w-5 h-5 text-emerald-500" />
            <span className="font-bold tracking-tight">ExpenseAI</span>
          </div>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} ExpenseAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
