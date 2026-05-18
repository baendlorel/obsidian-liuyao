import solarLunar, { type SolarLunarResult } from 'solarlunar';
import { Plugin } from 'obsidian';
import { Hexagram, HexagramInfo, HexagramInfoTable, SixGod, SixGodTable, TrigramInfoTable } from 'liuyao';

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
  sixGods?: SixGod[];
  gzHour?: string;
};

const HEXAGRAM_BY_BINARY = new Map(HexagramInfoTable.map((hexagram) => [hexagram.binary, hexagram]));
const TRIGRAM_TO_DIGIT = new Map(TrigramInfoTable.map((t) => [t.id, String(t.yangCount) as YaoValue]));

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
    this.registerMarkdownCodeBlockProcessor('liuyao', (source, element) => this.renderLiuyaoBlock(source, element));
  }

  private renderLiuyaoBlock(source: string, element: HTMLElement): void {
    const parsedBlock = parseLiuyaoBlock(source);
    const rawDigits = parsedBlock.rawDigits;

    element.empty();
    const panel = h('section', 'liuyao-panel');

    if (parsedBlock.lunarInfo && parsedBlock.parsedDate && parsedBlock.dateInput) {
      panel.append(this.createSolarLunarCard(parsedBlock.dateInput, parsedBlock.parsedDate, parsedBlock.lunarInfo));
    } else if (parsedBlock.dateError) {
      panel.append(h('div', 'solarlunar-error', parsedBlock.dateError));
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

    const primaryLines = buildPrimaryYaos(rawDigits, hexagram, parsedBlock.sixGods);
    wrapper.append(this.createCard(rawDigits, hexagram, primaryLines));

    const changedDigits = changeYaos(rawDigits);
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
        this.createCard(changedDigits, changedHexagram, buildChangedYaos(rawDigits, changedDigits, changedHexagram)),
      );
    }

    panel.append(wrapper);
    panel.append(this.createVersionWatermark());
    element.append(panel);
  }

  private createCard(rawDigits: string, hexagramInfo: HexagramInfo, lines: DisplayLine[]): HTMLElement {
    const wrapper = h('section', 'liuyao-card');
    const hasSixGods = lines.some((line) => line.sixGod);
    const hexagram = Hexagram.fromYangCounts(hexagramInfo.yangCounts)!;
    const hexagramTitle = `${hexagram.palace} ${hexagramInfo.id}`;
    wrapper.setAttribute('aria-label', hexagramTitle);
    wrapper.setAttribute('title', `${hexagramTitle} ${rawDigits}`);
    wrapper.classList.toggle('liuyao-card--without-gods', !hasSixGods);

    const header = h('div', 'liuyao-card__title', hexagramTitle);
    wrapper.append(header);

    for (const lineInfo of lines) {
      const row = h('div', 'liuyao-card__row');
      const left = h('span', 'liuyao-card__text liuyao-card__text--left', lineInfo.description);
      const middle = h('div', 'liuyao-line');

      middle.dataset.kind = lineInfo.isYang ? 'yang' : 'yin';
      middle.dataset.tone = lineInfo.tone;
      middle.setAttribute('aria-hidden', 'true');

      middle.append(h('span', 'liuyao-line__segment'));
      if (!lineInfo.isYang) {
        middle.append(h('span', 'liuyao-line__gap'));
        middle.append(h('span', 'liuyao-line__segment'));
      }

      const right = h('span', 'liuyao-card__text liuyao-card__text--right', lineInfo.relation ?? '');

      if (hasSixGods) {
        row.append(h('span', 'liuyao-card__text liuyao-card__text--god', lineInfo.sixGod));
      }

      row.append(left, middle, right);
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

  private createVersionWatermark(): HTMLElement {
    const version = this.manifest.version;
    const watermark = h('div', 'liuyao-watermark', `v${version}`);
    return watermark;
  }

  private createSolarLunarCard(rawInput: string, parsedDate: Date, lunarInfo: SolarLunarResult): HTMLElement {
    const wrapper = h('section', 'solarlunar-card');

    const rows: Array<[string, string]> = [
      ['原始输入', rawInput],
      ['公历', `${formatGregorianDate(parsedDate)} ${lunarInfo.ncWeek}`],
      ['农历', `${lunarInfo.yearCn} ${lunarInfo.monthCn}${lunarInfo.dayCn}${lunarInfo.isLeap ? '（闰月）' : ''}`],
      ['干支', `${lunarInfo.gzYear}年 ${lunarInfo.gzMonth}月 ${lunarInfo.gzDay}日 ${getShichen(parsedDate)}时`],
      ['生肖', lunarInfo.animal],
      ['节气', lunarInfo.isTerm ? lunarInfo.term : '无'],
    ];

    rows.forEach(([label, value]) => {
      const row = h('div', 'solarlunar-card__row');
      row.append(h('span', 'solarlunar-card__label', label), h('span', 'solarlunar-card__value', value));
      wrapper.append(row);
    });

    return wrapper;
  }
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
  result.sixGods = SixGodTable.find((v) => v.heavenlyStem === lunarInfo.gzDay.charAt(0))?.gods;
  return result;
}

function parseLiuyaoSource(source: string): string | null {
  source = source.replace(/\s+/g, '');

  if (source !== undefined && /^[0-3]{6}$/.test(source)) {
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

  return HEXAGRAM_BY_BINARY.get(binary as any);
}

function buildPrimaryYaos(rawDigits: string, hexagram: HexagramInfo, sixGods?: SixGod[]): DisplayLine[] {
  const digits = rawDigits.split('') as YaoValue[];

  return digits
    .map<DisplayLine>((digit, index) => {
      const setup = hexagram.setupInfo[index];
      return {
        sixGod: sixGods?.[index] ?? '',
        description: setup?.kin || '',
        relation: setup?.hostGuest || '',
        isYang: digit === '1' || digit === '3',
        tone: digit === '0' || digit === '3' ? 'changing' : 'default',
      };
    })
    .reverse();
}

function buildChangedYaos(rawDigits: string, changedDigits: string, hexagram: HexagramInfo): DisplayLine[] {
  const originalDigits = rawDigits.split('') as YaoValue[];
  const nextDigits = changedDigits.split('') as YaoValue[];

  return nextDigits
    .map<DisplayLine>((digit, index) => {
      const setup = hexagram.setupInfo[index];
      const originalDigit = originalDigits[index];
      const isChangedLine = originalDigit === '0' || originalDigit === '3';

      return {
        sixGod: '',
        description: setup?.kin || '',
        relation: setup?.hostGuest || '',
        isYang: digit === '1' || digit === '3',
        tone: isChangedLine ? 'default' : 'muted',
      };
    })
    .reverse();
}

function changeYaos(rawDigits: string): string {
  return rawDigits
    .split('')
    .map((digit) => '1122'[digit as any])
    .join('');
}

function formatGregorianDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}`;
}

function getShichen(date: Date): string {
  return '子丑丑寅寅卯卯辰辰巳巳午午未未申申酉酉戌戌亥亥子'[date.getHours()] ?? '未知';
}
