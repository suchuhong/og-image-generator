import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 从查询参数获取自定义数据
    const title = searchParams.get('title') || 'Default Title';
    const description = searchParams.get('description') || 'Default description for your content';
    const theme = searchParams.get('theme') || 'light';
    
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

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: selectedTheme.background,
            padding: '40px',
            fontFamily: 'sans-serif',
          }}
        >
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
            }}
          >
            <h1
              style={{
                fontSize: '60px',
                fontWeight: 'bold',
                color: selectedTheme.text,
                textAlign: 'center',
                marginBottom: '20px',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '30px',
                color: selectedTheme.text,
                textAlign: 'center',
                opacity: 0.8,
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