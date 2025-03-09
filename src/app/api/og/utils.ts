import { Theme } from './types';
import { themes } from './constants';

// 处理自定义颜色
export function getCustomizedTheme(
  theme: string,
  customBgColor: string,
  customTextColor: string,
  customAccentColor: string
): Theme {
  const selectedTheme = theme in themes 
    ? { ...themes[theme as keyof typeof themes] }
    : { ...themes.light };
  
  if (theme === 'custom') {
    if (customBgColor && /^#[0-9A-Fa-f]{6}$/.test(customBgColor)) {
      selectedTheme.background = customBgColor;
    }
    
    if (customTextColor && /^#[0-9A-Fa-f]{6}$/.test(customTextColor)) {
      selectedTheme.text = customTextColor;
    }
    
    if (customAccentColor && /^#[0-9A-Fa-f]{6}$/.test(customAccentColor)) {
      selectedTheme.accent = customAccentColor;
    }
  }
  
  return selectedTheme;
}

// 处理背景图片
export async function fetchBackgroundImage(backgroundImage: string): Promise<string | null> {
  if (!backgroundImage) return null;
  
  try {
    const imageResponse = await fetch(backgroundImage);
    if (imageResponse.ok) {
      const buffer = await imageResponse.arrayBuffer();
      return `data:${imageResponse.headers.get('content-type') || 'image/png'};base64,${Buffer.from(buffer).toString('base64')}`;
    } else {
      console.error(`Failed to fetch background image: ${backgroundImage}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching background image: ${error}`);
    return null;
  }
} 