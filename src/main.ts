import solarLunar from 'solarlunar';
import { Plugin } from 'obsidian';
import { Hexagram, HexagramInfo, HexagramInfoTable, SixGod, SixGodTable, TrigramInfoTable } from 'liuyao';
import { changeYaos, h, html } from './utils.js';
import { createSolarlunarCard, createLiuyaoCard, createLiuyaoArrow, createVersionWatermark } from './templates.js';
import type { DisplayLine, ParsedLiuyaoBlock } from './types.js';

type YaoValue = '0' | '1' | '2' | '3';

const HEXAGRAM_BY_BINARY = new Map(HexagramInfoTable.map((hexagram) => [hexagram.binary, hexagram]));
const TRIGRAM_TO_DIGIT = new Map(TrigramInfoTable.map((t) => [t.id, String(t.yangCount) as YaoValue]));

export default class LiuyaoRendererPlugin extends Plugin {
  onload(): void {
    this.registerMarkdownCodeBlockProcessor('liuyao', (source, element) => this.renderLiuyaoBlock(source, element));
  }

  private renderLiuyaoBlock(source: string, element: HTMLElement): void {
    const { lunarInfo, rawDigits, parsedDate, dateError, sixGods } = parseLiuyaoBlock(source);

    element.empty();

    const panel = element.appendChild(html`<section class="liuyao-panel"></section>`);

    if (lunarInfo && parsedDate) {
      panel.append(createSolarlunarCard({ parsedDate, lunarInfo }));
    } else if (dateError) {
      panel.append(html`<div class="solarlunar-error">${dateError}</div>`);
    }

    if (!rawDigits) {
      panel.append(
        html`<div class="liuyao-error">
          六爻块数据无效. 必须使用 6 个 0~3 的数字、6个“单拆重交”文字、 6 个八卦名。第一行可以写日期（格式为2000-01-01
          10:20），第二行写六爻表达式也行。
        </div>`,
      );
      return;
    }

    const hexagram = getHexagram(rawDigits);

    if (!hexagram) {
      panel.append(html`<div class="liuyao-error">无法获取卦象信息：${rawDigits}</div>`);
      return;
    }

    const wrapper = h('div', 'liuyao-block');

    const primaryLines = buildPrimaryYaos(rawDigits, hexagram, sixGods);
    wrapper.append(createLiuyaoCard({ hexagramInfo: hexagram, lines: primaryLines }));

    const changedDigits = changeYaos(rawDigits);
    if (changedDigits !== rawDigits) {
      const changedHexagram = getHexagram(changedDigits);

      if (!changedHexagram) {
        panel.append(html`<div class="liuyao-error">无法找到变卦数据：${changedDigits}</div>`);
        return;
      }

      wrapper.append(createLiuyaoArrow());
      wrapper.append(
        createLiuyaoCard({
          hexagramInfo: changedHexagram,
          lines: buildChangedYaos(rawDigits, changedDigits, changedHexagram),
        }),
      );
    }

    panel.append(wrapper);
    panel.append(createVersionWatermark({ version: this.manifest.version }));
    element.append(panel);
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
  // TODO 加入单拆重交创建六爻块的方式
  const binary = rawDigits
    .split('')
    .map((digit) => (digit === '1' || digit === '3' ? '1' : '0'))
    .join('');

  return HEXAGRAM_BY_BINARY.get(binary as any);
}

function buildPrimaryYaos(rawDigits: string, hexagram: HexagramInfo, sixGods?: SixGod[]): DisplayLine[] {
  const digits = rawDigits.split('') as YaoValue[];

  // TODO 这里要利用工厂来创建 Hexagram.fromYangCounts

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
