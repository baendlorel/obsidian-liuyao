import type { ParsedLiuyaoBlock, DisplayLine } from './types.js';
import { SixGodTable, Hexagram, type SixGod } from 'liuyao';
import { SolarLunarResult } from 'solarlunar';

import { createHexagram, createDate, createLunarInfo } from './utils.js';

export const parse = (source: string): ParsedLiuyaoBlock => {
  const result: ParsedLiuyaoBlock = {};

  const lines = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    result.hexagram = 'invalid';
    return result;
  }

  // 只有一行，可能是时辰可能是卦象
  if (lines.length === 1) {
    result.hexagram = createHexagram(lines[0]);
    if (result.hexagram !== 'invalid') {
      return result;
    }

    result.date = createDate(lines[0]);
    result.lunar = createLunarInfo(result.date);
    return result;
  }

  // 两行，必须第一行时辰第二行卦象
  result.hexagram = createHexagram(lines[1]);
  result.date = createDate(lines[0]);
  result.lunar = createLunarInfo(result.date);
  if (result.lunar !== 'invalid') {
    result.sixGods = SixGodTable.find(
      (v) => v.heavenlyStem === (result.lunar as SolarLunarResult).gzDay.charAt(0),
    )?.gods;
  }
  return result;
};

export const build = (hexagram: Hexagram, sixGods?: SixGod[]): DisplayLine[] =>
  hexagram.yaos
    .map<DisplayLine>((yao, index) => ({
      sixGod: sixGods?.[index] ?? '',
      description: hexagram.info.setupInfo[index]?.kin ?? '',
      relation: hexagram.info.setupInfo[index]?.hostGuest ?? '',
      isYang: yao.polar === 1,
      tone: yao.isDynamic ? 'changing' : 'default',
    }))
    .reverse();

export const buildChanged = (hexagram: Hexagram): DisplayLine[] =>
  hexagram.yaos
    .map<DisplayLine>((yao, index) => ({
      sixGod: '',
      description: hexagram.info.setupInfo[index]?.kin || '',
      relation: hexagram.info.setupInfo[index]?.hostGuest || '',
      isYang: yao.polar === 1,
      tone: yao.isChanged ? 'default' : 'muted',
    }))
    .reverse();
