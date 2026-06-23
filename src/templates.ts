import type { SolarlunarCardData } from './types.js';
import { dtm, getShichen, html } from './utils.js';

export const createSolarlunarCard = (block: SolarlunarCardData) => {
  const { parsedDate, lunarInfo } = block;
  return html`<!-- t -->
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
};
