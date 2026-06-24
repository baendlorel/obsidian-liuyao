export const changeYaos = (rawDigits: string): string =>
  rawDigits
    .split('')
    .map((digit) => '1122'[digit as any])
    .join('');

export const dtm = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}`;
};

export const getShichen = (date: Date): string =>
  '子丑丑寅寅卯卯辰辰巳巳午午未未申申酉酉戌戌亥亥子'[date.getHours()] ?? '未知';

export const h = <T extends keyof HTMLElementTagNameMap>(
  tag: T,
  cls: string,
  content?: string,
): HTMLElementTagNameMap[T] => {
  const e = document.createElement(tag);
  e.className = cls;
  if (content) {
    e.textContent = content;
  }
  return e;
};

export const svg = <T extends keyof SVGElementTagNameMap>(
  tag: T,
  attr: Record<string, string>,
): SVGElementTagNameMap[T] => {
  const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attr).forEach(([key, value]) => e.setAttribute(key, value));
  return e;
};

const tp = document.createElement('template');
/**
 * Returns the first html element
 */
export const html = (template: TemplateStringsArray, ...args: string[]): HTMLElement => {
  tp.innerHTML = raw(template, ...args);
  return tp.firstElementChild as HTMLElement;
};

/**
 * Only returns string
 */
export const raw = (template: TemplateStringsArray, ...args: string[]): string => {
  const s: string[] = [];
  for (let i = 0; i < template.length - 1; i++) {
    s.push(template[i], args[i]);
  }
  s.push(template[template.length - 1]);

  return s.join('');
};
