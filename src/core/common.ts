import { SetupGramInfo } from './setup-gram.js';

`
䷁,䷖,䷇,䷓,䷏,䷢,䷬,䷋,
坤,剥,比,观,豫,晋,萃,否,

䷎,䷳,䷦,䷴,䷽,䷷,䷞,䷠,
谦,艮,蹇,渐,小过,旅,咸,遁,

䷆,䷃,䷜,䷺,䷧,䷿,䷮,䷅,
师,蒙,坎,涣,解,未济,困,讼,

䷭,䷑,䷯,䷸,䷟,䷱,䷛,䷫,
升,蛊,井,巽,恒,鼎,大过,姤,

䷗,䷚,䷂,䷩,䷲,䷔,䷐,䷘,
复,颐,屯,益,震,噬嗑,随,无妄,

䷣,䷕,䷾,䷤,䷶,䷝,䷰,䷌,
明夷,贲,既济,家人,丰,离,革,同人,

䷒,䷨,䷻,䷼,䷵,䷥,䷹,䷉,
临,损,节,中孚,归妹,睽,兑,履,

䷊,䷙,䷄,䷈,䷡,䷍,䷪,䷀,
泰,大畜,需,小畜,大壮,大有,夬,乾
`;

export const FamilyIndexName = [
  '本宫卦',
  '一世卦',
  '二世卦',
  '三世卦',
  '四世卦',
  '五世卦',
  '游魂卦',
  '归魂卦',
] as const;

export interface HexagramInfo {
  /**
   * 卦象的二进制表示
   * - 0表示阴爻，1表示阳爻
   * - 从左到右依次为初爻、二爻、三爻、四爻、五爻、上爻
   */
  b: string;

  /**
   * 加上了上下两卦名字的卦名
   * @example 坤为地、地雷复、地水师等
   */
  id: string;

  /**
   * 64卦对应的Unicode符号
   */
  sign: string;

  /**
   * 五行
   * @description 并非五种元素，而是5种状态变化
   */
  state: '金' | '木' | '水' | '火' | '土';

  /**
   * 八宫六十四卦
   * @description 宫不是宫殿，而是一类、一族
   */
  family: '乾' | '兑' | '离' | '震' | '巽' | '坎' | '艮' | '坤';

  /**
   * 八宫索引
   * @description 本宫、一世、二世、三世、四世、五世、游魂、归魂
   */
  familyIndex: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

  /**
   * 世应信息
   * @description 世应是六爻占卜中的重要概念，代表了占卜者（世）和对方（应）的关系
   */
  setup: [SetupGramInfo, SetupGramInfo, SetupGramInfo, SetupGramInfo, SetupGramInfo, SetupGramInfo];
}

