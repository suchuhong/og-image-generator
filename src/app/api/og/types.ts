
// 主题接口
export interface Theme {
  background: string;
  text: string;
  accent: string;
  isGradient: boolean;
}

// 字体映射
export type FontMap = Record<string, string>;

// 主题映射
export type ThemeMap = Record<string, Theme>;

// 图像显示模式
export type ImageMode = 'cover' | 'contain' | 'repeat' | 'center'; 