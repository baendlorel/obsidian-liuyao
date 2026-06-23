import type { SixGod, HexagramInfo } from 'liuyao';
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

export type LineTone = 'default' | 'changing' | 'muted';

export interface DisplayLine {
  sixGod: string;
  description: string;
  relation: string;
  isYang: boolean;
  tone: LineTone;
}

export interface LiuyaoCardData {
  rawDigits: string;
  hexagramInfo: HexagramInfo;
  lines: DisplayLine[];
}

export interface VersionWatermarkData {
  version: string;
}
