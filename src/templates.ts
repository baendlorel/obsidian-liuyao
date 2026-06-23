import type { DisplayLine, LiuyaoCardData, SolarlunarCardData, VersionWatermarkData } from './types.js';
import { Hexagram } from 'liuyao';
import { dtm, getShichen, html, raw } from './utils.js';

export const createSolarlunarCard = ({ parsedDate, lunarInfo }: SolarlunarCardData) =>
  html`<!-- t -->
    <section class="solarlunar-card">
      <div class="solarlunar-card__row">
        <span class="solarlunar-card__label">公历</span>
        <span class="solarlunar-card__value">${dtm(parsedDate)} ${lunarInfo.ncWeek}</span>
      </div>
      <div class="solarlunar-card__row">
        <span class="solarlunar-card__label">农历</span>
        <span class="solarlunar-card__value">
          ${lunarInfo.yearCn} ${lunarInfo.monthCn}${lunarInfo.dayCn}${lunarInfo.isLeap ? '（闰月）' : ''}
        </span>
      </div>
      <div class="solarlunar-card__row">
        <span class="solarlunar-card__label">干支</span>
        <span class="solarlunar-card__value">
          ${lunarInfo.gzYear}年 ${lunarInfo.gzMonth}月 ${lunarInfo.gzDay}日 ${getShichen(parsedDate)}时
        </span>
      </div>
      <div class="solarlunar-card__row">
        <span class="solarlunar-card__label">生肖</span>
        <span class="solarlunar-card__value">${lunarInfo.animal}</span>
      </div>
      <div class="solarlunar-card__row">
        <span class="solarlunar-card__label">节气</span>
        <span class="solarlunar-card__value">${lunarInfo.isTerm ? lunarInfo.term : '无'}</span>
      </div>
    </section>`;

/**
 * 创建单个爻行的模板
 */
const createLiuyaoLineRowHtml = ({ sixGod, description, relation, isYang, tone }: DisplayLine) => raw`<!-- t -->
    <div class="liuyao-card__row">
      <span class="liuyao-card__text liuyao-card__text--god  ${sixGod ? 'd-none' : ''}">${sixGod}</span>
      <span class="liuyao-card__text liuyao-card__text--left">${description}</span>
      <div class="liuyao-line" data-kind="${isYang ? 'yang' : 'yin'}" data-tone="${tone}" aria-hidden="true">
        <span class="liuyao-line__segment"></span>
        <span class="liuyao-line__gap ${isYang ? 'd-none' : ''}"></span>
        <span class="liuyao-line__segment ${isYang ? 'd-none' : ''}"></span>
      </div>
      <span class="liuyao-card__text liuyao-card__text--right">${relation}</span>
    </div>`;

/**
 * 创建六爻卡片的模板
 */
export const createLiuyaoCard = ({ hexagramInfo, lines }: LiuyaoCardData) => {
  const hexagram = Hexagram.fromYangCounts(hexagramInfo.yangCounts)!;
  const hexagramTitle = `${hexagram.palace} ${hexagramInfo.id}`;

  // 第一个有六神就是都有六神
  const noGodsClass = !lines[0].sixGod ? 'liuyao-card__no-gods' : '';

  return html`<!-- t -->
    <section class="liuyao-card ${noGodsClass}" title="${hexagramTitle}">
      <div class="liuyao-card__title">${hexagramTitle}</div>
      ${lines.map((lineInfo) => createLiuyaoLineRowHtml(lineInfo)).join('')}
    </section>`;
};

/**
 * 创建箭头图标的模板
 */
export const createLiuyaoArrow = () =>
  html`<!-- t -->
    <div class="liuyao-arrow" aria-hidden="true">
      <svg
        class="liuyao-arrow__icon"
        viewBox="0 0 20 20"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M4 10h12"></path>
        <path d="m11 5 5 5-5 5"></path>
      </svg>
    </div>`;

/**
 * 创建版本水印的模板
 */
export const createVersionWatermark = ({ version }: VersionWatermarkData) => html`
  <div class="liuyao-watermark">v${version}</div>
`;
