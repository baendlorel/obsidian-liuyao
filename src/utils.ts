import { Hexagram } from 'liuyao';
import solarLunar, { SolarLunarResult } from 'solarlunar';

export const createDate = (s: string): Date | 'invalid' => {
  const d = new Date(s);
  return isNaN(d.getTime()) ? 'invalid' : d;
};

export const createLunarInfo = (date: Date | 'invalid'): SolarLunarResult | 'invalid' => {
  if (date === 'invalid') {
    return 'invalid';
  }
  const v = solarLunar.solar2lunar(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return v === -1 ? 'invalid' : v;
};

export const createHexagram = (s: string): Hexagram | 'invalid' => {
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
  return (
    Hexagram.fromQuaternary(s) ??
    Hexagram.fromSymbolName(s) ??
    Hexagram.fromYangCounts(s.split('').map((c) => map[c] ?? 4)) ??
    'invalid'
  );
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

const tp = document.createElement('template');
/**
 * Returns the first html element
 */
export const html = (template: TemplateStringsArray, ...args: string[]): HTMLElement => {
  tp.innerHTML = raw(template, ...args);
  return tp.firstElementChild as HTMLElement;
};

/**
 * Only returns string
 */
export const raw = (template: TemplateStringsArray, ...args: string[]): string => {
  const s: string[] = [];
  for (let i = 0; i < template.length - 1; i++) {
    s.push(template[i], args[i]);
  }
  s.push(template[template.length - 1]);

  return s.join('');
};
