// getAssociatedSymptoms.ts
import { symptomAssociations } from "./symptomAssociations";

/**
 * Get all the associated symptoms from the given list of selected symptoms
 * @param selectedSymptoms string[] - List of selected symptoms
 * @returns string[] - List of associated symptoms without duplicates
 */
export const getAssociatedSymptoms = (selectedSymptoms: string[]): string[] => {
  const associatedSymptoms = new Set<string>();

  selectedSymptoms.forEach((symptom) => {
    const associations = symptomAssociations[symptom];
    if (associations) {
      associations.forEach((assocSymptom) =>
        associatedSymptoms.add(assocSymptom)
      );
    } else {
      console.warn(`No associations found for ${symptom}`);
    }
    console.log("Associated Symptoms:", Array.from(associatedSymptoms));
  });

  // Remove the symptoms that the user already logged
  selectedSymptoms.forEach((symptom) => associatedSymptoms.delete(symptom));

  return Array.from(associatedSymptoms);
};
