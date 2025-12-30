import React, { useState, useEffect } from 'react';
import { FitnessPlan, WorkoutDay, DietDay, WeightLog } from '../types';
import { Dumbbell, Utensils, CheckCircle2, Flame, RefreshCw, BarChart2, Calendar, Clock, ChevronRight, Play } from 'lucide-react';
import ProgressTracker from './ProgressTracker';
import WorkoutSessionOverlay from './WorkoutSessionOverlay';
import { getWeightHistory, addWeightLog } from '../services/storage';

interface PlanDashboardProps {
  plan: FitnessPlan;
  onReset: () => void;
}

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Helper to get Monday=0, Sunday=6
const getTodayIndex = () => {
    const day = new Date().getDay(); 
    return day === 0 ? 6 : day - 1; 
};

const PlanDashboard: React.FC<PlanDashboardProps> = ({ plan, onReset }) => {
  // Initialize with Today's index
  const [selectedDayIndex, setSelectedDayIndex] = useState(getTodayIndex());
  const [activeTab, setActiveTab] = useState<'workout' | 'diet' | 'progress'>('workout');
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  
  // Session State
  const [isSessionActive, setIsSessionActive] = useState(false);

  useEffect(() => {
    setWeightLogs(getWeightHistory());
  }, []);

  const handleAddWeight = (weight: number) => {
    const updatedLogs = addWeightLog(weight);
    setWeightLogs(updatedLogs);
  };

  const handleStartSession = () => {
    setIsSessionActive(true);
  };

  const handleCloseSession = () => {
    setIsSessionActive(false);
  };

  // Safe access to day data (handle if AI returns fewer days)
  const currentWorkoutDay = plan.workoutPlan[selectedDayIndex % plan.workoutPlan.length];
  const currentDietDay = plan.dietPlan[selectedDayIndex % plan.dietPlan.length];

  const isToday = selectedDayIndex === getTodayIndex();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-24 pt-4">
      {isSessionActive && (
        <WorkoutSessionOverlay 
            exercises={currentWorkoutDay.exercises} 
            dayName={currentWorkoutDay.dayName || DAYS_OF_WEEK[selectedDayIndex]}
            onClose={handleCloseSession} 
        />
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
            <h2 className="text-2xl font-bold text-white">Your Dashboard</h2>
            <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-app-lime animate-pulse"></span>
                <p className="text-app-textDim text-sm">
                    {isToday ? "Today's Schedule Active" : `Viewing ${DAYS_OF_WEEK[selectedDayIndex]} Schedule`}
                </p>
            </div>
        </div>
        <button 
            onClick={onReset}
            className="group flex items-center justify-center px-4 py-2 rounded-full bg-app-surface border border-white/10 hover:bg-red-500/20 hover:border-red-500/50 transition-all text-xs font-bold text-app-textDim hover:text-red-500"
        >
            <RefreshCw className="w-3 h-3 mr-2" />
            Reset Plan
        </button>
      </div>

      {/* Day Selector */}
      <div className="flex justify-between items-center bg-app-surface border border-white/5 rounded-2xl p-2 mb-8 overflow-x-auto no-scrollbar">
        {DAYS_OF_WEEK.map((day, idx) => {
            const isActive = idx === selectedDayIndex;
            return (
                <button
                    key={day}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`flex-1 min-w-[3rem] py-3 rounded-xl text-sm font-bold transition-all relative ${
                        isActive 
                        ? 'bg-app-lime text-black shadow-lg shadow-app-lime/20' 
                        : 'text-app-textDim hover:bg-white/5 hover:text-white'
                    }`}
                >
                    {day}
                    {idx === getTodayIndex() && !isActive && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-app-lime rounded-full"></span>
                    )}
                </button>
            );
        })}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Navigation & Stats */}
        <div className="lg:col-span-4 space-y-6">
             {/* Summary Card (Context aware) */}
            <div className={`rounded-[2rem] p-6 text-black relative overflow-hidden transition-all ${
                activeTab === 'workout' ? 'bg-app-lime' : activeTab === 'diet' ? 'bg-app-lavender' : 'bg-app-surfaceHighlight border border-white/10 text-white'
            }`}>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-black/10 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                            {activeTab === 'workout' ? 'Workout Focus' : activeTab === 'diet' ? 'Nutrition Goal' : 'Progress'}
                        </span>
                    </div>
                    
                    {activeTab === 'workout' && (
                        <>
                            <h3 className="text-2xl font-bold leading-tight mb-2">
                                {currentWorkoutDay.restDay ? "Rest & Recovery" : currentWorkoutDay.focus}
                            </h3>
                            <p className="text-sm font-medium opacity-80 mb-4">
                                {currentWorkoutDay.restDay 
                                    ? "Take it easy today. Light stretching or walking is recommended."
                                    : `${currentWorkoutDay.exercises.length} exercises scheduled for today.`
                                }
                            </p>
                        </>
                    )}

                    {activeTab === 'diet' && (
                        <>
                             <h3 className="text-2xl font-bold leading-tight mb-2">
                                {currentDietDay.totalCalories} kcal
                            </h3>
                            <p className="text-sm font-medium opacity-80 mb-4">
                                Daily target. Stay hydrated and stick to your macros.
                            </p>
                        </>
                    )}

                     {activeTab === 'progress' && (
                        <>
                             <h3 className="text-2xl font-bold leading-tight mb-2">
                                Keep Tracking
                            </h3>
                            <p className="text-sm font-medium opacity-80 mb-4 text-app-textDim">
                                Consistent logging is key to results.
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Navigation Pills */}
            <div className="bg-app-surface rounded-[2rem] p-2 border border-white/5 flex flex-col gap-2">
                <button
                    onClick={() => setActiveTab('workout')}
                    className={`flex items-center justify-between p-4 rounded-[1.5rem] transition-all ${
                        activeTab === 'workout' ? 'bg-white text-black' : 'text-app-textDim hover:bg-white/5'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${activeTab === 'workout' ? 'bg-black/10' : 'bg-white/5'}`}>
                            <Dumbbell className="w-5 h-5" />
                        </div>
                        <span className="font-bold">Workouts</span>
                    </div>
                    {activeTab === 'workout' && <ChevronRight className="w-5 h-5" />}
                </button>
                
                <button
                    onClick={() => setActiveTab('diet')}
                    className={`flex items-center justify-between p-4 rounded-[1.5rem] transition-all ${
                        activeTab === 'diet' ? 'bg-app-lavender text-black' : 'text-app-textDim hover:bg-white/5'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${activeTab === 'diet' ? 'bg-black/10' : 'bg-white/5'}`}>
                            <Utensils className="w-5 h-5" />
                        </div>
                        <span className="font-bold">Diet Plan</span>
                    </div>
                    {activeTab === 'diet' && <ChevronRight className="w-5 h-5" />}
                </button>

                <button
                    onClick={() => setActiveTab('progress')}
                    className={`flex items-center justify-between p-4 rounded-[1.5rem] transition-all ${
                        activeTab === 'progress' ? 'bg-app-surfaceHighlight text-white border border-white/10' : 'text-app-textDim hover:bg-white/5'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${activeTab === 'progress' ? 'bg-white/10' : 'bg-white/5'}`}>
                            <BarChart2 className="w-5 h-5" />
                        </div>
                        <span className="font-bold">Progress</span>
                    </div>
                    {activeTab === 'progress' && <ChevronRight className="w-5 h-5" />}
                </button>
            </div>
        </div>

        {/* Right Column: Dynamic Content */}
        <div className="lg:col-span-8">
            <div className="animate-fadeIn min-h-[400px]">
                {activeTab === 'workout' && (
                    <DayWorkoutView day={currentWorkoutDay} onStartSession={handleStartSession} />
                )}
                
                {activeTab === 'diet' && (
                     <DayDietView day={currentDietDay} />
                )}

                {activeTab === 'progress' && (
                    <ProgressTracker logs={weightLogs} onAddLog={handleAddWeight} />
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

const DayWorkoutView: React.FC<{ day: WorkoutDay, onStartSession: () => void }> = ({ day, onStartSession }) => {
    if (day.restDay) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-app-surface border border-white/5 rounded-[2rem] p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-pulse">
                    <Clock className="w-10 h-10 text-app-lime" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Rest Day</h3>
                <p className="text-app-textDim max-w-sm mx-auto">
                    Your muscles grow while you rest. Focus on hydration, stretching, and getting quality sleep today.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
             <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-lg font-bold text-white">Exercises</h3>
                <button 
                    onClick={onStartSession}
                    className="flex items-center gap-2 text-xs font-bold bg-app-lime text-black px-4 py-2 rounded-full hover:bg-white transition-colors shadow-lg shadow-app-lime/10"
                >
                    <Play className="w-3 h-3 fill-black" />
                    Start Session
                </button>
            </div>

            {day.exercises.map((ex, idx) => (
                <div key={idx} className="group bg-app-surface border border-white/5 hover:border-app-lime/30 rounded-2xl p-5 transition-all hover:translate-x-1">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 text-xs text-app-textDim font-bold group-hover:bg-app-lime group-hover:text-black transition-colors">
                                {idx + 1}
                            </span>
                            <h4 className="font-bold text-white text-lg">{ex.name}</h4>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-app-textDim group-hover:text-app-lime cursor-pointer transition-colors" />
                    </div>
                    
                    <div className="pl-9 grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                        <div className="bg-black/20 rounded-lg p-2">
                            <p className="text-[10px] uppercase text-app-textDim font-bold">Sets</p>
                            <p className="text-sm font-medium text-white">{ex.sets}</p>
                        </div>
                        <div className="bg-black/20 rounded-lg p-2">
                            <p className="text-[10px] uppercase text-app-textDim font-bold">Reps</p>
                            <p className="text-sm font-medium text-white">{ex.reps}</p>
                        </div>
                        <div className="bg-black/20 rounded-lg p-2 col-span-2 md:col-span-1">
                            <p className="text-[10px] uppercase text-app-textDim font-bold">Notes</p>
                            <p className="text-sm font-medium text-white truncate">{ex.notes}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const DayDietView: React.FC<{ day: DietDay }> = ({ day }) => {
    return (
        <div className="space-y-4">
             <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-lg font-bold text-white">Daily Menu</h3>
                <span className="text-xs font-bold text-app-lime border border-app-lime/20 bg-app-lime/5 px-3 py-1 rounded-full">
                    {day.totalCalories} Calories
                </span>
            </div>

            <MealCard meal={day.meals.breakfast} type="Breakfast" />
            <MealCard meal={day.meals.lunch} type="Lunch" />
            <MealCard meal={day.meals.dinner} type="Dinner" />
            <MealCard meal={day.meals.snack} type="Snack" />
        </div>
    );
};

const MealCard: React.FC<{ meal: any, type: string }> = ({ meal, type }) => (
    <div className="bg-app-surface border border-white/5 hover:border-app-lavender/30 rounded-2xl p-5 transition-all">
        <div className="flex justify-between items-start mb-2">
            <div>
                <span className="text-xs font-bold text-app-textDim uppercase tracking-wider mb-1 block">{type}</span>
                <h4 className="font-bold text-white text-lg">{meal.name}</h4>
            </div>
            <span className="text-sm font-bold text-white bg-black/30 px-3 py-1 rounded-lg">
                {meal.calories} kcal
            </span>
        </div>
        <p className="text-sm text-app-textDim mb-3">{meal.description}</p>
        <div className="flex gap-3 text-xs font-medium">
            <span className="text-app-lime">{meal.protein}g Protein</span>
            <span className="text-blue-400">{meal.carbs}g Carbs</span>
            <span className="text-yellow-400">{meal.fats}g Fats</span>
        </div>
    </div>
);

export default PlanDashboard;