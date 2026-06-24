import solarLunar, { SolarLunarResult } from 'solarlunar';
import { Plugin } from 'obsidian';
import { Hexagram, HexagramInfo, HexagramInfoTable, SixGod, SixGodTable, TrigramInfoTable } from 'liuyao';
import { changeYaos, createDate, createHexagram, createLunarInfo, h, html } from './utils.js';
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
    const { lunar, gram, date, sixGods } = parseLiuyaoBlock(source);

    element.empty();

    const panel = element.appendChild(html`<section class="liuyao-panel"></section>`);

    if (gram === 'invalid' || date === 'invalid') {
      // TEST 这里可以测试很大的日期，会触发羡慕的阴历字典不足异常
      panel.append(
        html`<div class="liuyao-error">
          <h6>六爻块数据无效！格式如下：</h6>
          <ol>
            <li>第1行写六爻表达式</li>
            <li>或者第1行写日期（格式为2000-01-01 10:20），第2行写六爻表达式</li>
          </ol>
          <h6>六爻表达式的格式：</h6>
          <ol>
            <li>数字0~3，例：211212（水风井）</li>
            <li>单拆重交，例：拆单单拆单拆（水风井）</li>
            <li>八卦名，例：坤坤坎艮坎坤（等价于001110，泽山咸->乾为天）</li>
          </ol>
          <small>${lunar === 'invalid' ? '日期正常，但阴历字典数据不足，无法获取六神信息' : ''}</small>
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
  const result: ParsedLiuyaoBlock = {};

  const lines = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    result.gram = 'invalid';
    return result; // ! 这将会触发“无效的六幺数据”报错
  }

  // 只有一行，可能是时辰可能是卦象
  if (lines.length === 1) {
    result.gram = createHexagram(lines[0]);
    if (result.gram !== 'invalid') {
      return result;
    }

    result.date = createDate(lines[0]);
    result.lunar = createLunarInfo(result.date);
    return result;
  }

  // 两行，必须第一行时辰第二行卦象
  result.gram = createHexagram(lines[1]);
  result.date = createDate(lines[0]);
  result.lunar = createLunarInfo(result.date);
  if (result.lunar !== 'invalid') {
    result.sixGods = SixGodTable.find(
      (v) => v.heavenlyStem === (result.lunar as SolarLunarResult).gzDay.charAt(0),
    )?.gods;
  }
  return result;
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
