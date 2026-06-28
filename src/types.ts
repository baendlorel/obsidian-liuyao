import type { SixGod, Hexagram } from 'liuyao';
import type { SolarLunarResult } from './solarlunar.js';

/**
 * 这些字段原则是可以没有但会是invalid的
 */
export interface ParsedLiuyaoBlock {
  hexagram?: Hexagram | 'invalid';
  date?: Date | 'invalid';
  lunar?: SolarLunarResult | 'invalid';
  sixGods?: SixGod[];
}

export interface SolarlunarCardData {
  date: Date;
  lunar: SolarLunarResult;
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
  hexagram: Hexagram;
  lines: DisplayLine[];
}

export interface LiuyaoRendererSettings {
  changingLineColor: string;
}
