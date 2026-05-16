import solarLunar, { type SolarLunarResult } from 'solarlunar';
import { Plugin, type MarkdownPostProcessorContext } from 'obsidian';
import { getSixGods } from './core/6-gods.js';
import { Hexagrams, Trigram, type HexagramInfo } from './core/common.js';
import type { SixGods } from './types/index.js';

const LIUYAO_DIGITS_PATTERN = /^[0-3]{6}$/;

type YaoValue = '0' | '1' | '2' | '3';
type LineTone = 'default' | 'changing' | 'muted';

type DisplayLine = {
  sixGod: string;
  description: string;
  relation: string;
  isYang: boolean;
  tone: LineTone;
};

type ParsedLiuyaoBlock = {
  rawDigits: string | null;
  dateInput?: string;
  parsedDate?: Date;
  lunarInfo?: SolarLunarResult;
  dateError?: string;
  sixGods?: SixGods[];
};

const HEXAGRAM_BY_BINARY = new Map(Hexagrams.list.map((hexagram) => [hexagram.binary, hexagram]));
const TRIGRAM_TO_DIGIT = new Map(
  Trigram.list.map((trigram) => [trigram.name, String(trigram.countOfYang) as YaoValue]),
);

function h<T extends keyof HTMLElementTagNameMap>(tag: T, cls: string, content?: string): HTMLElementTagNameMap[T] {
  const e = document.createElement(tag);
  e.className = cls;
  if (content) {
    e.textContent = content;
  }
  return e;
}

function svg<T extends keyof SVGElementTagNameMap>(tag: T, attr: Record<string, string>): SVGElementTagNameMap[T] {
  const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attr).forEach(([key, value]) => e.setAttribute(key, value));
  return e;
}

export default class LiuyaoRendererPlugin extends Plugin {
  onload(): void {
    this.registerMarkdownCodeBlockProcessor('liuyao', (source, element) => {
      this.renderLiuyaoBlock(source, element);
    });

    this.registerMarkdownCodeBlockProcessor('solarlunar', (source, element, ctx) => {
      this.renderSolarLunarBlock(source, element, ctx);
    });
  }

  private renderLiuyaoBlock(source: string, element: HTMLElement): void {
    const parsedBlock = parseLiuyaoBlock(source);
    const rawDigits = parsedBlock.rawDigits;

    element.empty();

    const panel = h('section', 'liuyao-panel');

    if (parsedBlock.lunarInfo && parsedBlock.parsedDate && parsedBlock.dateInput) {
      panel.append(this.createSolarLunarCard(parsedBlock.dateInput, parsedBlock.parsedDate, parsedBlock.lunarInfo));
    } else if (parsedBlock.dateError) {
      panel.append(this.createSolarLunarError(parsedBlock.dateError));
    }

    if (!rawDigits) {
      const error = h(
        'div',
        'liuyao-error',
        'Invalid liuyao block. Use 6 digits from 0 to 3 or 6 trigram names, or put a date on the first non-empty line and the hexagram on the second line.',
      );
      panel.append(error);
      element.append(panel);
      return;
    }

    const hexagram = getHexagram(rawDigits);

    if (!hexagram) {
      const error = h('div', 'liuyao-error', `Unable to find hexagram data for ${rawDigits}`);
      panel.append(error);
      element.append(panel);
      return;
    }

    const wrapper = h('div', 'liuyao-block');

    const primaryLines = buildPrimaryDisplayLines(rawDigits, hexagram, parsedBlock.sixGods);
    wrapper.append(this.createCard(rawDigits, hexagram, primaryLines));

    const changedDigits = getChangedDigits(rawDigits);
    if (changedDigits !== rawDigits) {
      const changedHexagram = getHexagram(changedDigits);

      if (!changedHexagram) {
        const error = h('div', 'liuyao-error', `Unable to find changed hexagram data for ${changedDigits}`);
        panel.append(error);
        element.append(panel);
        return;
      }

      wrapper.append(this.createArrow());
      wrapper.append(
        this.createCard(
          changedDigits,
          changedHexagram,
          buildChangedDisplayLines(rawDigits, changedDigits, changedHexagram, parsedBlock.sixGods),
        ),
      );
    }

    panel.append(wrapper);
    element.append(panel);
  }

