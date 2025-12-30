import React from 'react';
import { VisitStats } from '../types';
import { Calendar, Flame, ArrowRight, Clock } from 'lucide-react';

interface WelcomeScreenProps {
  stats: VisitStats;
  onContinue: () => void;
  userName?: string;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ stats, onContinue, userName }) => {
  const visitDate = stats.lastVisitTime ? new Date(stats.lastVisitTime) : new Date();

  const formattedDate = visitDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
  
  const formattedTime = visitDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 animate-fadeIn">
      <div className="w-full max-w-sm bg-app-surface border border-white/5 rounded-[2.5rem] p-8 text-center shadow-2xl relative overflow-hidden">
        
        {/* Decor */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-app-lime via-white to-app-lavender"></div>

        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-app-lime mb-6 border-4 border-black shadow-lg shadow-app-lime/20">
            <Calendar className="w-8 h-8 text-black" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-app-textDim mb-6 text-sm">Ready to crush your goals today?</p>

        {/* Date & Time Check-in */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-black/40 flex items-center justify-center text-app-textDim">
                        <Clock className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-bold text-app-textDim uppercase tracking-wider">Checked In</p>
                        <p className="text-white font-medium text-xs">{formattedDate}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-app-lime font-bold text-lg">{formattedTime}</p>
                 </div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                <div className="flex items-center justify-center space-x-1 text-app-lime mb-1">
                    <Flame className="w-5 h-5" fill="currentColor" />
                    <span className="font-bold text-xl">{stats.streak}</span>
                </div>
                <div className="text-[10px] text-app-textDim font-bold uppercase tracking-wider">Day Streak</div>
            </div>
            <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                 <div className="flex items-center justify-center space-x-1 text-app-lavender mb-1">
                    <span className="font-bold text-xl">{stats.totalVisits}</span>
                </div>
                <div className="text-[10px] text-app-textDim font-bold uppercase tracking-wider">Check-ins</div>
            </div>
        </div>

        <button 
            onClick={onContinue}
            className="w-full flex items-center justify-center bg-white text-black font-bold py-4 rounded-2xl hover:bg-app-lime transition-all group shadow-lg"
        >
            Open Dashboard
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;