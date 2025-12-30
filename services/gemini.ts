import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, FitnessPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const mealSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    description: { type: Type.STRING },
    calories: { type: Type.NUMBER },
    protein: { type: Type.NUMBER },
    carbs: { type: Type.NUMBER },
    fats: { type: Type.NUMBER },
  },
  required: ["name", "description", "calories", "protein", "carbs", "fats"],
};

const workoutSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    tips: { type: Type.ARRAY, items: { type: Type.STRING } },
    workoutPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dayName: { type: Type.STRING },
          focus: { type: Type.STRING },
          restDay: { type: Type.BOOLEAN },
          exercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                sets: { type: Type.STRING },
                reps: { type: Type.STRING },
                notes: { type: Type.STRING },
              },
              required: ["name", "sets", "reps", "notes"],
            },
          },
        },
        required: ["dayName", "focus", "restDay", "exercises"],
      },
    },
  },
  required: ["summary", "tips", "workoutPlan"],
};

const dietSchema = {
  type: Type.OBJECT,
  properties: {
    dietPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dayName: { type: Type.STRING },
          totalCalories: { type: Type.NUMBER },
          meals: {
            type: Type.OBJECT,
            properties: {
              breakfast: mealSchema,
              lunch: mealSchema,
              dinner: mealSchema,
              snack: mealSchema,
            },
            required: ["breakfast", "lunch", "dinner", "snack"],
          },
        },
        required: ["dayName", "totalCalories", "meals"],
      },
    },
  },
  required: ["dietPlan"],
};

export const generateFitnessPlan = async (user: UserProfile): Promise<FitnessPlan> => {
  const modelId = "gemini-3-flash-preview";

  const baseContext = `
    User Profile:
    - Age: ${user.age}, Gender: ${user.gender}
    - Height: ${user.height}cm, Weight: ${user.weight}kg
    - Goal: ${user.goal}
    - Activity: ${user.activityLevel}
    - Equipment: ${user.equipment}
    - Diet: ${user.dietPreference}
    - Allergies: ${user.allergies || "None"}
  `;

  // Request 1: Workout + Summary
  const workoutTask = ai.models.generateContent({
    model: modelId,
    contents: `
      ${baseContext}
      Act as a elite personal trainer.
      1. Write a brief professional summary of the strategy for this user.
      2. List 3 key tips.
      3. Create a 7-day workout plan strictly using available equipment.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: workoutSchema as any,
      temperature: 0.4,
    },
  });

  // Request 2: Diet
  const dietTask = ai.models.generateContent({
    model: modelId,
    contents: `
      ${baseContext}
      Act as a nutritionist.
      Create a 7-day diet plan with exact macros fitting the user's goal.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: dietSchema as any,
      temperature: 0.4,
    },
  });

  try {
    const [workoutResponse, dietResponse] = await Promise.all([workoutTask, dietTask]);

    const workoutData = JSON.parse(workoutResponse.text || "{}");
    const dietData = JSON.parse(dietResponse.text || "{}");

    if (!workoutData.workoutPlan || !dietData.dietPlan) {
        throw new Error("Incomplete data received from AI");
    }

    return {
      summary: workoutData.summary,
      tips: workoutData.tips,
      workoutPlan: workoutData.workoutPlan,
      dietPlan: dietData.dietPlan,
    };
  } catch (error) {
    console.error("Error generating plan:", error);
    throw error;
  }
};
