import { Plugin } from 'obsidian';
import { Hexagrams, Trigram, type HexagramInfo } from './core/common.js';

const LIUYAO_DIGITS_PATTERN = /^[0-3]{6}$/;

type YaoValue = '0' | '1' | '2' | '3';
type LineTone = 'default' | 'changing' | 'muted';

type DisplayLine = {
  description: string;
  relation: string;
  isYang: boolean;
  tone: LineTone;
};

const HEXAGRAM_BY_BINARY = new Map(Hexagrams.list.map((hexagram) => [hexagram.binary, hexagram]));
const TRIGRAM_TO_DIGIT = new Map(
  Trigram.list.map((trigram) => [trigram.name, String(trigram.countOfYang) as YaoValue]),
);

export default class LiuyaoRendererPlugin extends Plugin {
  onload(): void {
    this.registerMarkdownCodeBlockProcessor('liuyao', (source, element) => {
      this.renderLiuyaoBlock(source, element);
    });
  }

  private renderLiuyaoBlock(source: string, element: HTMLElement): void {
    const rawDigits = parseLiuyaoSource(source);

    element.empty();

    if (!rawDigits) {
      const error = document.createElement('div');
      error.className = 'liuyao-error';
      error.textContent =
        'Invalid liuyao block. Use 6 digits from 0 to 3 or 6 trigram names, for example: 012321 or 坤坎离离震兑';
      element.append(error);
      return;
    }

    const hexagram = getHexagram(rawDigits);

    if (!hexagram) {
      const error = document.createElement('div');
      error.className = 'liuyao-error';
      error.textContent = `Unable to find hexagram data for ${rawDigits}`;
      element.append(error);
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'liuyao-block';

    const primaryLines = buildPrimaryDisplayLines(rawDigits, hexagram);
    wrapper.append(this.createCard(rawDigits, hexagram, primaryLines));

    const changedDigits = getChangedDigits(rawDigits);
    if (changedDigits !== rawDigits) {
      const changedHexagram = getHexagram(changedDigits);

      if (!changedHexagram) {
        const error = document.createElement('div');
        error.className = 'liuyao-error';
        error.textContent = `Unable to find changed hexagram data for ${changedDigits}`;
        element.append(error);
        return;
      }

      wrapper.append(this.createArrow());
      wrapper.append(
        this.createCard(
          changedDigits,
          changedHexagram,
          buildChangedDisplayLines(rawDigits, changedDigits, changedHexagram),
        ),
      );
    }

    element.append(wrapper);
  }

  private createCard(rawDigits: string, hexagram: HexagramInfo, lines: DisplayLine[]): HTMLElement {
    const wrapper = document.createElement('section');
    wrapper.className = 'liuyao-card';
    wrapper.setAttribute('aria-label', `${hexagram.family}宫 ${hexagram.id}`);
    wrapper.setAttribute('title', `${hexagram.family}宫 ${hexagram.id} ${rawDigits}`);

    const header = document.createElement('div');
    header.className = 'liuyao-card__title';
    header.textContent = `${hexagram.family}宫 ${hexagram.id}`;
    wrapper.append(header);

    for (const lineInfo of lines) {
      const row = document.createElement('div');
      row.className = 'liuyao-card__row';

      const left = document.createElement('span');
      left.className = 'liuyao-card__text liuyao-card__text--left';
      left.textContent = lineInfo.description;

      const middle = document.createElement('div');
      middle.className = 'liuyao-line';
      middle.dataset.kind = lineInfo.isYang ? 'yang' : 'yin';
      middle.dataset.tone = lineInfo.tone;
      middle.setAttribute('aria-hidden', 'true');

      middle.append(this.createLineSegment());
      if (!lineInfo.isYang) {
        middle.append(this.createLineGap());
        middle.append(this.createLineSegment());
      }

      const right = document.createElement('span');
      right.className = 'liuyao-card__text liuyao-card__text--right';
      right.textContent = lineInfo.relation ?? '';

      row.append(left, middle, right);
      wrapper.append(row);
    }

    return wrapper;
  }

  private createArrow(): HTMLElement {
    const arrow = document.createElement('div');
    arrow.className = 'liuyao-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '→';
    return arrow;
  }

  private createLineSegment(): HTMLElement {
    const segment = document.createElement('span');
    segment.className = 'liuyao-line__segment';
    return segment;
  }

  private createLineGap(): HTMLElement {
    const gap = document.createElement('span');
    gap.className = 'liuyao-line__gap';
    return gap;
  }
}

function isLiuyaoDigits(value: string | undefined): value is string {
  return value !== undefined && LIUYAO_DIGITS_PATTERN.test(value);
}

function parseLiuyaoSource(source: string): string | null {
  const normalized = source.replace(/\s+/g, '');

  if (isLiuyaoDigits(normalized)) {
    return normalized;
  }

  const trigramDigits = parseTrigramSequence(normalized);
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

  const digits = trigrams.map((trigramName) => TRIGRAM_TO_DIGIT.get(trigramName));

  return digits.every((digit): digit is YaoValue => digit !== undefined) ? digits.join('') : null;
}

function getHexagram(rawDigits: string): HexagramInfo | undefined {
  const binary = rawDigits
    .split('')
    .map((digit) => (digit === '1' || digit === '3' ? '1' : '0'))
    .join('');

  return HEXAGRAM_BY_BINARY.get(binary);
}

function buildPrimaryDisplayLines(rawDigits: string, hexagram: HexagramInfo): DisplayLine[] {
  const digits = rawDigits.split('') as YaoValue[];

  return digits
    .map<DisplayLine>((digit, index) => {
      const setup = hexagram.setupInfo[index];
      return {
        description: setup?.description || '',
        relation: setup?.type || '',
        isYang: digit === '1' || digit === '3',
        tone: digit === '0' || digit === '3' ? 'changing' : 'default',
      };
    })
    .reverse();
}

function buildChangedDisplayLines(rawDigits: string, changedDigits: string, hexagram: HexagramInfo): DisplayLine[] {
  const originalDigits = rawDigits.split('') as YaoValue[];
  const nextDigits = changedDigits.split('') as YaoValue[];

  return nextDigits
    .map<DisplayLine>((digit, index) => {
      const setup = hexagram.setupInfo[index];
      const originalDigit = originalDigits[index];
      const isChangedLine = originalDigit === '0' || originalDigit === '3';

      return {
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
