import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { CSSProperties } from 'react';
import { fonts } from './constants';
import { 
  getCustomizedTheme,
  fetchBackgroundImage
} from './utils';
import {
  generateContainerStyle,
  generateOverlayStyle,
  generateCenterImageStyle,
  generateCenterModeBackground,
  generateContentStyle,
  generateTitleStyle,
  generateDescriptionStyle
} from './styles';
import { ImageMode } from './types';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 从查询参数获取自定义数据
    const title = searchParams.get('title') || 'Default Title';
    const description = searchParams.get('description') || 'Default description for your content';
    const theme = searchParams.get('theme') || 'light';
    const backgroundImage = searchParams.get('backgroundImage') || '';
    const fontFamily = searchParams.get('font') || 'sans';
    const imageMode = searchParams.get('imageMode') as ImageMode || 'cover';
    
    // 获取自定义颜色参数
    const customBgColor = searchParams.get('bgColor') || '';
    const customTextColor = searchParams.get('textColor') || '';
    const customAccentColor = searchParams.get('accentColor') || '';
    
    // 获取主题和字体
    const selectedTheme = getCustomizedTheme(theme, customBgColor, customTextColor, customAccentColor);
    const selectedFont = fonts[fontFamily as keyof typeof fonts] || fonts.sans;

    // 处理背景图片
    const bgImageData = await fetchBackgroundImage(backgroundImage);

    // 判断是否使用居中模式
    const isCenterMode = Boolean(bgImageData && imageMode === 'center');
    
    // 准备样式
    const containerStyle = generateContainerStyle({
      selectedTheme,
      bgImageData,
      imageMode,
      selectedFont
    });
    
    const needsOverlay = Boolean(bgImageData && imageMode !== 'center');
    const overlayStyle = generateOverlayStyle();
    const centerImageStyle = generateCenterImageStyle();
    const centerModeBackground = generateCenterModeBackground(selectedTheme);
    
    const contentStyle = generateContentStyle({
      selectedTheme,
      bgImageData,
      selectedFont,
      isCenterMode
    });
    
    const titleStyle = generateTitleStyle({
      selectedTheme,
      bgImageData,
      selectedFont
    });
    
    const descriptionStyle = generateDescriptionStyle({
      selectedTheme,
      bgImageData,
      selectedFont
    });

    // 复合样式对象 - 用于最终渲染
    const finalContainerStyle: CSSProperties = {
      ...containerStyle,
      ...(isCenterMode ? centerModeBackground : {})
    };

    // 返回图像响应
    return new ImageResponse(
      (
        <div style={finalContainerStyle}>
          {/* 如果是center模式，且有背景图，使用普通img标签 */}
          {isCenterMode && bgImageData ? (
            <img 
              src={bgImageData}
              alt=""
              style={centerImageStyle}
            />
          ) : null}
          
          {needsOverlay && <div style={overlayStyle} />}
          
          <div style={contentStyle}>
            <h1 style={titleStyle}>{title}</h1>
            <p style={descriptionStyle}>{description}</p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    console.error(`Error generating OG image: ${e instanceof Error ? e.message : String(e)}`);
    return new Response(`Failed to generate OG image: ${e instanceof Error ? e.message : String(e)}`, {
      status: 500,
    });
  }
} 