  private renderSolarLunarBlock(source: string, element: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const rawInput = resolveBlockInput('solarlunar', source, element, ctx);

    element.empty();

    if (!rawInput) {
      element.append(this.createSolarLunarError('无效日期：空输入'));
      return;
    }

    const parsedDate = new Date(rawInput);
    if (Number.isNaN(parsedDate.getTime())) {
      element.append(this.createSolarLunarError(`无效日期：${rawInput}`));
      return;
    }

    const lunarInfo = solarLunar.solar2lunar(parsedDate.getFullYear(), parsedDate.getMonth() + 1, parsedDate.getDate());

    if (lunarInfo === -1) {
      element.append(this.createSolarLunarError(`无效日期：${rawInput}`));
      return;
    }

    element.append(this.createSolarLunarCard(rawInput, parsedDate, lunarInfo));
  }

  private createCard(rawDigits: string, hexagram: HexagramInfo, lines: DisplayLine[]): HTMLElement {
    const wrapper = h('section', 'liuyao-card');
    wrapper.setAttribute('aria-label', `${hexagram.family}宫 ${hexagram.id}`);
    wrapper.setAttribute('title', `${hexagram.family}宫 ${hexagram.id} ${rawDigits}`);

    const header = h('div', 'liuyao-card__title', `${hexagram.family}宫 ${hexagram.id}`);
    wrapper.append(header);

    for (const lineInfo of lines) {
      const row = h('div', 'liuyao-card__row');

      const god = h('span', 'liuyao-card__text liuyao-card__text--god', lineInfo.sixGod);
      const left = h('span', 'liuyao-card__text liuyao-card__text--left', lineInfo.description);

      const middle = h('div', 'liuyao-line');
      middle.dataset.kind = lineInfo.isYang ? 'yang' : 'yin';
      middle.dataset.tone = lineInfo.tone;
      middle.setAttribute('aria-hidden', 'true');

      middle.append(this.createLineSegment());
      if (!lineInfo.isYang) {
        middle.append(this.createLineGap());
        middle.append(this.createLineSegment());
      }

      const right = h('span', 'liuyao-card__text liuyao-card__text--right', lineInfo.relation ?? '');

      row.append(god, left, middle, right);
      wrapper.append(row);
    }

    return wrapper;
  }

