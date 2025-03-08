'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

// 分类主题颜色
const COLOR_THEMES = {
  basic: [
    { id: 'light', name: '浅色', color: '#FFFFFF', textColor: '#333333', group: 'basic' },
    { id: 'dark', name: '深色', color: '#1a1a1a', textColor: '#FFFFFF', group: 'basic' },
  ],
  colors: [
    { id: 'blue', name: '蓝色', color: '#0070f3', textColor: '#FFFFFF', group: 'colors' },
    { id: 'green', name: '绿色', color: '#0f9d58', textColor: '#FFFFFF', group: 'colors' },
    { id: 'red', name: '红色', color: '#e53935', textColor: '#FFFFFF', group: 'colors' },
    { id: 'purple', name: '紫色', color: '#6a1b9a', textColor: '#FFFFFF', group: 'colors' },
    { id: 'orange', name: '橙色', color: '#f57c00', textColor: '#FFFFFF', group: 'colors' },
    { id: 'pink', name: '粉色', color: '#d81b60', textColor: '#FFFFFF', group: 'colors' },
  ],
  accent: [
    { id: 'teal', name: '青色', color: '#00897b', textColor: '#FFFFFF', group: 'accent' },
    { id: 'brown', name: '棕色', color: '#795548', textColor: '#FFFFFF', group: 'accent' },
    { id: 'cyan', name: '湖蓝', color: '#0097a7', textColor: '#FFFFFF', group: 'accent' },
    { id: 'amber', name: '琥珀', color: '#ffb300', textColor: '#333333', group: 'accent' },
    { id: 'indigo', name: '靛蓝', color: '#3f51b5', textColor: '#FFFFFF', group: 'accent' },
    { id: 'lime', name: '酸橙', color: '#afb42b', textColor: '#333333', group: 'accent' },
  ],
  gradient: [
    { id: 'sunset', name: '日落', color: 'linear-gradient(135deg, #f56565 0%, #ed64a6 100%)', textColor: '#FFFFFF', group: 'gradient' },
    { id: 'ocean', name: '海洋', color: 'linear-gradient(135deg, #4299e1 0%, #9f7aea 100%)', textColor: '#FFFFFF', group: 'gradient' },
    { id: 'forest', name: '森林', color: 'linear-gradient(135deg, #48bb78 0%, #38b2ac 100%)', textColor: '#FFFFFF', group: 'gradient' },
    { id: 'passion', name: '热情', color: 'linear-gradient(135deg, #f56565 0%, #d53f8c 100%)', textColor: '#FFFFFF', group: 'gradient' },
  ],
};

// 所有主题颜色，扁平化为一个数组
const ALL_THEMES = [
  ...COLOR_THEMES.basic,
  ...COLOR_THEMES.colors,
  ...COLOR_THEMES.accent,
  ...COLOR_THEMES.gradient,
];

// 支持的字体
const FONTS = [
  { id: 'sans', name: '无衬线', style: 'font-sans' },
  { id: 'serif', name: '衬线', style: 'font-serif' },
  { id: 'mono', name: '等宽', style: 'font-mono' },
  { id: 'cursive', name: '草书', style: '' },
  { id: 'fantasy', name: '装饰', style: '' },
];

