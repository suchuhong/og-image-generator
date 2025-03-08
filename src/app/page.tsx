'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [title, setTitle] = useState(searchParams.get('title') || 'Your Amazing Title');
  const [description, setDescription] = useState(searchParams.get('description') || 'This is a custom OG image generator for your content');
  const [theme, setTheme] = useState(searchParams.get('theme') || 'light');
  const [backgroundImage, setBackgroundImage] = useState(searchParams.get('backgroundImage') || '');
  const [imageUrl, setImageUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [origin, setOrigin] = useState('');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 支持的主题
  const themes = [
    { id: 'light', name: '浅色' },
    { id: 'dark', name: '深色' },
    { id: 'blue', name: '蓝色' },
    { id: 'green', name: '绿色' },
  ];

  // 当组件挂载时获取origin
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // 当参数变化时，更新URL和预览图片
  useEffect(() => {
    const params = new URLSearchParams();
    if (title) params.set('title', title);
    if (description) params.set('description', description);
    if (theme) params.set('theme', theme);
    if (backgroundImage) params.set('backgroundImage', backgroundImage);
    
    router.replace(`?${params.toString()}`);
    
    // 更新预览图片URL
    setImageUrl(`/api/og?${params.toString()}`);
  }, [title, description, theme, backgroundImage, router]);

  // 复制图片链接到剪贴板
  const copyImageUrl = () => {
    // 确保外部URL使用完整的origin
    let fullBackgroundUrl = backgroundImage;
    if (backgroundImage && backgroundImage.startsWith('/')) {
      fullBackgroundUrl = `${origin}${backgroundImage}`;
    }

    const fullUrl = `${origin}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&theme=${theme}${fullBackgroundUrl ? `&backgroundImage=${encodeURIComponent(fullBackgroundUrl)}` : ''}`;
    
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // 下载图片
  const downloadImage = async () => {
    try {
      setLoading(true);
      // 确保外部URL使用完整的origin
      let fullBackgroundUrl = backgroundImage;
      if (backgroundImage && backgroundImage.startsWith('/')) {
        fullBackgroundUrl = `${origin}${backgroundImage}`;
      }

      const imageUrl = `${origin}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&theme=${theme}${fullBackgroundUrl ? `&backgroundImage=${encodeURIComponent(fullBackgroundUrl)}` : ''}`;
      
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'og-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('下载失败', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理图片上传
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadError('不支持的文件类型。请上传 JPG, PNG, WebP 或 GIF 格式的图片');
      return;
    }

    // 限制文件大小 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('图片大小不能超过 5MB');
      return;
    }

    setUploadLoading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '上传失败');
      }

      const data = await response.json();
      // 只存储路径，不包括origin，因为在Image组件中会自动添加
      setBackgroundImage(data.fileUrl);
    } catch (error) {
      console.error('上传出错:', error);
      setUploadError(error instanceof Error ? error.message : '上传过程中发生错误');
    } finally {
      setUploadLoading(false);
      // 清空文件输入，允许重新上传相同的文件
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 清除背景图片
  const clearBackgroundImage = () => {
    setBackgroundImage('');
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-center">OG 图像生成器</h1>
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
        {/* 左侧控制面板 */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow-md">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                标题
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入标题"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                描述
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="输入描述"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                背景图片
              </label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  className="sr-only"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`flex-1 cursor-pointer py-2 px-4 border border-gray-300 rounded-md text-center ${
                    uploadLoading ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-50'
                  }`}
                >
                  {uploadLoading ? '上传中...' : '选择图片'}
                </label>
                {backgroundImage && (
                  <button
                    onClick={clearBackgroundImage}
                    className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md"
                  >
                    清除
                  </button>
                )}
              </div>
              {uploadError && (
                <p className="text-red-500 text-sm mt-1">{uploadError}</p>
              )}
              {backgroundImage && (
                <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-md border border-gray-200">
                  <Image
                    src={backgroundImage}
                    alt="背景图片预览"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                主题
              </label>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`py-2 px-4 rounded-md ${
                      theme === t.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={copyImageUrl}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition"
              >
                {copied ? '已复制!' : '复制链接'}
              </button>
              <button
                onClick={downloadImage}
                disabled={loading}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition"
              >
                {loading ? '下载中...' : '下载图片'}
              </button>
            </div>
          </div>
        </div>
        
        {/* 右侧预览 */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">预览</h2>
          <div className="relative aspect-[1200/630] w-full bg-gray-100 rounded-md overflow-hidden">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt="OG预览"
                fill
                priority
                className="object-cover"
                unoptimized
              />
            )}
          </div>
          <p className="mt-4 text-sm text-gray-500">
            预览图比例: 1200 x 630 (标准OG图像尺寸)
          </p>
        </div>
      </div>
      
      <div className="mt-16 text-center max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">如何使用</h2>
        <p className="text-gray-600 mb-4">
          生成的OG图片链接可以在任何支持Open Graph协议的平台上使用，例如社交媒体、博客等。只需将链接添加到您网站的头部meta标签中：
        </p>
        <div className="bg-gray-800 text-white p-4 rounded-md text-left overflow-x-auto">
          {origin && (
            <pre>{`<meta property="og:image" content="${origin}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&theme=${theme}${backgroundImage ? `&backgroundImage=${encodeURIComponent(`${origin}${backgroundImage}`)}` : ''}" />`}</pre>
          )}
        </div>
      </div>
    </main>
  );
}
