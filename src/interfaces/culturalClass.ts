export const CulturalClassCategory = {
  DANCE: 'DANCE',
  THEATER: 'THEATER',
  SINGING: 'SINGING',
  INSTRUMENTS: 'INSTRUMENTS',
} as const;

export type CulturalClassCategory = typeof CulturalClassCategory[keyof typeof CulturalClassCategory];

export interface CulturalClass {
  id: number;
  name: string;
  category: CulturalClassCategory;
  maxCapacity: number;
  startDateTime: number; 
  endDateTime: number;
  available: boolean;
}

export interface CreateCulturalClassDto {
  name: string;
  category: CulturalClassCategory;
  maxCapacity: number;
  startDateTime: number;
  endDateTime: number;
}

export interface UpdateCulturalClassDto {
  name?: string;
  category?: CulturalClassCategory;
  maxCapacity?: number;
  startDateTime?: number;
  endDateTime?: number;
  available?: boolean;
}