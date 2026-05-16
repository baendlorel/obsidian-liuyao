import { Plugin } from 'obsidian';
import { Hexagrams, type HexagramInfo } from './core/common.js';

const LIUYAO_DIGITS_PATTERN = /^[0-3]{6}$/;

type YaoValue = '0' | '1' | '2' | '3';

const HEXAGRAM_BY_BINARY = new Map(Hexagrams.list.map((hexagram) => [hexagram.binary, hexagram]));

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
      error.textContent = 'Invalid liuyao block. Use 6 digits from 0 to 3, for example: 012321';
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
    wrapper.append(this.createDiagram(rawDigits, hexagram));
    element.append(wrapper);
  }

  private createDiagram(rawDigits: string, hexagram: HexagramInfo): HTMLElement {
    const wrapper = document.createElement('section');
    wrapper.className = 'liuyao-card';
    wrapper.setAttribute('aria-label', `${hexagram.family}宫 ${hexagram.id}`);
    wrapper.setAttribute('title', `${hexagram.family}宫 ${hexagram.id} ${rawDigits}`);

    const header = document.createElement('div');
    header.className = 'liuyao-card__title';
    header.textContent = `${hexagram.family}宫 ${hexagram.id}`;
    wrapper.append(header);

    const lines = buildDisplayLines(rawDigits, hexagram);

    for (const lineInfo of lines) {
      const row = document.createElement('div');
      row.className = 'liuyao-card__row';

      const left = document.createElement('span');
      left.className = 'liuyao-card__text liuyao-card__text--left';
      left.textContent = lineInfo.description;

      const middle = document.createElement('div');
      middle.className = 'liuyao-line';
      middle.dataset.kind = lineInfo.isYang ? 'yang' : 'yin';
      middle.dataset.changing = String(lineInfo.isChanging);
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
  const normalized = source.trim();

  if (isLiuyaoDigits(normalized)) {
    return normalized;
  }

  return null;
}

function getHexagram(rawDigits: string): HexagramInfo | undefined {
  const binary = rawDigits
    .split('')
    .map((digit) => (digit === '1' || digit === '3' ? '1' : '0'))
    .join('');

  return HEXAGRAM_BY_BINARY.get(binary);
}

function buildDisplayLines(rawDigits: string, hexagram: HexagramInfo) {
  const digits = rawDigits.split('') as YaoValue[];

  return digits
    .map((digit, index) => {
      const setup = hexagram.setupInfo[index];
      return {
        digit,
        description: setup?.description || '',
        relation: setup?.type || '',
        isYang: digit === '1' || digit === '3',
        isChanging: digit === '0' || digit === '3',
      };
    })
    .reverse();
}
