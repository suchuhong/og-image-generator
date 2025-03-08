import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { CSSProperties } from 'react';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 从查询参数获取自定义数据
    const title = searchParams.get('title') || 'Default Title';
    const description = searchParams.get('description') || 'Default description for your content';
    const theme = searchParams.get('theme') || 'light';
    const backgroundImage = searchParams.get('backgroundImage') || '';
    
    // 定义主题颜色
    const themes = {
      light: {
        background: 'white',
        text: '#333333',
        accent: '#0070f3',
      },
      dark: {
        background: '#1a1a1a',
        text: '#ffffff',
        accent: '#3291ff',
      },
      blue: {
        background: '#0070f3',
        text: '#ffffff',
        accent: '#ffffff',
      },
      green: {
        background: '#0f9d58',
        text: '#ffffff',
        accent: '#ffffff',
      },
    };
    
    // 使用所选主题或默认为light主题
    const selectedTheme = themes[theme as keyof typeof themes] || themes.light;

    // 根据是否有背景图片来构建不同的组件
    let containerStyles: CSSProperties = {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: selectedTheme.background,
      padding: '40px',
      fontFamily: 'sans-serif',
    };

    // 如果有背景图片，尝试加载图片
    let bgImageData: string | undefined = undefined;
    if (backgroundImage) {
      try {
        // 尝试获取背景图片
        const imageResponse = await fetch(backgroundImage);
        if (imageResponse.ok) {
          const buffer = await imageResponse.arrayBuffer();
          bgImageData = `data:${imageResponse.headers.get('content-type') || 'image/png'};base64,${Buffer.from(buffer).toString('base64')}`;
          
          // 添加背景图片样式
          containerStyles = {
            ...containerStyles,
            backgroundImage: `url(${bgImageData})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          };
        } else {
          console.error(`Failed to fetch background image: ${backgroundImage}`);
        }
      } catch (error) {
        console.error(`Error fetching background image: ${error}`);
      }
    }

    return new ImageResponse(
      (
        <div style={containerStyles}>
          {/* 如果有背景图片，添加半透明层 */}
          {bgImageData && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明黑色覆盖层
                zIndex: 1,
              }}
            />
          )}
          <div
            style={{
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
              zIndex: 2,
            }}
          >
            <h1
              style={{
                fontSize: '60px',
                fontWeight: 'bold',
                color: bgImageData ? '#ffffff' : selectedTheme.text,
                textAlign: 'center',
                marginBottom: '20px',
                textShadow: bgImageData ? '0 2px 4px rgba(0,0,0,0.7)' : 'none',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '30px',
                color: bgImageData ? '#ffffff' : selectedTheme.text,
                textAlign: 'center',
                opacity: 0.8,
                textShadow: bgImageData ? '0 2px 4px rgba(0,0,0,0.7)' : 'none',
              }}
            >
              {description}
            </p>
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