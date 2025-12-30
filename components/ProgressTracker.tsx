import React, { useState } from 'react';
import { WeightLog } from '../types';
import { Plus, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressTrackerProps {
  logs: WeightLog[];
  onAddLog: (weight: number) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-app-surface border border-white/10 p-4 rounded-xl shadow-xl">
        <p className="text-app-textDim text-xs mb-1 font-medium">{label}</p>
        <p className="text-app-lime font-bold text-lg">
          {payload[0].value} kg
        </p>
      </div>
    );
  }
  return null;
};

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ logs, onAddLog }) => {
  const [newWeight, setNewWeight] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWeight) {
      onAddLog(parseFloat(newWeight));
      setNewWeight('');
    }
  };

  const currentWeight = logs.length > 0 ? logs[logs.length - 1].weight : 0;
  const startWeight = logs.length > 0 ? logs[0].weight : 0;
  const diff = currentWeight - startWeight;
  const isLoss = diff < 0;

  // Format data for chart
  const chartData = logs.map(log => ({
      name: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: log.weight
  })).slice(-10); // Show last 10 entries

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Stats Card */}
        <div className="md:col-span-4 space-y-6">
            <div className="bg-app-lavender rounded-[2rem] p-6 text-black">
                <h3 className="text-black/60 text-sm font-bold uppercase tracking-wider mb-4">Current Weight</h3>
                <div className="flex items-baseline space-x-2">
                    <span className="text-5xl font-bold tracking-tight">{currentWeight}</span>
                    <span className="text-black/60 font-medium">kg</span>
                </div>
                
                {logs.length > 1 && (
                    <div className="mt-4 flex items-center text-sm font-bold bg-black/10 w-fit px-3 py-1 rounded-full">
                        {isLoss ? <TrendingDown className="w-4 h-4 mr-1" /> : <TrendingUp className="w-4 h-4 mr-1" />}
                        <span>{Math.abs(diff).toFixed(1)} kg {isLoss ? 'lost' : 'gained'}</span>
                    </div>
                )}
            </div>

            <div className="bg-app-surface border border-white/5 rounded-[2rem] p-6">
                 <form onSubmit={handleSubmit}>
                    <label className="block text-xs font-bold text-app-textDim uppercase tracking-wider mb-3">Log Entry</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            step="0.1"
                            placeholder="0.0"
                            value={newWeight}
                            onChange={(e) => setNewWeight(e.target.value)}
                            className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-app-lime outline-none"
                        />
                        <button 
                            type="submit"
                            className="bg-app-lime text-black hover:bg-white p-3 rounded-xl transition-colors"
                        >
                            <Plus className="w-6 h-6" />
                        </button>
                    </div>
                </form>
            </div>
        </div>

        {/* Chart Card */}
        <div className="md:col-span-8 bg-app-surface border border-white/5 rounded-[2rem] p-8 min-h-[300px]">
            <h3 className="text-white text-lg font-bold mb-6">Weight Trend</h3>
            {logs.length > 0 ? (
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis 
                                dataKey="name" 
                                stroke="#71717a" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                tickMargin={10}
                            />
                            <YAxis 
                                stroke="#71717a" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                domain={['dataMin - 1', 'dataMax + 1']}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{stroke: '#D4FF00', strokeWidth: 1, strokeDasharray: '4 4'}} />
                            <Line 
                                type="monotone" 
                                dataKey="weight" 
                                stroke="#D4FF00" 
                                strokeWidth={3} 
                                dot={{r: 6, fill: '#09090b', stroke: '#D4FF00', strokeWidth: 3}} 
                                activeDot={{r: 8, fill: '#D4FF00', stroke: '#fff'}} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-app-textDim">
                    <Minus className="w-8 h-8 mb-2 opacity-50" />
                    <p>No data recorded yet</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;