import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Bot, User, Loader2, Receipt } from "lucide-react";
import api from '../api'; // Use our api wrapper to automatically send the JWT token
import axios from 'axios';

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your AI financial assistant. Ask me anything about your expenses, for example: 'How much did I spend on food last month?'",
      sources: []
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get the current user info to send the user_id to the AI service
      // We assume user_id is in the JWT or local storage. In a real app, the API Gateway would attach this.
      // For now, we'll fetch /api/auth/me from the Node server to get our user ID.
      const authRes = await api.get('/auth/me');
      const userId = authRes.data._id;

      // Make request to AI Service (which is running on a different port)
      const aiServiceUrl = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';
      const response = await axios.post(`${aiServiceUrl}/api/chat/query`, {
        user_id: userId,
        question: userMessage.content
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.answer,
        sources: response.data.sources
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting to the AI service right now. Please try again later.",
        sources: []
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 p-6 md:p-8">
      {/* Background gradients similar to Dashboard */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-900/10 via-slate-900/50 to-indigo-900/10"></div>
        <div className="absolute inset-0 w-full h-full bg-slate-900/80"></div>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-6rem)] bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50 bg-slate-800/40 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Ask Your Expenses</h1>
            <p className="text-slate-400 text-sm font-medium">Retrieval-Augmented AI Assistant</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                msg.role === 'user' ? 'bg-indigo-500/20' : 'bg-emerald-500/20'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-indigo-400" /> : <Bot className="w-5 h-5 text-emerald-400" />}
              </div>
              
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end text-right' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-slate-700/50'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
                
                {/* Source Cards */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 space-y-2 text-left">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-2">Based on these transactions:</p>
                    <div className="flex flex-wrap gap-2">
                      {msg.sources.map((source, sIdx) => (
                        <div key={sIdx} className="bg-slate-800/60 border border-slate-600/50 rounded-lg p-3 flex items-center gap-3 w-full sm:w-[calc(50%-0.5rem)] hover:bg-slate-800 transition-colors">
                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                            <Receipt className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-200 truncate">{source.description}</p>
                            <p className="text-xs text-slate-400 flex justify-between gap-2">
                              <span>{source.date.split('T')[0]}</span>
                              <span className="text-emerald-400 font-bold">${source.amount.toFixed(2)}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 text-slate-200 rounded-tl-none border border-slate-700/50 flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                <span className="text-sm font-medium animate-pulse">Searching your expenses...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-slate-800/40 border-t border-slate-700/50">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., What was my biggest expense this month?"
              className="flex-1 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:ring-emerald-500 focus:border-emerald-500 h-12 text-base rounded-full px-6"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="h-12 w-12 rounded-full p-0 flex items-center justify-center accent-gradient-emerald hover-lift border-0 shadow-lg shadow-emerald-500/20"
            >
              <Send className="w-5 h-5 text-white ml-1" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