// 背景图片显示模式
const BG_IMAGE_MODES = [
  { id: 'cover', name: '覆盖', description: '充满整个区域，可能会裁剪部分图片' },
  { id: 'contain', name: '包含', description: '完整显示图片，可能会有空白区域' },
  { id: 'repeat', name: '重复', description: '平铺重复显示图片' },
  { id: 'center', name: '居中', description: '居中显示图片原始尺寸' },
];

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [title, setTitle] = useState(searchParams.get('title') || 'Your Amazing Title');
  const [description, setDescription] = useState(searchParams.get('description') || 'This is a custom OG image generator for your content');
  const [theme, setTheme] = useState(searchParams.get('theme') || 'light');
  const [fontFamily, setFontFamily] = useState(searchParams.get('font') || 'sans');
  const [backgroundImage, setBackgroundImage] = useState(searchParams.get('backgroundImage') || '');
  const [imageMode, setImageMode] = useState(searchParams.get('imageMode') || 'cover');
  const [imageUrl, setImageUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [origin, setOrigin] = useState('');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const linkTextRef = useRef<HTMLInputElement>(null);
  
  // 颜色选择相关状态
  const [activeColorGroup, setActiveColorGroup] = useState<string>('basic');
  const [currentPickerTab, setCurrentPickerTab] = useState<'themes' | 'custom'>('themes');
  
  // 自定义颜色状态
  const [customColors, setCustomColors] = useState({
    bgColor: searchParams.get('bgColor') || '#000000',
    textColor: searchParams.get('textColor') || '#ffffff',
    accentColor: searchParams.get('accentColor') || '#cccccc',
  });

  // 找到当前主题
  const currentTheme = ALL_THEMES.find(t => t.id === theme) || 
                       { id: 'custom', name: '自定义', color: customColors.bgColor, textColor: customColors.textColor, group: 'custom' };

  // 当组件挂载时获取origin
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  // 当参数变化时，更新URL和预览图片
  useEffect(() => {
    const params = new URLSearchParams();
    if (title) params.set('title', title);
    if (description) params.set('description', description);
    if (theme) params.set('theme', theme);
    if (fontFamily) params.set('font', fontFamily);
    if (backgroundImage) {
      params.set('backgroundImage', backgroundImage);
      params.set('imageMode', imageMode);
    }
    
    // 如果是自定义主题，添加自定义颜色参数
    if (theme === 'custom') {
      params.set('bgColor', customColors.bgColor);
      params.set('textColor', customColors.textColor);
      params.set('accentColor', customColors.accentColor);
    }
    
    router.replace(`?${params.toString()}`);
    
    // 更新预览图片URL
    setImageUrl(`/api/og?${params.toString()}`);
  }, [title, description, theme, fontFamily, backgroundImage, imageMode, customColors, router]);

  // 生成用于复制的完整URL
  const generateFullUrl = (): string => {
    if (!origin) return '';
    
    // 确保外部URL使用完整的origin
    let fullBackgroundUrl = backgroundImage;
    if (backgroundImage && backgroundImage.startsWith('/')) {
      fullBackgroundUrl = `${origin}${backgroundImage}`;
    }

    let fullUrl = `${origin}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&theme=${theme}&font=${fontFamily}`;
    
    if (fullBackgroundUrl) {
      fullUrl += `&backgroundImage=${encodeURIComponent(fullBackgroundUrl)}&imageMode=${imageMode}`;
    }
    
    // 如果是自定义主题，添加自定义颜色参数
    if (theme === 'custom') {
      fullUrl += `&bgColor=${encodeURIComponent(customColors.bgColor)}`;
      fullUrl += `&textColor=${encodeURIComponent(customColors.textColor)}`;
      fullUrl += `&accentColor=${encodeURIComponent(customColors.accentColor)}`;
    }
    
    return fullUrl;
  };

  // 复制图片链接到剪贴板 - 修复版本
  const copyImageUrl = () => {
    setCopyError('');
    const fullUrl = generateFullUrl();
    
    if (!fullUrl) {
      setCopyError('无法生成URL，请稍后再试');
      return;
    }

    // 方法1: 使用navigator.clipboard API (现代浏览器)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullUrl)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('复制失败:', err);
          fallbackCopy(fullUrl);
        });
    } else {
      // 方法2: 回退方法 - 使用隐藏的文本框
      fallbackCopy(fullUrl);
    }
  };
  
  // 复制链接的备用方法
  const fallbackCopy = (text: string) => {
    try {
      // 创建临时文本输入框
      if (!linkTextRef.current) return;
      
      const linkTextElement = linkTextRef.current;
      linkTextElement.value = text;
      linkTextElement.select();
      document.execCommand('copy');
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('备用复制方法失败:', err);
      setCopyError('复制失败，请手动复制链接');
    }
  };

  // 下载图片
  const downloadImage = async () => {
    try {
      setLoading(true);
      const fullUrl = generateFullUrl();
      
      if (!fullUrl) {
        throw new Error('无法生成图片URL');
      }
      
      const response = await fetch(fullUrl);
      
      if (!response.ok) {
        throw new Error(`下载失败: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'og-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('下载失败', error);
      alert(`下载失败: ${error instanceof Error ? error.message : '未知错误'}`);
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
  
  // 选择主题时的处理
  const handleThemeSelect = (selectedTheme: string) => {
    setTheme(selectedTheme);
    
    // 如果选择了自定义主题，切换到自定义选项卡
    if (selectedTheme === 'custom') {
      setCurrentPickerTab('custom');
    }
  };
  
  // 处理自定义颜色变化
  const handleColorChange = (colorType: 'bgColor' | 'textColor' | 'accentColor', value: string) => {
    // 确保颜色值是有效的十六进制值
    const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(value);
    
    if (!isValidHex && value.length > 1) return;
    
    setCustomColors(prev => ({
      ...prev,
      [colorType]: value
    }));
    
    // 如果当前不是自定义主题，切换到自定义主题
    if (theme !== 'custom') {
      setTheme('custom');
    }
  };
  
  // 选择字体
  const handleFontSelect = (selectedFont: string) => {
    setFontFamily(selectedFont);
  };
  
  // 选择图片显示模式
  const handleImageModeSelect = (mode: string) => {
    setImageMode(mode);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 md:py-8 md:px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">OG 图像生成器</h1>
      
      {/* 三栏布局：左侧设置 - 中间预览 - 右侧设置 */}
      <div className="max-w-7xl mx-auto">
        {/* 大屏幕时显示三栏布局，小屏幕时堆叠 */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 左侧：标题、描述和字体设置 */}
          <div className="lg:w-1/4 bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-medium text-gray-800 border-b pb-2 mb-4">内容设置</h2>
            <div className="space-y-5">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  标题
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="输入描述"
                />
              </div>
              
              {/* 字体选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  字体
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FONTS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => handleFontSelect(f.id)}
                      className={`py-2 px-2 rounded-md border ${
                        fontFamily === f.id
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${f.style} text-sm`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* 中间：大型预览区域 */}
          <div className="lg:flex-1 bg-white p-4 rounded-xl shadow-md">
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
            
            <p className="mt-2 text-sm text-gray-500 text-center">
              预览图比例: 1200 x 630 (标准OG图像尺寸)
            </p>
            
            {/* 下载和复制按钮 */}
            <div className="flex gap-3 mt-4 max-w-md mx-auto">
              <button
                onClick={copyImageUrl}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-2 rounded-md transition flex items-center justify-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                </svg>
                <span className="text-sm">{copied ? '已复制!' : '复制链接'}</span>
              </button>
              <button
                onClick={downloadImage}
                disabled={loading}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-2 rounded-md transition flex items-center justify-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span className="text-sm">{loading ? '下载中...' : '下载图片'}</span>
              </button>
            </div>
            
            {copyError && (
              <p className="text-red-500 text-sm mt-2 text-center">{copyError}</p>
            )}
          </div>
          
          {/* 右侧：背景图片和主题颜色 */}
          <div className="lg:w-1/4 bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-medium text-gray-800 border-b pb-2 mb-4">样式设置</h2>
            <div className="space-y-5">
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
                    className={`flex-1 cursor-pointer py-2 px-3 border border-gray-300 rounded-md text-center text-sm ${
                      uploadLoading ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-50'
                    }`}
                  >
                    {uploadLoading ? '上传中...' : '选择图片'}
                  </label>
                  {backgroundImage && (
                    <button
                      onClick={clearBackgroundImage}
                      className="py-2 px-3 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                    >
                      清除
                    </button>
                  )}
                </div>
                {uploadError && (
                  <p className="text-red-500 text-sm mt-1">{uploadError}</p>
                )}
                {backgroundImage && (
                  <>
                    <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-md border border-gray-200">
                      <Image
                        src={backgroundImage}
                        alt="背景图片预览"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    
                    {/* 背景图片显示模式选择 */}
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        显示模式
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {BG_IMAGE_MODES.map((mode) => (
                          <button
                            key={mode.id}
                            onClick={() => handleImageModeSelect(mode.id)}
                            className={`py-1.5 px-2 rounded-md border text-xs ${
                              imageMode === mode.id
                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            title={mode.description}
                          >
                            {mode.name}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {BG_IMAGE_MODES.find(m => m.id === imageMode)?.description}
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              {/* 颜色主题选择 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    主题颜色
                  </label>
                  
                  {/* 当前选择的颜色预览 */}
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">{currentTheme.name}</span>
                    <div 
                      className="w-5 h-5 rounded-full border border-gray-300"
                      style={{
                        background: typeof currentTheme.color === 'string' ? currentTheme.color : customColors.bgColor
                      }}
                    />
                  </div>
                </div>
                
                {/* 主题/自定义切换选项卡 */}
                <div className="flex border-b border-gray-200 mb-3">
                  <button 
                    className={`px-3 py-1.5 text-sm font-medium ${currentPickerTab === 'themes' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setCurrentPickerTab('themes')}
                  >
                    预设主题
                  </button>
                  <button 
                    className={`px-3 py-1.5 text-sm font-medium ${currentPickerTab === 'custom' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => {
                      setCurrentPickerTab('custom');
                      if (theme !== 'custom') {
                        setTheme('custom');
                      }
                    }}
                  >
                    自定义颜色
                  </button>
                </div>
                
                {currentPickerTab === 'themes' ? (
                  <>
                    {/* 颜色组选择器 */}
                    <div className="flex flex-wrap space-x-1 mb-3 pb-1">
                      <button 
                        className={`mb-1 px-2 py-1 text-xs rounded-full ${activeColorGroup === 'basic' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                        onClick={() => setActiveColorGroup('basic')}
                      >
                        基础
                      </button>
                      <button 
                        className={`mb-1 px-2 py-1 text-xs rounded-full ${activeColorGroup === 'colors' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                        onClick={() => setActiveColorGroup('colors')}
                      >
                        彩色
                      </button>
                      <button 
                        className={`mb-1 px-2 py-1 text-xs rounded-full ${activeColorGroup === 'accent' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                        onClick={() => setActiveColorGroup('accent')}
                      >
                        强调色
                      </button>
                      <button 
                        className={`mb-1 px-2 py-1 text-xs rounded-full ${activeColorGroup === 'gradient' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                        onClick={() => setActiveColorGroup('gradient')}
                      >
                        渐变
                      </button>
                    </div>
                    
                    {/* 颜色列表 */}
                    <div className="grid grid-cols-3 gap-1.5">
                      {COLOR_THEMES[activeColorGroup as keyof typeof COLOR_THEMES].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => handleThemeSelect(t.id)}
                          className={`relative overflow-hidden w-full aspect-square rounded-md transition-all ${
                            theme === t.id
                              ? 'ring-2 ring-blue-500 ring-offset-1'
                              : 'hover:ring-1 hover:ring-gray-300'
                          }`}
                          style={{
                            background: t.color
                          }}
                          title={t.name}
                        >
                          {theme === t.id && (
                            <span className="absolute bottom-1 right-1 bg-white/70 rounded-full w-4 h-4 flex items-center justify-center text-blue-600">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            </span>
                          )}
                          <span className="sr-only">{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">背景颜色</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={customColors.bgColor}
                            onChange={(e) => handleColorChange('bgColor', e.target.value)}
                            className="w-7 h-7 rounded overflow-hidden cursor-pointer"
                          />
                          <input
                            type="text"
                            value={customColors.bgColor}
                            onChange={(e) => handleColorChange('bgColor', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">文字颜色</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={customColors.textColor}
                            onChange={(e) => handleColorChange('textColor', e.target.value)}
                            className="w-7 h-7 rounded overflow-hidden cursor-pointer"
                          />
                          <input
                            type="text"
                            value={customColors.textColor}
                            onChange={(e) => handleColorChange('textColor', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                            placeholder="#FFFFFF"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">边框颜色</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={customColors.accentColor}
                            onChange={(e) => handleColorChange('accentColor', e.target.value)}
                            className="w-7 h-7 rounded overflow-hidden cursor-pointer"
                          />
                          <input
                            type="text"
                            value={customColors.accentColor}
                            onChange={(e) => handleColorChange('accentColor', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                            placeholder="#CCCCCC"
                          />
                        </div>
                      </div>
                      
                      {/* 颜色预览 */}
                      <div className="mt-2 p-2 rounded-md" style={{ background: customColors.bgColor }}>
                        <div className="p-1.5 border-2 rounded" style={{ borderColor: customColors.accentColor }}>
                          <div className="text-center" style={{ color: customColors.textColor }}>
                            <span className="font-bold text-xs">文字预览</span>
                            <p className="text-[10px] opacity-80">实时预览配色</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-3">如何使用</h2>
        <p className="text-gray-600 mb-3 text-sm">
          生成的OG图片链接可以在任何支持Open Graph协议的平台上使用，例如社交媒体、博客等。只需将链接添加到您网站的头部meta标签中：
        </p>
        <div className="bg-gray-800 text-white p-3 rounded-md text-left overflow-x-auto text-sm">
          {origin && (
            <pre className="break-all whitespace-pre-wrap">{`<meta property="og:image" content="${generateFullUrl()}" />`}</pre>
          )}
        </div>
      </div>
      
      {/* 隐藏的输入框用于备用复制方法 */}
      <input 
        type="text" 
        ref={linkTextRef}
        className="sr-only opacity-0 h-0"
        aria-hidden="true"
        readOnly
      />
    </div>
  );
}
