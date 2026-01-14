
export interface PerformanceRecord {
  date: string; // YYYY-MM-DD
  weight: number | null; // kg
  broncoTime: string | null; // "MM:SS" format
  benchPress: number | null; // kg
  squat: number | null; // kg
  deadlift: number | null; // kg
  clean: number | null; // kg
}

export interface PlayerTargets {
  weight: number | null;
  broncoTime: string | null;
  benchPress: number | null;
  squat: number | null;
  deadlift: number | null;
  clean: number | null;
}

export interface Player {
  id: number;
  name: string;
  position: string;
  grade: number;
  records: PerformanceRecord[];
  targets: PlayerTargets;
  aiPersona?: 'analyst' | 'demon_coach';
}