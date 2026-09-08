import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatsCard({ title, value, change, icon: Icon, trend }) {
  const isPositive = trend === 'up';
  
  return (
    <Card className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-lg hover-lift transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-300 mb-2">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {change && (
              <div className={`flex items-center mt-3 text-sm ${
                isPositive ? 'text-red-400' : 'text-emerald-400'
              }`}>
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                <span className="font-medium">{change}</span>
              </div>
            )}
          </div>
          <div 
            className="w-14 h-14 rounded-lg flex items-center justify-center bg-emerald-500/10"
          >
            <Icon className="w-7 h-7 text-emerald-300" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}