import { Timestamp } from "firebase/firestore";

export interface DateItem {
  id: string;
  date: Timestamp;
  day: number;
  dayOfWeek: string;
  isPeriodDay: boolean;
}
export interface PeriodDay {
  id: string; // Ensure this matches DateItem
  date: string; // Ensure this matches DateItem (convert Timestamp to string if needed)
}
