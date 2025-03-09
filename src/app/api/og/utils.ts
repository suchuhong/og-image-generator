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
    // 对于以 / 开头的相对路径（如 /uploads/image.jpg），我们需要添加baseUrl
    // 但对于已经是完整URL的情况（以http://或https://开头）则直接使用
    let imageUrl = backgroundImage;
    
    // 检查是否为相对路径（以/开头但不是//开头）
    if (backgroundImage.startsWith('/') && !backgroundImage.startsWith('//')) {
      // 获取请求的origin
      const origin = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      
      // 构建完整URL
      imageUrl = `${origin}${backgroundImage}`;
    }
    
    console.log(`Fetching image from: ${imageUrl}`);
    
    // 获取图片
    const imageResponse = await fetch(imageUrl);
    if (imageResponse.ok) {
      const buffer = await imageResponse.arrayBuffer();
      const contentType = imageResponse.headers.get('content-type') || 'image/png';
      return `data:${contentType};base64,${Buffer.from(buffer).toString('base64')}`;
    } else {
      console.error(`Failed to fetch background image: ${imageUrl}, status: ${imageResponse.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching background image: ${error}`);
    return null;
  }
} 