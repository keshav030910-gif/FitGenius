import React, { useState, useEffect } from 'react';
import { Exercise } from '../types';
import { X, Play, Pause, ChevronRight, CheckCircle2, Timer, RotateCcw } from 'lucide-react';

interface WorkoutSessionOverlayProps {
  exercises: Exercise[];
  onClose: () => void;
  dayName: string;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const WorkoutSessionOverlay: React.FC<WorkoutSessionOverlayProps> = ({ exercises, onClose, dayName }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  
  // Timers
  const [activeDuration, setActiveDuration] = useState(0); // Total time spent exercising
  const [restDuration, setRestDuration] = useState(0); // Current rest session time
  const [isPaused, setIsPaused] = useState(false); // Global pause (e.g. interruption)

  const currentExercise = exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === exercises.length - 1;

  useEffect(() => {
    let interval: any;

    if (!isPaused) {
        interval = setInterval(() => {
            if (isResting) {
                setRestDuration(prev => prev + 1);
            } else {
                setActiveDuration(prev => prev + 1);
            }
        }, 1000);
    }

    return () => clearInterval(interval);
  }, [isResting, isPaused]);

  const handleNext = () => {
    if (isResting) {
        // Finishing rest, starting next set/exercise
        setIsResting(false);
        setRestDuration(0);
        
        // If we were resting after the last exercise, finish the workout
        if (currentExerciseIndex >= exercises.length) {
            onClose();
        }
    } else {
        // Finishing exercise set, starting rest
        setIsResting(true);
        if (!isLastExercise) {
             setCurrentExerciseIndex(prev => prev + 1);
        } else {
            // Prepared to finish
             setCurrentExerciseIndex(prev => prev + 1); // Move to "Done" state effectively
        }
    }
  };

  const handleFinishEarly = () => {
      if(confirm("End session? Progress will not be saved.")) {
          onClose();
      }
  };

  // Completed View
  if (currentExerciseIndex >= exercises.length && !isResting) {
      return (
        <div className="fixed inset-0 z-[60] bg-app-bg flex flex-col items-center justify-center animate-fadeIn p-6">
            <div className="w-24 h-24 bg-app-lime rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,255,0,0.4)]">
                <CheckCircle2 className="w-12 h-12 text-black" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">Workout Complete!</h2>
            <p className="text-app-textDim mb-8">Great job crushing {dayName}.</p>
            
            <div className="bg-app-surface border border-white/10 rounded-2xl p-6 w-full max-w-sm mb-8">
                <div className="text-center">
                    <p className="text-sm font-bold text-app-textDim uppercase tracking-wider mb-1">Total Active Time</p>
                    <p className="text-3xl font-bold text-white">{formatTime(activeDuration)}</p>
                </div>
            </div>

            <button 
                onClick={onClose}
                className="bg-white text-black font-bold py-4 px-12 rounded-full hover:bg-gray-200 transition-colors"
            >
                Return to Dashboard
            </button>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-app-bg flex flex-col animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/5 bg-app-bg/95 backdrop-blur">
        <div className="flex items-center gap-3">
            <button onClick={handleFinishEarly} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6 text-white" />
            </button>
            <div>
                <h3 className="font-bold text-white leading-tight">{dayName}</h3>
                <div className="flex items-center gap-2 text-xs text-app-textDim">
                    <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></span>
                    {isPaused ? 'Paused' : 'Session Active'}
                </div>
            </div>
        </div>
        <div className="flex items-center gap-2 bg-app-surface px-4 py-2 rounded-full border border-white/5">
            <Timer className="w-4 h-4 text-app-lime" />
            <span className="font-mono font-bold text-white w-14 text-center">
                {formatTime(isResting ? restDuration : activeDuration)}
            </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col relative overflow-hidden">
         {/* Background Effect */}
         <div className={`absolute inset-0 transition-colors duration-700 pointer-events-none opacity-10 ${isResting ? 'bg-app-lavender' : 'bg-app-lime'}`}></div>

         <div className="flex-grow flex flex-col items-center justify-center p-6 text-center z-10">
            {isResting ? (
                <div className="animate-fadeIn">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-app-lavender/20 text-app-lavender mb-6 border-2 border-app-lavender">
                        <RotateCcw className="w-8 h-8 animate-spin-slow" />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2">Rest & Recover</h2>
                    <p className="text-app-textDim text-lg max-w-xs mx-auto mb-8">
                        Take a breather. Get ready for the next set.
                    </p>
                    <div className="text-6xl font-black text-app-lavender font-mono mb-2">
                        {formatTime(restDuration)}
                    </div>
                     <p className="text-sm font-bold uppercase tracking-wider text-app-textDim">Rest Timer</p>
                </div>
            ) : (
                <div className="w-full max-w-md animate-fadeIn">
                    <div className="text-app-textDim font-bold uppercase tracking-wider text-sm mb-4">
                        Exercise {currentExerciseIndex + 1} of {exercises.length}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        {currentExercise.name}
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
                            <p className="text-app-lime text-2xl font-bold">{currentExercise.sets}</p>
                            <p className="text-xs text-app-textDim uppercase font-bold">Sets</p>
                        </div>
                        <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
                            <p className="text-app-lime text-2xl font-bold">{currentExercise.reps}</p>
                            <p className="text-xs text-app-textDim uppercase font-bold">Reps</p>
                        </div>
                    </div>
                    
                    <div className="bg-app-surface border border-white/5 rounded-2xl p-4 text-left">
                        <p className="text-xs text-app-textDim uppercase font-bold mb-2">Instructions</p>
                        <p className="text-white text-sm leading-relaxed">{currentExercise.notes}</p>
                    </div>
                </div>
            )}
         </div>
      </div>

      {/* Footer Controls */}
      <div className="p-6 pb-8 bg-app-surface border-t border-white/5">
         <div className="max-w-md mx-auto w-full flex items-center gap-4">
            <button 
                onClick={() => setIsPaused(!isPaused)}
                className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
                {isPaused ? <Play className="w-6 h-6 ml-1" /> : <Pause className="w-6 h-6" />}
            </button>

            <button 
                onClick={handleNext}
                className={`flex-1 h-14 rounded-full font-bold text-black text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isResting 
                    ? 'bg-white hover:bg-gray-200' 
                    : 'bg-app-lime hover:opacity-90 shadow-app-lime/20'
                }`}
            >
                {isResting ? (
                    <>Start Next Set <Play className="w-5 h-5 ml-1" /></>
                ) : (
                    <>Finish Set & Rest <ChevronRight className="w-5 h-5" /></>
                )}
            </button>
         </div>
      </div>
    </div>
  );
};

export default WorkoutSessionOverlay;