  private createArrow(): HTMLElement {
    const arrow = h('div', 'liuyao-arrow');
    arrow.setAttribute('aria-hidden', 'true');

    const icon = svg('svg', {
      class: 'liuyao-arrow__icon',
      viewBox: '0 0 20 20',
      width: '20',
      height: '20',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.8',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    });
    icon.append(svg('path', { d: 'M4 10h12' }), svg('path', { d: 'm11 5 5 5-5 5' }));
    arrow.append(icon);

    return arrow;
  }

  private createLineSegment(): HTMLElement {
    return h('span', 'liuyao-line__segment');
  }

  private createLineGap(): HTMLElement {
    return h('span', 'liuyao-line__gap');
  }

  private createSolarLunarCard(rawInput: string, parsedDate: Date, lunarInfo: SolarLunarResult): HTMLElement {
    const wrapper = h('section', 'solarlunar-card');

    const title = h('div', 'solarlunar-card__title', '起卦日期信息');
    wrapper.append(title);

    const rows: Array<[string, string]> = [
      ['原始输入', rawInput],
      ['公历', `${formatGregorianDate(parsedDate)} ${lunarInfo.ncWeek}`],
      ['农历', `${lunarInfo.yearCn}年 ${lunarInfo.monthCn}${lunarInfo.dayCn}${lunarInfo.isLeap ? '（闰月）' : ''}`],
      ['干支', `${lunarInfo.gzYear}年 ${lunarInfo.gzMonth}月 ${lunarInfo.gzDay}日`],
      ['生肖', lunarInfo.animal],
      ['节气', lunarInfo.isTerm ? lunarInfo.term : '无'],
    ];

    rows.forEach(([label, value]) => {
      const row = h('div', 'solarlunar-card__row');

      const labelEl = h('span', 'solarlunar-card__label', label);
      const valueEl = h('span', 'solarlunar-card__value', value);

      row.append(labelEl, valueEl);
      wrapper.append(row);
    });

    return wrapper;
  }

  private createSolarLunarError(message: string): HTMLElement {
    return h('div', 'solarlunar-error', message);
  }
}

function isLiuyaoDigits(value: string | undefined): value is string {
  return value !== undefined && LIUYAO_DIGITS_PATTERN.test(value);
}

function parseLiuyaoBlock(source: string): ParsedLiuyaoBlock {
  const lines = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return { rawDigits: null };
  }

  if (lines.length === 1) {
    const onlyLine = lines[0];
    return { rawDigits: onlyLine ? parseLiuyaoSource(onlyLine) : null };
  }

  const dateInput = lines[0];
  const diagramInput = lines[1];

  if (!dateInput || !diagramInput) {
    return { rawDigits: null };
  }

  const parsedDate = new Date(dateInput);
  const result: ParsedLiuyaoBlock = {
    dateInput,
    rawDigits: parseLiuyaoSource(diagramInput),
  };

  if (Number.isNaN(parsedDate.getTime())) {
    result.dateError = `无效日期：${dateInput}`;
    return result;
  }

  const lunarInfo = solarLunar.solar2lunar(parsedDate.getFullYear(), parsedDate.getMonth() + 1, parsedDate.getDate());
  if (lunarInfo === -1) {
    result.dateError = `无效日期：${dateInput}`;
    return result;
  }

  result.parsedDate = parsedDate;
  result.lunarInfo = lunarInfo;
  result.sixGods = getSixGods(lunarInfo.gzDay.charAt(0));
  return result;
}

function parseLiuyaoSource(source: string): string | null {
  source = source.replace(/\s+/g, '');

  if (isLiuyaoDigits(source)) {
    return source;
  }

  const trigramDigits = parseTrigramSequence(source);
  if (trigramDigits) {
    return trigramDigits;
  }

  return null;
}

function parseTrigramSequence(value: string): string | null {
  const trigrams = Array.from(value);

  if (trigrams.length !== 6) {
    return null;
  }

  const digits = trigrams.map((name) => TRIGRAM_TO_DIGIT.get(name));

  return digits.every((digit): digit is YaoValue => digit !== undefined) ? digits.join('') : null;
}

function getHexagram(rawDigits: string): HexagramInfo | undefined {
  const binary = rawDigits
    .split('')
    .map((digit) => (digit === '1' || digit === '3' ? '1' : '0'))
    .join('');

  return HEXAGRAM_BY_BINARY.get(binary);
}

function buildPrimaryDisplayLines(rawDigits: string, hexagram: HexagramInfo, sixGods?: SixGods[]): DisplayLine[] {
  const digits = rawDigits.split('') as YaoValue[];

  return digits
    .map<DisplayLine>((digit, index) => {
      const setup = hexagram.setupInfo[index];
      return {
        sixGod: sixGods?.[index] ?? '',
        description: setup?.description || '',
        relation: setup?.type || '',
        isYang: digit === '1' || digit === '3',
        tone: digit === '0' || digit === '3' ? 'changing' : 'default',
      };
    })
    .reverse();
}

function buildChangedDisplayLines(
  rawDigits: string,
  changedDigits: string,
  hexagram: HexagramInfo,
  sixGods?: SixGods[],
): DisplayLine[] {
  const originalDigits = rawDigits.split('') as YaoValue[];
  const nextDigits = changedDigits.split('') as YaoValue[];

  return nextDigits
    .map<DisplayLine>((digit, index) => {
      const setup = hexagram.setupInfo[index];
      const originalDigit = originalDigits[index];
      const isChangedLine = originalDigit === '0' || originalDigit === '3';

      return {
        sixGod: sixGods?.[index] ?? '',
        description: setup?.description || '',
        relation: setup?.type || '',
        isYang: digit === '1' || digit === '3',
        tone: isChangedLine ? 'default' : 'muted',
      };
    })
    .reverse();
}

function getChangedDigits(rawDigits: string): string {
  return rawDigits
    .split('')
    .map((digit) => {
      if (digit === '0') {
        return '1';
      }

      if (digit === '3') {
        return '2';
      }

      return digit;
    })
    .join('');
}

function resolveBlockInput(
  language: string,
  source: string,
  element: HTMLElement,
  ctx: MarkdownPostProcessorContext,
): string {
  const sectionText = ctx.getSectionInfo(element)?.text;
  if (sectionText) {
    const firstLine = sectionText.split('\n', 1)[0] ?? '';
    const fenceMatch = firstLine.match(new RegExp(`^\\s*\`\`\`${language}(?:\\s+(.+))?\\s*$`));
    const headerInput = fenceMatch?.[1]?.trim() ?? '';

    if (headerInput) {
      return headerInput;
    }
  }

  return source.trim();
}

function formatGregorianDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
