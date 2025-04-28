// symptomAssociations.ts
export const symptomAssociations: Record<string, string[]> = {
  // Physical Symptoms
  Fatigue: ["Low Energy", "Sadness", "Headaches", "Back Pain"],
  Headaches: ["Fatigue", "Irritability", "Restlessness"],
  Bloating: ["Cramps", "Anxiety", "Nausea"],
  Cramps: ["Back Pain", "Bloating", "Fatigue", "Sadness"],
  Acne: ["Breast Tenderness", "Irritability", "Low Energy"],
  BackPain: ["Cramps", "Fatigue", "Depression"],
  Nausea: ["Bloating", "Anxiety", "Restlessness"],
  BreastTenderness: ["Acne", "Mood Swings"],

  // Behavioral Symptoms
  Energetic: ["Productivity", "Exercise", "Mood Swings"],
  "Low Energy": ["Self Critical", "Fatigue", "Sadness"],
  "Self Critical": ["Depression", "Low Energy", "Sadness"],
  Productivity: ["Energetic", "Exercise", "Mood Swings"],
  Exercise: ["Energetic", "Productivity", "Mood Swings"],

  // Emotional Symptoms
  "Mood Swings": ["Irritability", "Sadness", "Low Energy"],
  Irritability: ["Mood Swings", "Anxiety", "Headaches"],
  Anxiety: ["Restlessness", "Overwhelmed", "Bloating"],
  Sadness: ["Depression", "Self Critical", "Fatigue"],
  Depression: ["Sadness", "Low Energy", "Back Pain"],
  Restlessness: ["Anxiety", "Headaches", "Nausea"],
  Overwhelmed: ["Anxiety", "Restlessness"],
};
