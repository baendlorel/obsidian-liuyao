import { Plugin } from 'obsidian';

const LIUYAO_PATTERN = /\\liuyao\{([0-3]{6})\}/g;

type YaoValue = '0' | '1' | '2' | '3';

const YAO_LABELS: Record<YaoValue, string> = {
  '0': '老阴',
  '1': '少阳',
  '2': '少阴',
  '3': '老阳',
};

export default class LiuyaoRendererPlugin extends Plugin {
  onload(): void {
    this.registerMarkdownPostProcessor((element) => {
      this.renderLiuyaoSyntax(element);
    });
  }

  private renderLiuyaoSyntax(root: HTMLElement): void {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        if (!(node instanceof Text)) {
          return NodeFilter.FILTER_REJECT;
        }

        const parentElement = node.parentElement;

        if (!parentElement) {
          return NodeFilter.FILTER_REJECT;
        }

        if (parentElement.closest('code, pre, .liuyao-inline')) {
          return NodeFilter.FILTER_REJECT;
        }

        return LIUYAO_PATTERN.test(node.textContent ?? '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });

    const textNodes: Text[] = [];

    while (walker.nextNode()) {
      const currentNode = walker.currentNode;
      if (currentNode instanceof Text) {
        textNodes.push(currentNode);
      }
    }

    for (const textNode of textNodes) {
      this.replaceTextNode(textNode);
    }
  }

  private replaceTextNode(textNode: Text): void {
    const content = textNode.textContent ?? '';
    const matches = Array.from(content.matchAll(LIUYAO_PATTERN));

    if (matches.length === 0) {
      return;
    }

    const fragment = document.createDocumentFragment();
    let cursor = 0;

    for (const match of matches) {
      const matchIndex = match.index ?? 0;
      const [fullMatch, rawDigits] = match;

      if (matchIndex > cursor) {
        fragment.append(content.slice(cursor, matchIndex));
      }

      if (isLiuyaoDigits(rawDigits)) {
        fragment.append(this.createDiagram(rawDigits));
      } else {
        fragment.append(fullMatch);
      }

      cursor = matchIndex + fullMatch.length;
    }

    if (cursor < content.length) {
      fragment.append(content.slice(cursor));
    }

    textNode.replaceWith(fragment);
  }

  private createDiagram(rawDigits: string): HTMLElement {
    const wrapper = document.createElement('span');
    wrapper.className = 'liuyao-inline';
    wrapper.setAttribute('aria-label', this.describeDiagram(rawDigits));
    wrapper.setAttribute('title', `六爻卦象 ${rawDigits}`);

    const svgNamespace = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNamespace, 'svg');
    svg.setAttribute('class', 'liuyao-diagram');
    svg.setAttribute('viewBox', '0 0 132 172');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-hidden', 'true');

    const topDownDigits = rawDigits.split('').reverse() as YaoValue[];

    topDownDigits.forEach((digit, index) => {
      const y = 16 + index * 28;
      const color = digit === '0' || digit === '3' ? '#c62828' : '#111111';

      if (digit === '1' || digit === '3') {
        svg.append(this.createLine(svgNamespace, 12, y, 120, y, color));
        return;
      }

      svg.append(this.createLine(svgNamespace, 12, y, 52, y, color));
      svg.append(this.createLine(svgNamespace, 80, y, 120, y, color));
    });

    wrapper.append(svg);
    return wrapper;
  }

  private createLine(
    svgNamespace: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
  ): SVGLineElement {
    const line = document.createElementNS(svgNamespace, 'line') as SVGLineElement;
    line.setAttribute('class', 'liuyao-diagram__line');
    line.setAttribute('x1', String(x1));
    line.setAttribute('y1', String(y1));
    line.setAttribute('x2', String(x2));
    line.setAttribute('y2', String(y2));
    line.setAttribute('stroke', color);
    return line;
  }

  private describeDiagram(rawDigits: string): string {
    const lines = rawDigits
      .split('')
      .reverse()
      .map((digit) => YAO_LABELS[digit as YaoValue]);

    return `六爻卦象：${lines.join('、')}`;
  }
}

function isLiuyaoDigits(value: string | undefined): value is string {
  return value !== undefined && /^[0-3]{6}$/.test(value);
}
