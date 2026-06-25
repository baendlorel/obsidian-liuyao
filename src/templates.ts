import type { DisplayLine, LiuyaoCardData, SolarlunarCardData } from './types.js';
import { dtm, getShichen, div, span, svg } from './utils.js';

const row = (label: string, value: string) =>
  div('lunar-card__row', [span('lunar-card__label', label), span('lunar-card__value', value)]);

export const solarlunarCard = ({ date, lunar }: SolarlunarCardData) =>
  div('lunar-card', [
    row('公历', `${dtm(date)} ${lunar.ncWeek}`),
    row('农历', `${lunar.yearCn} ${lunar.monthCn}${lunar.dayCn}${lunar.isLeap ? '（闰月）' : ''}`),
    row('干支', `${lunar.gzYear}年 ${lunar.gzMonth}月 ${lunar.gzDay}日 ${getShichen(date)}时`),
    row('生肖', lunar.animal),
    row('节气', lunar.isTerm ? lunar.term : '无'),
  ]);

/**
 * 创建单个爻行的模板
 */
const yaoRow = ({ sixGod, description, relation, isYang, tone }: DisplayLine) => {
  const line = div('liuyao-line', [
    span('liuyao-line__segment'),
    span(`liuyao-line__gap ${isYang ? 'd-none' : ''}`),
    span(`liuyao-line__segment ${isYang ? 'd-none' : ''}`),
  ]);
  line.dataset.kind = isYang ? 'yang' : 'yin';
  line.dataset.tone = tone;
  line.setAttribute('aria-hidden', 'true');

  return div('liuyao-card__row', [
    span(`liuyao-card__text liuyao-card__text--god ${sixGod ? '' : 'd-none'}`, sixGod),
    span('liuyao-card__text liuyao-card__text--left', description),
    line,
    span('liuyao-card__text liuyao-card__text--right', relation),
  ]);
};

/**
 * 创建六爻卡片的模板
 */
export const liuyaoCard = ({ hexagram, lines }: LiuyaoCardData) => {
  const hexagramTitle = `${hexagram.palace} ${hexagram.info.id}`;

  // 第一个有六神就是都有六神
  const noGodsClass = !lines[0].sixGod ? 'liuyao-card__no-gods' : '';

  const card = div(`liuyao-card ${noGodsClass}`, [
    div('liuyao-card__title', hexagramTitle),
    ...lines.map((lineInfo) => yaoRow(lineInfo)),
  ]);
  card.title = hexagramTitle;
  return card;
};

/**
 * 创建箭头图标的模板
 */
export const liuyaoArrow = () => {
  const icon = svg('svg');
  icon.classList.add('liuyao-arrow__icon');
  icon.setAttribute('viewBox', '0 0 20 20');
  icon.setAttribute('width', '20');
  icon.setAttribute('height', '20');
  icon.setAttribute('fill', 'none');
  icon.setAttribute('stroke', 'currentColor');
  icon.setAttribute('stroke-width', '1.8');
  icon.setAttribute('stroke-linecap', 'round');
  icon.setAttribute('stroke-linejoin', 'round');

  const shaft = svg('path');
  shaft.setAttribute('d', 'M4 10h12');
  const head = svg('path');
  head.setAttribute('d', 'm11 5 5 5-5 5');
  icon.append(shaft, head);

  const arrow = div('liuyao-arrow', [icon]);
  arrow.setAttribute('aria-hidden', 'true');
  return arrow;
};
