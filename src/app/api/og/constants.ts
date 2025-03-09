import { FontMap, ThemeMap } from './types';

// 定义支持的字体
export const fonts: FontMap = {
  sans: 'sans-serif',
  serif: 'serif',
  mono: 'monospace',
  cursive: 'cursive',
  fantasy: 'fantasy',
};

// 定义主题颜色，包括渐变主题
export const themes: ThemeMap = {
  light: {
    background: 'white',
    text: '#333333',
    accent: '#0070f3',
    isGradient: false,
  },
  dark: {
    background: '#1a1a1a',
    text: '#ffffff',
    accent: '#3291ff',
    isGradient: false,
  },
  blue: {
    background: '#0070f3',
    text: '#ffffff',
    accent: '#ffffff',
    isGradient: false,
  },
  green: {
    background: '#0f9d58',
    text: '#ffffff',
    accent: '#ffffff',
    isGradient: false,
  },
  red: {
    background: '#e53935',
    text: '#ffffff',
    accent: '#ffcdd2',
    isGradient: false,
  },
  purple: {
    background: '#6a1b9a',
    text: '#ffffff',
    accent: '#e1bee7',
    isGradient: false,
  },
  orange: {
    background: '#f57c00',
    text: '#ffffff',
    accent: '#ffe0b2',
    isGradient: false,
  },
  pink: {
    background: '#d81b60',
    text: '#ffffff',
    accent: '#f8bbd0',
    isGradient: false,
  },
  teal: {
    background: '#00897b',
    text: '#ffffff',
    accent: '#b2dfdb',
    isGradient: false,
  },
  brown: {
    background: '#795548',
    text: '#ffffff',
    accent: '#d7ccc8',
    isGradient: false,
  },
  cyan: {
    background: '#0097a7',
    text: '#ffffff',
    accent: '#b2ebf2',
    isGradient: false,
  },
  amber: {
    background: '#ffb300',
    text: '#333333',
    accent: '#333333',
    isGradient: false,
  },
  indigo: {
    background: '#3f51b5',
    text: '#ffffff',
    accent: '#c5cae9',
    isGradient: false,
  },
  lime: {
    background: '#afb42b',
    text: '#333333',
    accent: '#333333',
    isGradient: false,
  },
  // 添加渐变主题
  sunset: {
    background: 'linear-gradient(135deg, #f56565 0%, #ed64a6 100%)',
    text: '#ffffff',
    accent: '#ffffff',
    isGradient: true,
  },
  ocean: {
    background: 'linear-gradient(135deg, #4299e1 0%, #9f7aea 100%)',
    text: '#ffffff',
    accent: '#ffffff',
    isGradient: true,
  },
  forest: {
    background: 'linear-gradient(135deg, #48bb78 0%, #38b2ac 100%)',
    text: '#ffffff',
    accent: '#ffffff',
    isGradient: true,
  },
  passion: {
    background: 'linear-gradient(135deg, #f56565 0%, #d53f8c 100%)',
    text: '#ffffff',
    accent: '#ffffff',
    isGradient: true,
  },
  // 添加自定义主题
  custom: {
    background: '#000000',
    text: '#ffffff',
    accent: '#cccccc',
    isGradient: false,
  },
}; 