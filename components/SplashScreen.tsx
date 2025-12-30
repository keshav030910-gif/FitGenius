import React from 'react';
import { Activity } from 'lucide-react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-app-bg">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-app-lime/20 blur-3xl rounded-full animate-pulse"></div>
        
        {/* Logo Container */}
        <div className="relative flex items-center justify-center w-28 h-28 bg-app-surface border border-app-lime/30 rounded-full shadow-2xl mb-8">
          <Activity className="w-12 h-12 text-app-lime" />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold text-white tracking-tight mb-3">
        FitGenius <span className="text-app-lime">AI</span>
      </h1>
      
      <p className="text-app-textDim text-sm font-medium tracking-wide uppercase">
        Personal AI Coach
      </p>

      {/* Loading Bar */}
      <div className="mt-12 w-48 h-1 bg-app-surfaceHighlight rounded-full overflow-hidden">
        <div className="h-full bg-app-lime animate-[loading_2s_ease-in-out_infinite]" style={{ width: '50%' }}></div>
      </div>
    </div>
  );
};

export default SplashScreen;