export const Hexagrams = {
  list: [
    {
      b: '000000',
      id: '坤为地',
      sign: '䷁',
      state: '土',
      family: '坤',
      familyIndex: 0,
      setup: [
        {
          desc: '兄弟未土',
        },
        {
          desc: '父母巳火',
        },
        {
          desc: '官鬼卯木',
          type: '应',
        },
        {
          desc: '兄弟丑土',
        },
        {
          desc: '妻财亥水',
        },
        {
          desc: '子孙酉金',
          type: '世',
        },
      ],
    },
    {
      b: '100000',
      id: '地雷复',
      sign: '䷗',
      state: '土',
      family: '坤',
      familyIndex: 1,
      setup: [
        {
          desc: '妻财子水',
          type: '世',
        },
        {
          desc: '官鬼寅木',
        },
        {
          desc: '兄弟辰土',
        },
        {
          desc: '兄弟丑土',
          type: '应',
        },
        {
          desc: '妻财亥水',
        },
        {
          desc: '子孙酉金',
        },
      ],
    },
    {
      b: '010000',
      id: '地水师',
      sign: '䷆',
      state: '水',
      family: '坎',
      familyIndex: 7,
      setup: [
        {
          desc: '子孙寅木',
        },
        {
          desc: '官鬼辰土',
        },
        {
          desc: '妻财午火',
          type: '世',
        },
        {
          desc: '官鬼丑土',
        },
        {
          desc: '兄弟亥水',
        },
        {
          desc: '父母酉金',
          type: '应',
        },
      ],
    },
    {
      b: '110000',
      id: '地泽临',
      sign: '䷒',
      state: '土',
      family: '坤',
      familyIndex: 2,
      setup: [
        {
          desc: '父母巳火',
        },
        {
          desc: '官鬼卯木',
          type: '世',
        },
        {
          desc: '兄弟丑土',
        },
        {
          desc: '兄弟丑土',
        },
        {
          desc: '妻财亥水',
          type: '应',
        },
        {
          desc: '子孙酉金',
        },
      ],
    },
    {
      b: '001000',
      id: '地山谦',
      sign: '䷎',
      state: '土',
      family: '兑',
      familyIndex: 5,
      setup: [
        {
          desc: '父母辰土',
        },
        {
          desc: '官鬼午火',
          type: '应',
        },
        {
          desc: '兄弟申金',
        },
        {
          desc: '父母丑土',
        },
        {
          desc: '子孙亥水',
          type: '世',
        },
        {
          desc: '兄弟酉金',
        },
      ],
    },
    {
      b: '101000',
      id: '地火明夷',
      sign: '䷣',
      state: '水',
      family: '坎',
      familyIndex: 6,
      setup: [
        {
          desc: '子孙卯木',
          type: '应',
        },
        {
          desc: '官鬼丑土',
        },
        {
          desc: '兄弟亥水',
        },
        {
          desc: '官鬼丑土',
          type: '世',
        },
        {
          desc: '兄弟亥水',
        },
        {
          desc: '父母酉金',
        },
      ],
    },
    {
      b: '011000',
      id: '地风升',
      sign: '䷭',
      state: '木',
      family: '震',
      familyIndex: 4,
      setup: [
        {
          desc: '妻财丑土',
          type: '应',
        },
        {
          desc: '父母亥水',
        },
        {
          desc: '官鬼酉金',
        },
        {
          desc: '妻财丑土',
          type: '世',
        },
        {
          desc: '父母亥水',
        },
        {
          desc: '官鬼酉金',
        },
      ],
    },
    {
      b: '111000',
      id: '地天泰',
      sign: '䷊',
      state: '土',
      family: '坤',
      familyIndex: 3,
      setup: [
        {
          desc: '妻财子水',
        },
        {
          desc: '官鬼寅木',
        },
        {
          desc: '兄弟辰土',
          type: '世',
        },
        {
          desc: '兄弟丑土',
        },
        {
          desc: '妻财亥水',
        },
        {
          desc: '子孙酉金',
          type: '应',
        },
      ],
    },
    {
      b: '000100',
      id: '雷地豫',
      sign: '䷏',
      state: '木',
      family: '震',
      familyIndex: 1,
      setup: [
        {
          desc: '妻财未土',
          type: '世',
        },
        {
          desc: '子孙巳火',
        },
        {
          desc: '兄弟卯木',
        },
        {
          desc: '子孙午火',
          type: '应',
        },
        {
          desc: '官鬼申金',
        },
        {
          desc: '妻财戌土',
        },
      ],
    },
    {
      b: '100100',
      id: '震为雷',
      sign: '䷲',
      state: '木',
      family: '震',
      familyIndex: 0,
      setup: [
        {
          desc: '父母子水',
        },
        {
          desc: '兄弟寅木',
        },
        {
          desc: '妻财辰土',
          type: '应',
        },
        {
          desc: '子孙午火',
        },
        {
          desc: '官鬼申金',
        },
        {
          desc: '妻财戌土',
          type: '世',
        },
      ],
    },
    {
      b: '010100',
      id: '雷水解',
      sign: '䷧',
      state: '木',
      family: '震',
      familyIndex: 2,
      setup: [
        {
          desc: '兄弟寅木',
        },
        {
          desc: '妻财辰土',
          type: '世',
        },
        {
          desc: '子孙午火',
        },
        {
          desc: '子孙午火',
        },
        {
          desc: '官鬼申金',
          type: '应',
        },
        {
          desc: '妻财戌土',
        },
      ],
    },
    {
      b: '110100',
      id: '雷泽归妹',
      sign: '䷵',
      state: '金',
      family: '兑',
      familyIndex: 7,
      setup: [
        {
          desc: '官鬼巳火',
        },
        {
          desc: '妻财卯木',
        },
        {
          desc: '父母丑土',
          type: '世',
        },
        {
          desc: '官鬼午火',
        },
        {
          desc: '兄弟申金',
        },
        {
          desc: '父母戌土',
          type: '应',
        },
      ],
    },
    {
      b: '001100',
      id: '雷山小过',
      sign: '䷽',
      state: '金',
      family: '兑',
      familyIndex: 6,
      setup: [
        {
          desc: '父母辰土',
          type: '应',
        },
        {
          desc: '官鬼午火',
        },
        {
          desc: '兄弟申金',
        },
        {
          desc: '官鬼午火',
          type: '世',
        },
        {
          desc: '兄弟申金',
        },
        {
          desc: '父母戌土',
        },
      ],
    },
    {
      b: '101100',
      id: '雷火丰',
      sign: '䷶',
      state: '水',
      family: '坎',
      familyIndex: 5,
      setup: [
        {
          desc: '子孙卯木',
        },
        {
          desc: '官鬼丑土',
          type: '应',
        },
        {
          desc: '兄弟亥水',
        },
        {
          desc: '妻财午火',
        },
        {
          desc: '父母申金',
          type: '世',
        },
        {
          desc: '官鬼戌土',
        },
      ],
    },
    {
      b: '011100',
      id: '雷风恒',
      sign: '䷟',
      state: '木',
      family: '震',
      familyIndex: 3,
      setup: [
        {
          desc: '妻财丑土',
        },
        {
          desc: '父母亥水',
        },
        {
          desc: '官鬼酉金',
          type: '世',
        },
        {
          desc: '子孙午火',
        },
        {
          desc: '官鬼申金',
        },
        {
          desc: '妻财戌土',
          type: '应',
        },
      ],
    },
    {
      b: '111100',
      id: '雷天大壮',
      sign: '䷡',
      state: '土',
      family: '坤',
      familyIndex: 4,
      setup: [
        {
          desc: '妻财子水',
          type: '应',
        },
        {
          desc: '官鬼寅木',
        },
        {
          desc: '兄弟辰土',
        },
        {
          desc: '父母午火',
          type: '世',
        },
        {
          desc: '子孙申金',
        },
        {
          desc: '兄弟戌土',
        },
      ],
    },
    {
      b: '000010',
      id: '水地比',
      sign: '䷇',
      state: '土',
      family: '坤',
      familyIndex: 7,
      setup: [
        {
          desc: '兄弟未土',
        },
        {
          desc: '父母巳火',
        },
        {
          desc: '官鬼卯木',
          type: '世',
        },
        {
          desc: '子孙申金',
        },
        {
          desc: '兄弟戌土',
        },
        {
          desc: '妻财子水',
          type: '应',
        },
      ],
    },
    {
      b: '100010',
      id: '水雷屯',
      sign: '䷂',
      state: '水',
      family: '坎',
      familyIndex: 2,
      setup: [
        {
          desc: '兄弟子水',
        },
        {
          desc: '子孙寅木',
          type: '世',
        },
        {
          desc: '官鬼辰土',
        },
        {
          desc: '父母申金',
        },
        {
          desc: '官鬼戌土',
          type: '应',
        },
        {
          desc: '兄弟子水',
        },
      ],
    },
    {
      b: '010010',
      id: '坎为水',
      sign: '䷜',
      state: '水',
      family: '坎',
      familyIndex: 0,
      setup: [
        {
          desc: '子孙寅木',
        },
        {
          desc: '官鬼辰土',
        },
        {
          desc: '妻财午火',
          type: '应',
        },
        {
          desc: '父母申金',
        },
        {
          desc: '官鬼戌土',
        },
        {
          desc: '兄弟子水',
          type: '世',
        },
      ],
    },
    {
      b: '110010',
      id: '水泽节',
      sign: '䷻',
      state: '水',
      family: '坎',
      familyIndex: 1,
      setup: [
        {
          desc: '妻财巳火',
          type: '世',
        },
        {
          desc: '子孙卯木',
        },
        {
          desc: '官鬼丑土',
        },
        {
          desc: '父母申金',
          type: '应',
        },
        {
          desc: '官鬼戌土',
        },
        {
          desc: '兄弟子水',
        },
      ],
    },
    {
      b: '001010',
      id: '水山蹇',
      sign: '䷦',
      state: '金',
      family: '兑',
      familyIndex: 4,
      setup: [
        {
          desc: '父母辰土',
          type: '应',
        },
        {
          desc: '官鬼午火',
        },
        {
          desc: '兄弟申金',
        },
        {
          desc: '兄弟申金',
          type: '世',
        },
        {
          desc: '父母戌土',
        },
        {
          desc: '子孙子水',
        },
      ],
    },
    {
      b: '101010',
      id: '水火既济',
      sign: '䷾',
      state: '水',
      family: '坎',
      familyIndex: 3,
      setup: [
        {
          desc: '子孙卯木',
        },
        {
          desc: '官鬼丑土',
        },
        {
          desc: '兄弟亥水',
          type: '世',
        },
        {
          desc: '父母申金',
        },
        {
          desc: '官鬼戌土',
        },
        {
          desc: '兄弟子水',
          type: '应',
        },
      ],
    },
    {
      b: '011010',
      id: '水风井',
      sign: '䷯',
      state: '木',
      family: '震',
      familyIndex: 5,
      setup: [
        {
          desc: '妻财丑土',
        },
        {
          desc: '父母亥水',
          type: '应',
        },
        {
          desc: '官鬼酉金',
        },
        {
          desc: '官鬼申金',
        },
        {
          desc: '妻财戌土',
          type: '世',
        },
        {
          desc: '父母子水',
        },
      ],
    },
    {
      b: '111010',
      id: '水天需',
      sign: '䷄',
      state: '土',
      family: '坤',
      familyIndex: 6,
      setup: [
        {
          desc: '妻财子水',
          type: '应',
        },
        {
          desc: '官鬼寅木',
        },
        {
          desc: '兄弟辰土',
        },
        {
          desc: '子孙申金',
          type: '世',
        },
        {
          desc: '兄弟戌土',
        },
        {
          desc: '妻财子水',
        },
      ],
    },
    {
      b: '000110',
      id: '泽地萃',
      sign: '䷬',
      state: '金',
      family: '兑',
      familyIndex: 2,
      setup: [
        {
          desc: '父母未土',
        },
        {
          desc: '官鬼巳火',
          type: '世',
        },
        {
          desc: '妻财卯木',
        },
        {
          desc: '子孙亥水',
        },
        {
          desc: '兄弟酉金',
          type: '应',
        },
        {
          desc: '父母未土',
        },
      ],
    },
    {
      b: '100110',
      id: '泽雷随',
      sign: '䷐',
      state: '木',
      family: '震',
      familyIndex: 7,
      setup: [
        {
          desc: '父母子水',
        },
        {
          desc: '兄弟寅木',
        },
        {
          desc: '妻财辰土',
          type: '世',
        },
        {
          desc: '父母亥水',
        },
        {
          desc: '官鬼酉金',
        },
        {
          desc: '妻财未土',
          type: '应',
        },
      ],
    },
    {
      b: '010110',
      id: '泽水困',
      sign: '䷮',
      state: '金',
      family: '兑',
      familyIndex: 1,
      setup: [
        {
          desc: '妻财卯木',
          type: '世',
        },
        {
          desc: '父母辰土',
        },
        {
          desc: '官鬼午火',
        },
        {
          desc: '子孙亥水',
          type: '应',
        },
        {
          desc: '兄弟酉金',
        },
        {
          desc: '父母未土',
        },
      ],
    },
    {
      b: '110110',
      id: '兑为泽',
      sign: '䷹',
      state: '金',
      family: '兑',
      familyIndex: 0,
      setup: [
        {
          desc: '官鬼巳火',
        },
        {
          desc: '妻财卯木',
        },
        {
          desc: '父母丑土',
          type: '应',
        },
        {
          desc: '子孙亥水',
        },
        {
          desc: '兄弟酉金',
        },
        {
          desc: '父母未土',
          type: '世',
        },
      ],
    },
    {
      b: '001110',
      id: '泽山咸',
      sign: '䷞',
      state: '金',
      family: '兑',
      familyIndex: 3,
      setup: [
        {
          desc: '父母辰土',
        },
        {
          desc: '官鬼午火',
        },
        {
          desc: '兄弟申金',
          type: '世',
        },
        {
          desc: '子孙亥水',
        },
        {
          desc: '兄弟酉金',
        },
        {
          desc: '父母未土',
          type: '应',
        },
      ],
    },
    {
      b: '101110',
      id: '泽火革',
      sign: '䷰',
      state: '水',
      family: '坎',
      familyIndex: 4,
      setup: [
        {
          desc: '子孙卯木',
          type: '应',
        },
        {
          desc: '官鬼丑土',
        },
        {
          desc: '兄弟亥水',
        },
        {
          desc: '兄弟亥水',
          type: '世',
        },
        {
          desc: '父母酉金',
        },
        {
          desc: '官鬼未土',
        },
      ],
    },
    {
      b: '011110',
      id: '泽风大过',
      sign: '䷛',
      state: '木',
      family: '震',
      familyIndex: 6,
      setup: [
        {
          desc: '妻财丑土',
          type: '应',
        },
        {
          desc: '父母亥水',
        },
        {
          desc: '官鬼酉金',
        },
        {
          desc: '父母亥水',
          type: '世',
        },
        {
          desc: '官鬼酉金',
        },
        {
          desc: '妻财未土',
        },
      ],
    },
    {
      b: '111110',
      id: '泽天夬',
      sign: '䷪',
      state: '土',
      family: '坤',
      familyIndex: 5,
      setup: [
        {
          desc: '妻财子水',
        },
        {
          desc: '官鬼寅木',
          type: '应',
        },
        {
          desc: '兄弟辰土',
        },
        {
          desc: '妻财亥水',
        },
        {
          desc: '子孙酉金',
          type: '世',
        },
        {
          desc: '兄弟未土',
        },
      ],
    },
    {
      b: '000001',
      id: '山地剥',
      sign: '䷖',
      state: '金',
      family: '乾',
      familyIndex: 5,
      setup: [
        {
          desc: '父母未土',
        },
        {
          desc: '官鬼巳火',
          type: '应',
        },
        {
          desc: '妻财卯木',
        },
        {
          desc: '父母戌土',
        },
        {
          desc: '子孙子水',
          type: '世',
        },
        {
          desc: '妻财卯木',
        },
      ],
    },
    {
      b: '100001',
      id: '山雷颐',
      sign: '䷚',
      state: '木',
      family: '巽',
      familyIndex: 6,
      setup: [
        {
          desc: '父母子水',
          type: '应',
        },
        {
          desc: '兄弟寅木',
        },
        {
          desc: '妻财辰土',
        },
        {
          desc: '妻财戌土',
          type: '世',
        },
        {
          desc: '父母子水',
        },
        {
          desc: '兄弟寅木',
        },
      ],
    },
    {
      b: '010001',
      id: '山水蒙',
      sign: '䷃',
      state: '火',
      family: '离',
      familyIndex: 4,
      setup: [
        {
          desc: '父母寅木',
          type: '应',
        },
        {
          desc: '子孙辰土',
        },
        {
          desc: '兄弟午火',
        },
        {
          desc: '子孙戌土',
          type: '世',
        },
        {
          desc: '官鬼子水',
        },
        {
          desc: '父母寅木',
        },
      ],
    },
    {
      b: '110001',
      id: '山泽损',
      sign: '䷨',
      state: '土',
      family: '艮',
      familyIndex: 3,
      setup: [
        {
          desc: '父母巳火',
        },
        {
          desc: '官鬼卯木',
        },
        {
          desc: '兄弟丑土',
          type: '世',
        },
        {
          desc: '兄弟戌土',
        },
        {
          desc: '妻财子水',
        },
        {
          desc: '官鬼寅木',
          type: '应',
        },
      ],
    },
    {
      b: '001001',
      id: '艮为山',
      sign: '䷳',
      state: '土',
      family: '艮',
      familyIndex: 0,
      setup: [
        {
          desc: '兄弟辰土',
        },
        {
          desc: '父母午火',
        },
        {
          desc: '子孙申金',
          type: '应',
        },
        {
          desc: '兄弟戌土',
        },
        {
          desc: '妻财子水',
        },
        {
          desc: '官鬼寅木',
          type: '世',
        },
      ],
    },
    {
      b: '101001',
      id: '山火贲',
      sign: '䷕',
      state: '土',
      family: '艮',
      familyIndex: 1,
      setup: [
        {
          desc: '官鬼卯木',
          type: '世',
        },
        {
          desc: '兄弟丑土',
        },
        {
          desc: '妻财亥水',
        },
        {
          desc: '兄弟戌土',
          type: '应',
        },
        {
          desc: '妻财子水',
        },
        {
          desc: '官鬼寅木',
        },
      ],
    },
    {
      b: '011001',
      id: '山风蛊',
      sign: '䷑',
      state: '木',
      family: '巽',
      familyIndex: 7,
      setup: [
        {
          desc: '妻财丑土',
        },
        {
          desc: '父母亥水',
        },
        {
          desc: '官鬼酉金',
          type: '世',
        },
        {
          desc: '妻财戌土',
        },
        {
          desc: '父母子水',
        },
        {
          desc: '兄弟寅木',
          type: '应',
        },
      ],
    },
    {
      b: '111001',
      id: '山天大畜',
      sign: '䷙',
      state: '土',
      family: '艮',
      familyIndex: 2,
      setup: [
        {
          desc: '妻财子水',
        },
        {
          desc: '官鬼寅木',
          type: '世',
        },
        {
          desc: '兄弟辰土',
        },
        {
          desc: '兄弟戌土',
        },
        {
          desc: '妻财子水',
          type: '应',
        },
        {
          desc: '官鬼寅木',
        },
      ],
    },
    {
      b: '000101',
      id: '火地晋',
      sign: '䷢',
      state: '金',
      family: '乾',
      familyIndex: 6,
      setup: [
        {
          desc: '父母未土',
          type: '应',
        },
        {
          desc: '官鬼巳火',
        },
        {
          desc: '妻财卯木',
        },
        {
          desc: '兄弟酉金',
          type: '世',
        },
        {
          desc: '父母未土',
        },
        {
          desc: '官鬼巳火',
        },
      ],
    },
    {
      b: '100101',
      id: '火雷噬嗑',
      sign: '䷔',
      state: '木',
      family: '巽',
      familyIndex: 5,
      setup: [
        {
          desc: '父母子水',
        },
        {
          desc: '兄弟寅木',
          type: '应',
        },
        {
          desc: '妻财辰土',
        },
        {
          desc: '官鬼酉金',
        },
        {
          desc: '妻财未土',
          type: '世',
        },
        {
          desc: '子孙巳火',
        },
      ],
    },
    {
      b: '010101',
      id: '火水未济',
      sign: '䷿',
      state: '火',
      family: '离',
      familyIndex: 3,
      setup: [
        {
          desc: '父母寅木',
        },
        {
          desc: '子孙辰土',
        },
        {
          desc: '兄弟午火',
          type: '世',
        },
        {
          desc: '妻财酉金',
        },
        {
          desc: '子孙未土',
        },
        {
          desc: '兄弟巳火',
          type: '应',
        },
      ],
    },
    {
      b: '110101',
      id: '火泽睽',
      sign: '䷥',
      state: '土',
      family: '艮',
      familyIndex: 4,
      setup: [
        {
          desc: '父母巳火',
          type: '应',
        },
        {
          desc: '官鬼卯木',
        },
        {
          desc: '兄弟丑土',
        },
        {
          desc: '子孙酉金',
          type: '世',
        },
        {
          desc: '兄弟未土',
        },
        {
          desc: '父母巳火',
        },
      ],
    },
    {
      b: '001101',
      id: '火山旅',
      sign: '䷷',
      state: '火',
      family: '离',
      familyIndex: 1,
      setup: [
        {
          desc: '子孙辰土',
          type: '世',
        },
        {
          desc: '兄弟午火',
        },
        {
          desc: '妻财申金',
        },
        {
          desc: '妻财酉金',
          type: '应',
        },
        {
          desc: '子孙未土',
        },
        {
          desc: '兄弟巳火',
        },
      ],
    },
    {
      b: '101101',
      id: '离为火',
      sign: '䷝',
      state: '火',
      family: '离',
      familyIndex: 0,
      setup: [
        {
          desc: '父母卯木',
        },
        {
          desc: '子孙丑土',
        },
        {
          desc: '官鬼亥水',
          type: '应',
        },
        {
          desc: '妻财酉金',
        },
        {
          desc: '子孙未土',
        },
        {
          desc: '兄弟巳火',
          type: '世',
        },
      ],
    },
    {
      b: '011101',
      id: '火风鼎',
      sign: '䷱',
      state: '火',
      family: '离',
      familyIndex: 2,
      setup: [
        {
          desc: '子孙丑土',
        },
        {
          desc: '官鬼亥水',
          type: '世',
        },
        {
          desc: '妻财酉金',
        },
        {
          desc: '妻财酉金',
        },
        {
          desc: '子孙未土',
          type: '应',
        },
        {
          desc: '兄弟巳火',
        },
      ],
    },
    {
      b: '111101',
      id: '火天大有',
      sign: '䷍',
      state: '金',
      family: '乾',
      familyIndex: 7,
      setup: [
        {
          desc: '子孙子水',
        },
        {
          desc: '妻财寅木',
        },
        {
          desc: '父母辰土',
          type: '世',
        },
        {
          desc: '兄弟酉金',
        },
        {
          desc: '父母未土',
        },
        {
          desc: '官鬼巳火',
          type: '应',
        },
      ],
    },
    {
      b: '000011',
      id: '风地观',
      sign: '䷓',
      state: '金',
      family: '乾',
      familyIndex: 4,
      setup: [
        {
          desc: '父母未土',
          type: '应',
        },
        {
          desc: '官鬼巳火',
        },
        {
          desc: '妻财卯木',
        },
        {
          desc: '父母未土',
          type: '世',
        },
        {
          desc: '官鬼巳火',
        },
        {
          desc: '妻财卯木',
        },
      ],
    },
    {
      b: '100011',
      id: '风雷益',
      sign: '䷩',
      state: '木',
      family: '巽',
      familyIndex: 3,
      setup: [
        {
          desc: '父母子水',
        },
        {
          desc: '兄弟寅木',
        },
        {
          desc: '妻财辰土',
          type: '世',
        },
        {
          desc: '妻财未土',
        },
        {
          desc: '子孙巳火',
        },
        {
          desc: '兄弟卯木',
          type: '应',
        },
      ],
    },
    {
      b: '010011',
      id: '风水涣',
      sign: '䷺',
      state: '火',
      family: '离',
      familyIndex: 5,
      setup: [
        {
          desc: '父母寅木',
        },
        {
          desc: '子孙辰土',
          type: '应',
        },
        {
          desc: '兄弟午火',
        },
        {
          desc: '子孙未土',
        },
        {
          desc: '兄弟巳火',
          type: '世',
        },
        {
          desc: '父母卯木',
        },
      ],
    },
    {
      b: '110011',
      id: '风泽中孚',
      sign: '䷼',
      state: '土',
      family: '艮',
      familyIndex: 6,
      setup: [
        {
          desc: '父母巳火',
          type: '应',
        },
        {
          desc: '官鬼卯木',
        },
        {
          desc: '兄弟丑土',
        },
        {
          desc: '兄弟未土',
          type: '世',
        },
        {
          desc: '父母巳火',
        },
        {
          desc: '官鬼卯木',
        },
      ],
    },
    {
      b: '001011',
      id: '风山渐',
      sign: '䷴',
      state: '土',
      family: '艮',
      familyIndex: 7,
      setup: [
        {
          desc: '兄弟辰土',
        },
        {
          desc: '父母午火',
        },
        {
          desc: '子孙申金',
          type: '世',
        },
        {
          desc: '兄弟未土',
        },
        {
          desc: '父母巳火',
        },
        {
          desc: '官鬼卯木',
          type: '应',
        },
      ],
    },
    {
      b: '101011',
      id: '风火家人',
      sign: '䷤',
      state: '木',
      family: '巽',
      familyIndex: 2,
      setup: [
        {
          desc: '兄弟卯木',
        },
        {
          desc: '妻财丑土',
          type: '世',
        },
        {
          desc: '父母亥水',
        },
        {
          desc: '妻财未土',
        },
        {
          desc: '子孙巳火',
          type: '应',
        },
        {
          desc: '兄弟卯木',
        },
      ],
    },
    {
      b: '011011',
      id: '巽为风',
      sign: '䷸',
      state: '木',
      family: '巽',
      familyIndex: 0,
      setup: [
        {
          desc: '妻财丑土',
        },
        {
          desc: '父母亥水',
        },
        {
          desc: '官鬼酉金',
          type: '应',
        },
        {
          desc: '妻财未土',
        },
        {
          desc: '子孙巳火',
        },
        {
          desc: '兄弟卯木',
          type: '世',
        },
      ],
    },
    {
      b: '111011',
      id: '风天小畜',
      sign: '䷈',
      state: '木',
      family: '巽',
      familyIndex: 1,
      setup: [
        {
          desc: '父母子水',
          type: '世',
        },
        {
          desc: '兄弟寅木',
        },
        {
          desc: '妻财辰土',
        },
        {
          desc: '妻财未土',
          type: '应',
        },
        {
          desc: '子孙巳火',
        },
        {
          desc: '兄弟卯木',
        },
      ],
    },
    {
      b: '000111',
      id: '天地否',
      sign: '䷋',
      state: '金',
      family: '乾',
      familyIndex: 3,
      setup: [
        {
          desc: '父母未土',
        },
        {
          desc: '官鬼巳火',
        },
        {
          desc: '妻财卯木',
          type: '世',
        },
        {
          desc: '官鬼午火',
        },
        {
          desc: '兄弟申金',
        },
        {
          desc: '父母戌土',
          type: '应',
        },
      ],
    },
    {
      b: '100111',
      id: '天雷无妄',
      sign: '䷘',
      state: '木',
      family: '巽',
      familyIndex: 4,
      setup: [
        {
          desc: '父母子水',
          type: '应',
        },
        {
          desc: '兄弟寅木',
        },
        {
          desc: '妻财辰土',
        },
        {
          desc: '子孙午火',
          type: '世',
        },
        {
          desc: '官鬼申金',
        },
        {
          desc: '妻财戌土',
        },
      ],
    },
    {
      b: '010111',
      id: '天水讼',
      sign: '䷅',
      state: '火',
      family: '离',
      familyIndex: 6,
      setup: [
        {
          desc: '父母寅木',
          type: '应',
        },
        {
          desc: '子孙辰土',
        },
        {
          desc: '兄弟午火',
        },
        {
          desc: '兄弟午火',
          type: '世',
        },
        {
          desc: '妻财申金',
        },
        {
          desc: '子孙戌土',
        },
      ],
    },
    {
      b: '110111',
      id: '天泽履',
      sign: '䷉',
      state: '土',
      family: '艮',
      familyIndex: 5,
      setup: [
        {
          desc: '父母巳火',
        },
        {
          desc: '官鬼卯木',
          type: '应',
        },
        {
          desc: '兄弟丑土',
        },
        {
          desc: '父母午火',
        },
        {
          desc: '子孙申金',
          type: '世',
        },
        {
          desc: '兄弟戌土',
        },
      ],
    },
    {
      b: '001111',
      id: '天山遁',
      sign: '䷠',
      state: '金',
      family: '乾',
      familyIndex: 2,
      setup: [
        {
          desc: '父母辰土',
        },
        {
          desc: '官鬼午火',
          type: '世',
        },
        {
          desc: '兄弟申金',
        },
        {
          desc: '官鬼午火',
        },
        {
          desc: '兄弟申金',
          type: '应',
        },
        {
          desc: '父母戌土',
        },
      ],
    },
    {
      b: '101111',
      id: '天火同人',
      sign: '䷌',
      state: '火',
      family: '离',
      familyIndex: 7,
      setup: [
        {
          desc: '父母寅木',
        },
        {
          desc: '子孙辰土',
        },
        {
          desc: '兄弟午火',
          type: '世',
        },
        {
          desc: '子孙未土',
        },
        {
          desc: '父母巳火',
        },
        {
          desc: '子孙戌土',
          type: '应',
        },
      ],
    },
    {
      b: '011111',
      id: '天风姤',
      sign: '䷫',
      state: '金',
      family: '乾',
      familyIndex: 1,
      setup: [
        {
          desc: '父母丑土',
          type: '世',
        },
        {
          desc: '子孙亥水',
        },
        {
          desc: '兄弟酉金',
        },
        {
          desc: '官鬼午火',
          type: '应',
        },
        {
          desc: '兄弟申金',
        },
        {
          desc: '父母戌土',
        },
      ],
    },
    {
      b: '111111',
      id: '乾为天',
      sign: '䷀',
      state: '金',
      family: '乾',
      familyIndex: 0,
      setup: [
        {
          desc: '子孙子水',
        },
        {
          desc: '妻财寅木',
        },
        {
          desc: '父母辰土',
          type: '应',
        },
        {
          desc: '官鬼午火',
        },
        {
          desc: '兄弟申金',
        },
        {
          desc: '父母戌土',
          type: '世',
        },
      ],
    },
  ] satisfies HexagramInfo[],
  find(binary: string) {
    const info = this.list.find((h) => h.b === binary);
    if (!info) {
      throw new Error(`六十四卦：无法通过二进制找到卦象 ${binary}`);
    }
    return info;
  },
};

// 老阳：○，老阴：×，少阳：’，少阴：”
export const Trigram = {
  list: [
    { b: '000', countOfYang: 0, name: '坤', label: '地', sign: '☷' },
    { b: '100', countOfYang: 1, name: '震', label: '雷', sign: '☳' },
    { b: '010', countOfYang: 1, name: '坎', label: '水', sign: '☵' },
    { b: '110', countOfYang: 2, name: '兑', label: '泽', sign: '☱' },
    { b: '001', countOfYang: 1, name: '艮', label: '山', sign: '☶' },
    { b: '101', countOfYang: 2, name: '离', label: '火', sign: '☲' },
    { b: '011', countOfYang: 2, name: '巽', label: '风', sign: '☴' },
    { b: '111', countOfYang: 3, name: '乾', label: '天', sign: '☰' },
  ],
  find(binary: string) {
    const trigram = this.list.find((t) => t.b === binary);
    if (!trigram) {
      throw new Error(`八卦：无法通过二进制找到卦象 ${binary}`);
    }
    return trigram;
  },
  findByName(name: string) {
    return this.list.find((t) => t.name === name);
  },
};
