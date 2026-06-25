import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';

import { div, h, ol } from './utils.js';
import { solarlunarCard, liuyaoCard, liuyaoArrow } from './templates.js';
import { build, buildChanged, parse } from './parser.js';
import type { LiuyaoRendererSettings } from './types.js';

const DEFAULT_SETTINGS: LiuyaoRendererSettings = {
  changingLineColor: '#c62828',
};

function normalizeColor(color: unknown): string {
  return typeof color === 'string' && /^#[0-9a-fA-F]{6}$/.test(color) ? color : DEFAULT_SETTINGS.changingLineColor;
}

function renderLiuyaoBlock(source: string, element: HTMLElement): void {
  const { lunar, hexagram, date, sixGods } = parse(source);

  element.empty();

  const panel = element.appendChild(div('liuyao-panel'));

  if (hexagram === 'invalid' && date === 'invalid') {
    // TEST 这里可以测试很大的日期，会触发羡慕的阴历字典不足异常
    panel.append(
      div('liuyao-error', [
        h('h6', '', '六爻块数据无效！格式如下：'),
        ol(['第1行写六爻表达式', '或者第1行写日期（格式为2000-01-01 10:20），第2行写六爻表达式']),
        h('h6', '', '六爻表达式的格式：'),
        ol([
          '数字0~3，例：211212（水风井）',
          '单拆重交，例：拆单单拆单拆（水风井）',
          '八卦名，例：坤坤坎艮坎坤（等价于001110，泽山咸->乾为天）',
        ]),
        h('small', '', lunar === 'invalid' ? '日期正常，但阴历字典数据不足，无法获取六神信息' : ''),
      ]),
    );
    return;
  }

  const wrapper = panel.appendChild(div('liuyao-block'));
  if (date && date !== 'invalid' && lunar) {
    if (lunar !== 'invalid') {
      wrapper.append(solarlunarCard({ date, lunar }));
    } else {
      wrapper.append(div('liuyao-error', '日期正常，但阴历字典数据不足，无法获取六神信息'));
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

  panel.append(wrapper, div('liuyao-watermark', 'v__VERSION__'));
}

export default class LiuyaoRendererPlugin extends Plugin {
  settings: LiuyaoRendererSettings = { ...DEFAULT_SETTINGS };

  async onload(): Promise<void> {
    await this.loadSettings();

    this.applySettings();
    this.addSettingTab(new LiuyaoSettingTab(this.app, this));
    this.registerMarkdownCodeBlockProcessor('liuyao', renderLiuyaoBlock);
  }

  onunload(): void {
    activeDocument.body.style.removeProperty('--liuyao-changing-line-color');
  }

  async loadSettings(): Promise<void> {
    const loaded = (await this.loadData()) as Partial<LiuyaoRendererSettings> | null;
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...loaded,
      changingLineColor: normalizeColor(loaded?.changingLineColor),
    };
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  applySettings(): void {
    activeDocument.body.style.setProperty('--liuyao-changing-line-color', normalizeColor(this.settings.changingLineColor));
  }

  async onExternalSettingsChange(): Promise<void> {
    await this.loadSettings();
    this.applySettings();
  }
}

class LiuyaoSettingTab extends PluginSettingTab {
  plugin: LiuyaoRendererPlugin;

  constructor(app: App, plugin: LiuyaoRendererPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    this.containerEl.empty();

    new Setting(this.containerEl).setName('六爻渲染设置').setHeading();

    new Setting(this.containerEl)
      .setName('变爻颜色')
      .setDesc('用于标记老阴、老阳变爻的颜色。')
      .addColorPicker((colorPicker) =>
        colorPicker.setValue(this.plugin.settings.changingLineColor).onChange(async (value) => {
          this.plugin.settings.changingLineColor = normalizeColor(value);
          this.plugin.applySettings();
          await this.plugin.saveSettings();
        }),
      )
      .addExtraButton((button) =>
        button
          .setIcon('reset')
          .setTooltip('恢复默认颜色')
          .onClick(async () => {
            this.plugin.settings.changingLineColor = DEFAULT_SETTINGS.changingLineColor;
            this.plugin.applySettings();
            await this.plugin.saveSettings();
            this.display();
          }),
      );
  }
}
