import type { SixGod } from 'liuyao';
import type { SolarLunarResult } from 'solarlunar';

export interface ParsedLiuyaoBlock {
  rawDigits: string | null;
  parsedDate?: Date;
  lunarInfo?: SolarLunarResult;
  dateError?: string;
  sixGods?: SixGod[];
  gzHour?: string;
}

export interface SolarlunarCardData {
  parsedDate: Date;
  lunarInfo: SolarLunarResult;
}
