import type { SixGod, HexagramInfo, Hexagram } from 'liuyao';
import type { SolarLunarResult } from 'solarlunar';

/**
 * 这些字段原则是可以没有但会是invalid的
 */
export interface ParsedLiuyaoBlock {
  gram?: Hexagram | 'invalid';
  parsedDate?: Date | 'invalid';
  lunarInfo?: SolarLunarResult | 'invalid';
  sixGods?: SixGod[];
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
  hexagramInfo: HexagramInfo;
  lines: DisplayLine[];
}

export interface VersionWatermarkData {
  version: string;
}
