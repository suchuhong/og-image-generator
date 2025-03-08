import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// 定义支持的字体
const fonts = {
  sans: 'sans-serif',
  serif: 'serif',
  mono: 'monospace',
  cursive: 'cursive',
  fantasy: 'fantasy',
};

// 定义主题颜色，包括渐变主题
const themes = {
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 从查询参数获取自定义数据
    const title = searchParams.get('title') || 'Default Title';
    const description = searchParams.get('description') || 'Default description for your content';
    const theme = searchParams.get('theme') || 'light';
    const backgroundImage = searchParams.get('backgroundImage') || '';
    const fontFamily = searchParams.get('font') || 'sans';
    const imageMode = searchParams.get('imageMode') || 'cover';
    
    // 获取自定义颜色参数
    const customBgColor = searchParams.get('bgColor') || '';
    const customTextColor = searchParams.get('textColor') || '';
    const customAccentColor = searchParams.get('accentColor') || '';
    
    // 使用所选主题或默认为light主题
    const selectedTheme = themes[theme as keyof typeof themes] || themes.light;
    
    // 如果提供了自定义颜色，覆盖主题颜色
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

    // 获取字体
    const selectedFont = fonts[fontFamily as keyof typeof fonts] || fonts.sans;

    // 处理背景图片
    let bgImageData = null;
    if (backgroundImage) {
      try {
        const imageResponse = await fetch(backgroundImage);
        if (imageResponse.ok) {
          const buffer = await imageResponse.arrayBuffer();
          bgImageData = `data:${imageResponse.headers.get('content-type') || 'image/png'};base64,${Buffer.from(buffer).toString('base64')}`;
        } else {
          console.error(`Failed to fetch background image: ${backgroundImage}`);
        }
      } catch (error) {
        console.error(`Error fetching background image: ${error}`);
      }
    }

    // 创建基础样式
    const containerStyle: React.CSSProperties = {
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
        ...(imageMode === 'center' && {
          backgroundImage: `url(${bgImageData})`,
          backgroundSize: 'auto',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }),
      } : selectedTheme.isGradient ? {
        backgroundImage: selectedTheme.background,
      } : {
        backgroundColor: selectedTheme.background,
      }),
    };

    // 如果背景是图片，添加一个半透明覆盖层
    const needsOverlay = bgImageData && (imageMode === 'cover' || imageMode === 'contain' || imageMode === 'repeat' || imageMode === 'center');

    const overlayStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1, // 数字
    };

    const contentStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: `2px solid ${selectedTheme.accent}`,
      borderRadius: '12px',
      padding: '20px 40px',
      width: '90%',
      height: '80%',
      background: bgImageData ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
      position: 'relative',
      zIndex: 2, // 数字
      fontFamily: selectedFont,
    };

    const titleStyle: React.CSSProperties= {
      fontSize: '60px',
      fontWeight: 'bold',
      color: bgImageData ? '#ffffff' : selectedTheme.text,
      textAlign: 'center',
      marginBottom: '20px',
      textShadow: bgImageData ? '0 2px 4px rgba(0,0,0,0.7)' : 'none',
      fontFamily: selectedFont,
    };

    const descriptionStyle: React.CSSProperties = {
      fontSize: '30px',
      color: bgImageData ? '#ffffff' : selectedTheme.text,
      textAlign: 'center',
      opacity: 0.8,
      textShadow: bgImageData ? '0 2px 4px rgba(0,0,0,0.7)' : 'none',
      fontFamily: selectedFont,
    };

    // 返回图像响应
    return new ImageResponse(
      (
        <div style={containerStyle}>
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