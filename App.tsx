import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import OnboardingForm from './components/OnboardingForm';
import PlanDashboard from './components/PlanDashboard';
import WelcomeScreen from './components/WelcomeScreen';
import SplashScreen from './components/SplashScreen';
import { UserProfile, FitnessPlan, VisitStats } from './types';
import { generateFitnessPlan } from './services/gemini';
import { savePlan, getPlan, saveProfile, recordVisit, clearData } from './services/storage';
import { Activity, Bell } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'splash' | 'hero' | 'form' | 'plan' | 'welcome'>('splash');
  const [plan, setPlan] = useState<FitnessPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visitStats, setVisitStats] = useState<VisitStats>({ lastVisit: null, lastVisitTime: null, streak: 0, totalVisits: 0 });

  useEffect(() => {
    const initApp = async () => {
        // Record visit immediately
        const stats = recordVisit();
        setVisitStats(stats);
        
        // Wait for splash screen (simulating load/branding)
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Check local storage for existing session/plan
        const storedPlan = getPlan();

        if (storedPlan) {
            setPlan(storedPlan);
            setView('welcome');
        } else {
            setView('hero');
        }
    };

    initApp();
  }, []);

  const handleStart = () => setView('form');

  const handleFormSubmit = async (profile: UserProfile) => {
    setLoading(true);
    setError(null);
    try {
      const generatedPlan = await generateFitnessPlan(profile);
      setPlan(generatedPlan);
      savePlan(generatedPlan);
      saveProfile(profile);
      
      // If first time, skip welcome and go straight to plan
      setView('plan');
    } catch (err) {
      setError("Failed to generate plan. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    // Immediately clear data and return to front page (Hero)
    clearData();
    setPlan(null);
    setView('hero');
    setError(null);
  };

  const handleWelcomeContinue = () => {
    setView('plan');
  };

  if (view === 'splash') {
      return <SplashScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-app-lime/30 selection:text-app-lime animate-fadeIn">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-app-bg/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex h-20 justify-between items-center">
            <div className="flex items-center cursor-pointer gap-3" onClick={() => view !== 'hero' ? setView('plan') : null}>
              <div className="h-10 w-10 bg-app-lime rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(212,255,0,0.3)]">
                <Activity className="h-5 w-5 text-black" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white hidden sm:block">FitGenius</span>
            </div>
            
            <div className="flex items-center space-x-4">
                {view === 'plan' && (
                     <div className="flex items-center gap-4">
                        <button className="relative p-2 rounded-full bg-app-surface border border-white/5 hover:bg-white/10 transition-colors">
                            <Bell className="w-5 h-5 text-app-textDim" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-app-surface"></span>
                        </button>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-app-lime to-white p-[2px]">
                            <div className="h-full w-full rounded-full bg-black flex items-center justify-center">
                                <span className="text-xs font-bold text-white">ME</span>
                            </div>
                        </div>
                     </div>
                )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col pt-20 relative">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-app-lime/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-app-lavender/5 rounded-full blur-[150px] pointer-events-none" />
        </div>

        {view === 'hero' && <Hero onStart={handleStart} />}
        
        {view === 'welcome' && (
            <WelcomeScreen stats={visitStats} onContinue={handleWelcomeContinue} />
        )}

        {view === 'form' && (
            <div className="flex-grow flex flex-col justify-center py-12">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Create Your Plan</h2>
                    <p className="text-app-textDim">Just a few steps to your personalized routine</p>
                </div>
                <OnboardingForm onSubmit={handleFormSubmit} isLoading={loading} />
                {error && (
                    <div className="mx-auto mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm max-w-lg text-center">
                        {error}
                    </div>
                )}
            </div>
        )}

        {view === 'plan' && plan && (
            <PlanDashboard plan={plan} onReset={handleReset} />
        )}
      </main>
    </div>
  );
};

export default App;