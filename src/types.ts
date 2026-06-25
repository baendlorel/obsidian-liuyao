import type { SixGod, Hexagram } from 'liuyao';
import type { SolarLunarResult } from 'solarlunar';

export const enum ResultState {
  /**
   * 解析失败
   */
  Invalid,

  /**
   * 解析成功
   */
  Valid,

  /**
   * 文本中没有这个值
   */
  None,
}

export type ParsedResult<T> =
  | {
      value: T;
      state: ResultState.Valid;
    }
  | {
      value: null;
      state: ResultState.Invalid | ResultState.None;
    };

/**
 * 这些字段原则是可以没有但会是invalid的
 */
export interface ParsedLiuyaoBlock {
  hexagram: ParsedResult<Hexagram>;
  date: ParsedResult<Date>;
  lunar: ParsedResult<SolarLunarResult>;
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
