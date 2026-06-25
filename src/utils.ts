import { type ParsedResult, ResultState } from './types.js';
import { Hexagram } from 'liuyao';
import solarLunar, { SolarLunarResult } from 'solarlunar';

export const createDate = (s: string): ParsedResult<Date> => {
  const d = new Date(s);
  return isNaN(d.getTime()) ? { value: null, state: ResultState.Invalid } : { value: d, state: ResultState.Valid };
};

export const createLunarInfo = (date: ParsedResult<Date>): ParsedResult<SolarLunarResult> => {
  if (date.state === ResultState.None) {
    return { value: null, state: ResultState.None };
  }

  if (date.state === ResultState.Invalid || date.value === null) {
    return { value: null, state: ResultState.Invalid };
  }

  const v = solarLunar.solar2lunar(date.value.getFullYear(), date.value.getMonth() + 1, date.value.getDate());
  return v === -1 ? { value: null, state: ResultState.Invalid } : { value: v, state: ResultState.Valid };
};

export const createHexagram = (s: string): ParsedResult<Hexagram> => {
  const map: Record<string, number> = {
    乾: 3,
    坤: 0,
    坎: 1,
    离: 2,
    震: 1,
    兑: 2,
    艮: 1,
    巽: 2,
  };
  const result =
    Hexagram.fromQuaternary(s) ??
    Hexagram.fromSymbolName(s) ??
    Hexagram.fromYangCounts(s.split('').map((c) => map[c] ?? 4));
  return result ? { value: result, state: ResultState.Valid } : { value: null, state: ResultState.Invalid };
};

export const dtm = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}`;
};

export const getShichen = (date: Date): string =>
  '子丑丑寅寅卯卯辰辰巳巳午午未未申申酉酉戌戌亥亥子'[date.getHours()] ?? '未知';

// # Element creation

type Child = Node | string;

export const h = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  children?: Child[] | string,
): HTMLElementTagNameMap[K] => {
  const e = activeDocument.createElement(tag);
  e.className = className;
  if (Array.isArray(children)) {
    e.append(...children);
  } else if (typeof children === 'string') {
    e.append(children);
  }
  return e;
};

export const div = (className: string, children?: Child[] | string) => h('div', className, children);
export const span = (className: string, children?: Child[] | string) => h('span', className, children);
export const svg = <K extends keyof SVGElementTagNameMap>(tag: K): SVGElementTagNameMap[K] =>
  activeDocument.createElementNS('http://www.w3.org/2000/svg', tag);
export const ol = (list: string[]) =>
  h(
    'ol',
    '',
    list.map((v) => h('li', '', v)),
  );
