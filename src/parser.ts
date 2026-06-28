import { SixGodTable, Hexagram, type SixGod } from 'liuyao';
import { type ParsedLiuyaoBlock, type DisplayLine, ResultState } from './types.js';
import { createHexagram, createDate, createLunarInfo } from './utils.js';

export const parse = (source: string): ParsedLiuyaoBlock => {
  const result: ParsedLiuyaoBlock = {
    hexagram: { value: null, state: ResultState.None },
    date: { value: null, state: ResultState.None },
    lunar: { value: null, state: ResultState.None },
  };

  const lines = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return result;
  }

  // 只有一行，可能是时辰可能是卦象
  if (lines.length === 1) {
    // 这一行是卦象
    const gram = createHexagram(lines[0]);
    if (gram.state === ResultState.Valid) {
      result.hexagram = gram;
      return result;
    }

    // 这一行是日期
    result.date = createDate(lines[0]);
    result.lunar = createLunarInfo(result.date);
    return result;
  }

  // 两行，必须第一行时辰第二行卦象
  result.hexagram = createHexagram(lines[1]);
  result.date = createDate(lines[0]);
  result.lunar = createLunarInfo(result.date);

  if (result.lunar.state === ResultState.Valid) {
    result.sixGods = SixGodTable.find((v) => v.heavenlyStem === result.lunar.value?.gzDay.charAt(0))?.gods;
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
