import solarLunar, { SolarLunarResult } from 'solarlunar';
import { Plugin } from 'obsidian';
import { Hexagram, HexagramInfo, HexagramInfoTable, SixGod, SixGodTable, TrigramInfoTable } from 'liuyao';
import { changeYaos, createDate, createHexagram, createLunarInfo, h, html } from './utils.js';
import { createSolarlunarCard, liuyaoCard, liuyaoArrow, versionWatermark } from './templates.js';
import type { DisplayLine, ParsedLiuyaoBlock } from './types.js';

type YaoValue = '0' | '1' | '2' | '3';

const HEXAGRAM_BY_BINARY = new Map(HexagramInfoTable.map((hexagram) => [hexagram.binary, hexagram]));
const TRIGRAM_TO_DIGIT = new Map(TrigramInfoTable.map((t) => [t.id, String(t.yangCount) as YaoValue]));

export default class LiuyaoRendererPlugin extends Plugin {
  onload(): void {
    this.registerMarkdownCodeBlockProcessor('liuyao', (source, element) => this.renderLiuyaoBlock(source, element));
  }

  private renderLiuyaoBlock(source: string, element: HTMLElement): void {
    const { lunar, hexagram, date, sixGods } = parseLiuyaoBlock(source);

    element.empty();

    const panel = element.appendChild(html`<section class="liuyao-panel"></section>`);

    if (hexagram === 'invalid' || date === 'invalid') {
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

    // TODO 如果只有日期就只画日期

    const wrapper = panel.appendChild(html`<div class="liuyao-block"></div>`);
    if (date && lunar && lunar !== 'invalid') {
    }

    if (hexagram) {
      const primaryLines = build(hexagram);
      wrapper.append(liuyaoCard({ hexagram, lines: primaryLines }));

      const changed = hexagram.toChanged();
      if (changed) {
        wrapper.append(liuyaoArrow(), liuyaoCard({ hexagram: changed, lines: buildChanged(changed) }));
      }
    }

    panel.append(wrapper, versionWatermark({ version: this.manifest.version }));
  }
}

const parseLiuyaoBlock = (source: string): ParsedLiuyaoBlock => {
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

const build = (hexagram: Hexagram, sixGods?: SixGod[]): DisplayLine[] =>
  hexagram.yaos
    .map<DisplayLine>((yao, index) => ({
      sixGod: sixGods?.[index] ?? '',
      description: hexagram.info.setupInfo[index]?.kin ?? '',
      relation: hexagram.info.setupInfo[index]?.hostGuest ?? '',
      isYang: yao.polar === 1,
      tone: yao.isDynamic ? 'changing' : 'default',
    }))
    .reverse();

const buildChanged = (hexagram: Hexagram): DisplayLine[] =>
  hexagram.yaos
    .map<DisplayLine>((yao, index) => ({
      sixGod: '',
      description: hexagram.info.setupInfo[index]?.kin || '',
      relation: hexagram.info.setupInfo[index]?.hostGuest || '',
      isYang: yao.polar === 1,
      tone: yao.isChanged ? 'default' : 'muted',
    }))
    .reverse();
