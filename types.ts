export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export enum Goal {
  LOSE_WEIGHT = 'Lose Weight',
  BUILD_MUSCLE = 'Build Muscle',
  MAINTAIN = 'Maintain Fitness',
  IMPROVE_ENDURANCE = 'Improve Endurance',
}

export enum ActivityLevel {
  SEDENTARY = 'Sedentary',
  LIGHT = 'Lightly Active',
  MODERATE = 'Moderately Active',
  VERY_ACTIVE = 'Very Active',
  EXTRA_ACTIVE = 'Extra Active',
}

export enum Equipment {
  NONE = 'No Equipment',
  DUMBBELLS = 'Dumbbells',
  HOME_GYM = 'Home Gym',
  FULL_GYM = 'Commercial Gym',
}

export enum DietPreference {
  NO_RESTRICTION = 'None',
  VEGETARIAN = 'Vegetarian',
  VEGAN = 'Vegan',
  KETO = 'Keto',
  PALEO = 'Paleo',
  GLUTEN_FREE = 'Gluten Free',
}

export interface UserProfile {
  age: number;
  height: number; // cm
  weight: number; // kg
  gender: Gender;
  goal: Goal;
  activityLevel: ActivityLevel;
  equipment: Equipment;
  dietPreference: DietPreference;
  allergies: string;
}

// AI Response Structure
export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  notes: string;
}

export interface WorkoutDay {
  dayName: string;
  focus: string;
  exercises: Exercise[];
  restDay: boolean;
}

export interface Meal {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface DietDay {
  dayName: string;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snack: Meal;
  };
  totalCalories: number;
}

export interface FitnessPlan {
  summary: string;
  workoutPlan: WorkoutDay[];
  dietPlan: DietDay[];
  tips: string[];
}

export interface WeightLog {
  date: string;
  weight: number;
}

export interface VisitStats {
  lastVisit: string | null;
  lastVisitTime: string | null;
  streak: number;
  totalVisits: number;
}