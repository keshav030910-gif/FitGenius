import React, { useState, useEffect } from 'react';
import { UserProfile, Gender, Goal, ActivityLevel, Equipment, DietPreference } from '../types';
import { ChevronRight, ChevronLeft, Loader2, Sparkles } from 'lucide-react';

interface OnboardingFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

const STEPS = [
  { id: 1, title: "About You" },
  { id: 2, title: "Goals" },
  { id: 3, title: "Preferences" },
];

const LOADING_MESSAGES = [
    "Analyzing body composition...",
    "Designing workout structure...",
    "Calculating caloric needs...",
    "Optimizing for your equipment...",
    "Finalizing your plan...",
];

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    age: 25,
    height: 175,
    weight: 70,
    gender: Gender.MALE,
    goal: Goal.LOSE_WEIGHT,
    activityLevel: ActivityLevel.MODERATE,
    equipment: Equipment.NONE,
    dietPreference: DietPreference.NO_RESTRICTION,
    allergies: '',
  });

  useEffect(() => {
    let interval: any;
    if (isLoading) {
        interval = setInterval(() => {
            setLoadingMsgIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
        }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  if (isLoading) {
      return (
          <div className="w-full max-w-lg mx-auto px-4 flex flex-col items-center justify-center min-h-[400px] animate-fadeIn">
              <div className="relative mb-8">
                  <div className="absolute inset-0 bg-app-lime/20 blur-xl rounded-full animate-pulse"></div>
                  <div className="relative h-24 w-24 bg-app-surface border border-app-lime/30 rounded-full flex items-center justify-center">
                      <Loader2 className="h-10 w-10 text-app-lime animate-spin" />
                  </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Creating Your Plan</h3>
              <p className="text-app-lime font-medium animate-pulse transition-all duration-300">
                  {LOADING_MESSAGES[loadingMsgIndex]}
              </p>
          </div>
      );
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      {/* Step Indicators */}
      <div className="flex justify-center gap-2 mb-8">
        {STEPS.map((s) => (
            <div 
                key={s.id} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                    step >= s.id ? 'w-8 bg-app-lime' : 'w-2 bg-app-surfaceHighlight'
                }`} 
            />
        ))}
      </div>

      <div className="bg-app-surface border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden relative">
        <div className="p-8">
            <h3 className="text-xl font-bold text-white mb-6">{STEPS[step-1].title}</h3>
            
            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <div className="space-y-5 animate-fadeIn">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-app-textDim uppercase mb-2 pl-1">Age</label>
                                <input 
                                    type="number" 
                                    value={profile.age} 
                                    onChange={(e) => handleChange('age', parseInt(e.target.value))}
                                    className="w-full bg-app-bg border border-white/5 rounded-2xl px-4 py-4 text-white focus:ring-2 focus:ring-app-lime focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-app-textDim uppercase mb-2 pl-1">Gender</label>
                                <select 
                                    value={profile.gender}
                                    onChange={(e) => handleChange('gender', e.target.value)}
                                    className="w-full bg-app-bg border border-white/5 rounded-2xl px-4 py-4 text-white focus:ring-2 focus:ring-app-lime focus:border-transparent outline-none transition-all appearance-none"
                                >
                                    {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-app-textDim uppercase mb-2 pl-1">Height (cm)</label>
                                <input 
                                    type="number" 
                                    value={profile.height} 
                                    onChange={(e) => handleChange('height', parseInt(e.target.value))}
                                    className="w-full bg-app-bg border border-white/5 rounded-2xl px-4 py-4 text-white focus:ring-2 focus:ring-app-lime focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-app-textDim uppercase mb-2 pl-1">Weight (kg)</label>
                                <input 
                                    type="number" 
                                    value={profile.weight} 
                                    onChange={(e) => handleChange('weight', parseInt(e.target.value))}
                                    className="w-full bg-app-bg border border-white/5 rounded-2xl px-4 py-4 text-white focus:ring-2 focus:ring-app-lime focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-5 animate-fadeIn">
                        <div>
                            <label className="block text-xs font-bold text-app-textDim uppercase mb-2 pl-1">Primary Goal</label>
                            <div className="grid grid-cols-1 gap-2">
                                {Object.values(Goal).map(goal => (
                                    <button
                                        key={goal}
                                        type="button"
                                        onClick={() => handleChange('goal', goal)}
                                        className={`px-5 py-4 rounded-2xl text-left font-medium transition-all ${
                                            profile.goal === goal 
                                            ? 'bg-app-lime text-black shadow-lg shadow-app-lime/20' 
                                            : 'bg-app-bg text-app-textDim hover:bg-white/5'
                                        }`}
                                    >
                                        {goal}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-app-textDim uppercase mb-2 pl-1">Activity Level</label>
                            <select 
                                value={profile.activityLevel}
                                onChange={(e) => handleChange('activityLevel', e.target.value)}
                                className="w-full bg-app-bg border border-white/5 rounded-2xl px-4 py-4 text-white focus:ring-2 focus:ring-app-lime focus:border-transparent outline-none transition-all"
                            >
                                {Object.values(ActivityLevel).map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-5 animate-fadeIn">
                        <div>
                            <label className="block text-xs font-bold text-app-textDim uppercase mb-2 pl-1">Equipment</label>
                            <select 
                                value={profile.equipment}
                                onChange={(e) => handleChange('equipment', e.target.value)}
                                className="w-full bg-app-bg border border-white/5 rounded-2xl px-4 py-4 text-white focus:ring-2 focus:ring-app-lime focus:border-transparent outline-none transition-all"
                            >
                                {Object.values(Equipment).map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-app-textDim uppercase mb-2 pl-1">Diet Preference</label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.values(DietPreference).map(diet => (
                                    <button
                                        key={diet}
                                        type="button"
                                        onClick={() => handleChange('dietPreference', diet)}
                                        className={`px-3 py-3 rounded-xl text-xs font-medium text-center transition-all ${
                                            profile.dietPreference === diet 
                                            ? 'bg-app-lavender text-black' 
                                            : 'bg-app-bg text-app-textDim hover:bg-white/5'
                                        }`}
                                    >
                                        {diet}
                                    </button>
                                ))}
                            </div>
                        </div>
                         <div>
                            <label className="block text-xs font-bold text-app-textDim uppercase mb-2 pl-1">Allergies</label>
                            <input 
                                type="text" 
                                value={profile.allergies} 
                                placeholder="None"
                                onChange={(e) => handleChange('allergies', e.target.value)}
                                className="w-full bg-app-bg border border-white/5 rounded-2xl px-4 py-4 text-white focus:ring-2 focus:ring-app-lime focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>
                )}
            </form>
        </div>

        <div className="p-8 pt-0 flex justify-between items-center">
            {step > 1 ? (
                <button 
                    onClick={handlePrev}
                    className="flex items-center text-app-textDim hover:text-white transition-colors font-medium px-4 py-3"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" /> Back
                </button>
            ) : <div />}

            {step < 3 ? (
                 <button 
                    onClick={handleNext}
                    className="flex items-center bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg"
                >
                    Next <ChevronRight className="w-5 h-5 ml-1" />
                </button>
            ) : (
                <button 
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex items-center bg-app-lime text-black px-8 py-3 rounded-full font-bold hover:opacity-90 transition-colors shadow-lg shadow-app-lime/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Plan
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;