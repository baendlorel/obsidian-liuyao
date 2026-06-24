import { Plugin } from 'obsidian';

import { html } from './utils.js';
import { solarlunarCard, liuyaoCard, liuyaoArrow } from './templates.js';
import { build, buildChanged, parse } from './parser.js';

function renderLiuyaoBlock(source: string, element: HTMLElement): void {
  const { lunar, hexagram, date, sixGods } = parse(source);

  element.empty();

  const panel = element.appendChild(html`<section class="liuyao-panel"></section>`);

  if (hexagram === 'invalid' && date === 'invalid') {
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

  const wrapper = panel.appendChild(html`<div class="liuyao-block"></div>`);
  if (date && date !== 'invalid' && lunar) {
    if (lunar !== 'invalid') {
      wrapper.append(solarlunarCard({ date, lunar }));
    } else {
      wrapper.append(html`<div class="liuyao-error">日期正常，但阴历字典数据不足，无法获取六神信息</div>`);
    }
  }

  if (hexagram && hexagram !== 'invalid') {
    const primaryLines = build(hexagram, sixGods);
    wrapper.append(liuyaoCard({ hexagram, lines: primaryLines }));

    const changed = hexagram.toChanged();
    if (changed) {
      wrapper.append(liuyaoArrow(), liuyaoCard({ hexagram: changed, lines: buildChanged(changed) }));
    }
  }

  panel.append(wrapper, html`<div class="liuyao-watermark">v__VERSION__</div>`);
}

export default class LiuyaoRendererPlugin extends Plugin {
  onload(): void {
    this.registerMarkdownCodeBlockProcessor('liuyao', renderLiuyaoBlock);
  }
}
