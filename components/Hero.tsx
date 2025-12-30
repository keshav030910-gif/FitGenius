import React from 'react';
import { Activity, Zap, BarChart3, ArrowRight } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  const todayDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long' });

  return (
    <div className="relative isolate overflow-hidden min-h-[80vh] flex flex-col justify-center">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center rounded-full bg-app-surface border border-white/10 px-3 py-1 text-sm font-medium text-app-lime mb-6">
            <span className="flex h-2 w-2 rounded-full bg-app-lime mr-2 animate-pulse"></span>
            AI V2.0 Live
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Fitness <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-app-lime to-green-400">Reimagined</span>
          </h1>
          <p className="text-lg leading-8 text-app-textDim max-w-xl mx-auto lg:mx-0 mb-8">
            Your personal AI coach. Generates neon-styled, data-driven workout and diet plans tailored to your physiology.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <button
              onClick={onStart}
              className="w-full sm:w-auto rounded-full bg-app-lime px-8 py-4 text-sm font-bold text-black hover:bg-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Start Generating <ArrowRight className="w-4 h-4" />
            </button>
            <button className="w-full sm:w-auto rounded-full bg-app-surface border border-white/10 px-8 py-4 text-sm font-bold text-white hover:bg-white/5 transition-all">
              View Demo
            </button>
          </div>
        </div>
        
        {/* Visual Decoration */}
        <div className="flex-1 w-full max-w-md lg:max-w-full">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-app-lime/20 blur-3xl rounded-full opacity-50"></div>
            
            <div className="relative bg-app-surface border border-white/5 rounded-[2.5rem] p-6 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-white font-bold text-lg">Daily Summary</h3>
                        <p className="text-app-textDim text-xs">Today, {todayDate}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-app-lime/10 flex items-center justify-center border border-app-lime/20">
                        <Activity className="text-app-lime h-5 w-5" />
                    </div>
                </div>

                {/* Card 1 */}
                <div className="bg-app-lime rounded-3xl p-5 mb-4 text-black relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-sm bg-black/10 px-2 py-1 rounded-lg">Workout</span>
                            <Zap className="h-5 w-5 text-black" />
                        </div>
                        <h4 className="text-2xl font-bold mb-1">Lower Body</h4>
                        <p className="font-medium opacity-70 text-sm">45 mins • High Intensity</p>
                    </div>
                    <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/20 rounded-full -mr-8 -mb-8 blur-md"></div>
                </div>

                {/* Card 2 */}
                <div className="bg-app-lavender rounded-3xl p-5 flex items-center justify-between">
                     <div>
                        <p className="text-black/60 text-xs font-bold uppercase tracking-wider mb-1">Calories</p>
                        <h4 className="text-black text-xl font-bold">1,840 <span className="text-sm font-normal">kcal</span></h4>
                     </div>
                     <div className="h-12 w-12 rounded-full border-4 border-black/10 flex items-center justify-center">
                        <span className="text-black font-bold text-xs">72%</span>
                     </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;