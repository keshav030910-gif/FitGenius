import { FitnessPlan, UserProfile, WeightLog, VisitStats } from "../types";

const KEYS = {
  PLAN: 'fitgenius_plan',
  PROFILE: 'fitgenius_profile',
  WEIGHT: 'fitgenius_weight_history',
  VISITS: 'fitgenius_visits'
};

export const savePlan = (plan: FitnessPlan) => {
  localStorage.setItem(KEYS.PLAN, JSON.stringify(plan));
};

export const getPlan = (): FitnessPlan | null => {
  const data = localStorage.getItem(KEYS.PLAN);
  return data ? JSON.parse(data) : null;
};

export const saveProfile = (profile: UserProfile) => {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
};

export const getProfile = (): UserProfile | null => {
  const data = localStorage.getItem(KEYS.PROFILE);
  return data ? JSON.parse(data) : null;
};

export const addWeightLog = (weight: number) => {
  const history = getWeightHistory();
  const today = new Date().toISOString().split('T')[0];
  
  // Filter out any existing entry for today to overwrite it
  const filtered = history.filter(entry => entry.date !== today);
  filtered.push({ date: today, weight });
  
  // Sort by date
  filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  localStorage.setItem(KEYS.WEIGHT, JSON.stringify(filtered));
  return filtered;
};

export const getWeightHistory = (): WeightLog[] => {
  const data = localStorage.getItem(KEYS.WEIGHT);
  return data ? JSON.parse(data) : [];
};

export const recordVisit = (): VisitStats => {
  const data = localStorage.getItem(KEYS.VISITS);
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const nowIso = now.toISOString();
  
  let stats: VisitStats = data ? JSON.parse(data) : { lastVisit: null, lastVisitTime: null, streak: 0, totalVisits: 0 };
  
  if (stats.lastVisit !== today) {
    // Check if yesterday was the last visit for streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (stats.lastVisit === yesterdayStr) {
        stats.streak += 1;
    } else if (stats.lastVisit !== today) {
        // Reset streak if gap is larger than 1 day, unless it's the very first visit
        // However, if stats.lastVisit is null (first run ever), we typically want streak 1.
        // Existing logic: if lastVisit was null, it enters here. Streak=1. Correct.
        // If lastVisit was 2 days ago, it enters here. Streak=1. Correct.
        stats.streak = 1;
    }
    
    stats.totalVisits += 1;
    stats.lastVisit = today;
  }
  
  // Always update the specific timestamp of the visit to 'now'
  stats.lastVisitTime = nowIso;
  
  localStorage.setItem(KEYS.VISITS, JSON.stringify(stats));
  
  return stats;
};

export const clearData = () => {
    localStorage.removeItem(KEYS.PLAN);
    localStorage.removeItem(KEYS.PROFILE);
    // We intentionally keep weight history and visits generally, but for a full "reset" maybe we clear plan/profile only
};