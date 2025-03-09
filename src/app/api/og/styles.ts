import { CSSProperties } from 'react';
import { Theme, ImageMode } from './types';

interface StyleOptions {
  selectedTheme: Theme;
  bgImageData: string | null;
  imageMode: ImageMode;
  selectedFont: string;
  isCenterMode: boolean;
}

// 生成容器样式
export function generateContainerStyle({
  selectedTheme,
  bgImageData,
  imageMode,
  selectedFont
}: Omit<StyleOptions, 'isCenterMode'>): CSSProperties {
  return {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    fontFamily: selectedFont,
    position: 'relative',
    ...(bgImageData ? {
      ...(imageMode === 'cover' && {
        backgroundImage: `url(${bgImageData})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }),
      ...(imageMode === 'contain' && {
        backgroundImage: `url(${bgImageData})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }),
      ...(imageMode === 'repeat' && {
        backgroundImage: `url(${bgImageData})`,
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
      }),
      // center模式不在这里处理背景图片，而是使用单独的元素
    } : selectedTheme.isGradient ? {
      backgroundImage: selectedTheme.background,
    } : {
      backgroundColor: selectedTheme.background,
    }),
  };
}

// 生成覆盖层样式
export function generateOverlayStyle(): CSSProperties {
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  };
}

// 生成居中图片样式
export function generateCenterImageStyle(): CSSProperties {
  return {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '90%',
    maxHeight: '90%',
    zIndex: 0,
  };
}

// 生成居中模式背景样式
export function generateCenterModeBackground(selectedTheme: Theme): CSSProperties {
  return selectedTheme.isGradient 
    ? { backgroundImage: selectedTheme.background } 
    : { backgroundColor: selectedTheme.background };
}

// 生成内容区域样式
export function generateContentStyle({
  selectedTheme,
  bgImageData,
  selectedFont,
  isCenterMode
}: Omit<StyleOptions, 'imageMode'>): CSSProperties {
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: `2px solid ${selectedTheme.accent}`,
    borderRadius: '12px',
    padding: '20px 40px',
    width: '90%',
    height: '80%',
    background: isCenterMode ? 'rgba(0, 0, 0, 0.5)' : bgImageData ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
    position: 'relative',
    zIndex: 2,
    fontFamily: selectedFont,
  };
}

// 生成标题样式
export function generateTitleStyle({
  selectedTheme,
  bgImageData,
  selectedFont
}: Omit<StyleOptions, 'imageMode' | 'isCenterMode'>): CSSProperties {
  return {
    fontSize: '60px',
    fontWeight: 'bold',
    color: bgImageData ? '#ffffff' : selectedTheme.text,
    textAlign: 'center',
    marginBottom: '20px',
    textShadow: bgImageData ? '0 2px 4px rgba(0,0,0,0.7)' : 'none',
    fontFamily: selectedFont,
  };
}

// 生成描述样式
export function generateDescriptionStyle({
  selectedTheme,
  bgImageData,
  selectedFont
}: Omit<StyleOptions, 'imageMode' | 'isCenterMode'>): CSSProperties {
  return {
    fontSize: '30px',
    color: bgImageData ? '#ffffff' : selectedTheme.text,
    textAlign: 'center',
    opacity: 0.8,
    textShadow: bgImageData ? '0 2px 4px rgba(0,0,0,0.7)' : 'none',
    fontFamily: selectedFont,
  };
} 