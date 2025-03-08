# OG 图像生成器

这是一个基于 Next.js 构建的 Open Graph (OG) 图像生成器，可以帮助你为网站或应用创建自定义的社交媒体分享卡片。

![OG 图像生成器预览](./images/image.png)

## 功能特点

- 🎨 自定义图像标题和描述
- 🖼️ 支持上传自定义背景图片
- 🌈 提供14种多样化主题颜色选择
- 🎭 支持通过调色盘自定义选取颜色
- 🔤 提供多种字体样式选择
- 📐 背景图片多种显示模式(覆盖、包含、重复、居中)
- 📱 响应式设计，适配各种设备
- 🔗 便捷的链接复制功能
- 💾 一键下载生成的图像
- ⚡ 基于Edge Runtime的高性能图像生成

## 技术栈

- [Next.js 14](https://nextjs.org/) - React框架
- [Tailwind CSS](https://tailwindcss.com/) - 样式
- [@vercel/og](https://vercel.com/docs/functions/og-image-generation) - OG图像生成
- [Satori](https://github.com/vercel/satori) - HTML/CSS 到 SVG 转换
- [Sharp](https://sharp.pixelplumbing.com/) - 高性能图像处理

## 开始使用

### 安装依赖

```bash
npm install
# 或
yarn
# 或
pnpm install
```

### 开发环境运行

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 使用方法

1. 在首页上自定义你的标题和描述
2. 选择喜欢的字体样式（无衬线、衬线、等宽等）
3. 上传自定义背景图片（可选）
4. 选择背景图片的显示模式（覆盖、包含、重复、居中）
5. 从预设主题中选择一个颜色，或使用自定义选项通过调色盘选择特定颜色
6. 预览生成的OG图像
7. 复制图像链接或下载图像
8. 将链接添加到你的网站的`<head>`标签中：

```html
<meta property="og:image" content="https://your-domain.com/api/og?title=Your%20Title&description=Your%20Description&theme=light&font=sans&backgroundImage=https://your-domain.com/uploads/your-image.jpg&imageMode=cover" />
```

### 背景图片显示模式

当上传背景图片后，你可以选择以下显示模式：

- **覆盖 (cover)** - 图片将缩放以填满整个区域，保持其宽高比。图片可能会被裁剪。
- **包含 (contain)** - 图片将完整显示在区域内，可能会有空白区域。
- **重复 (repeat)** - 图片将以原始大小平铺重复，填满整个区域。
- **居中 (center)** - 图片将以原始大小居中显示，不缩放。

这些选项可以帮助你适应不同尺寸和比例的背景图片，确保OG图像看起来美观专业。

### 自定义字体

提供以下五种字体风格选择：

- 无衬线 (Sans-serif) - 现代简洁风格，适合大多数内容
- 衬线 (Serif) - 传统优雅风格，适合正式内容
- 等宽 (Monospace) - 技术风格，适合代码或技术内容
- 草书 (Cursive) - 手写风格，适合艺术或创意内容
- 装饰 (Fantasy) - 独特装饰风格，适合特殊场合

### 自定义颜色

如果预设的主题不满足你的需求，可以选择"自定义"主题，然后使用调色盘精确选择：

- 背景颜色 - 设置整个OG图像的背景色
- 文字颜色 - 设置标题和描述文本的颜色
- 边框颜色 - 设置内容区域边框的颜色

每种颜色都可以通过颜色选择器直观地选择，或手动输入十六进制颜色代码。

## API 参考

OG图像生成API接受以下查询参数：

- `title` - 图像标题文本
- `description` - 图像描述文本
- `theme` - 主题选择，可选值: 
  - 基础: `light`, `dark`, `blue`, `green`
  - 扩展: `red`, `purple`, `orange`, `pink`, `teal`, `brown`, `cyan`, `amber`, `indigo`, `lime`
  - 渐变: `sunset`, `ocean`, `forest`, `passion`
  - 自定义: `custom` (与bgColor、textColor、accentColor一起使用)
- `font` - 字体选择，可选值: `sans`, `serif`, `mono`, `cursive`, `fantasy`
- `backgroundImage` - 背景图片URL（可选）
- `imageMode` - 背景图片显示模式，可选值: `cover`, `contain`, `repeat`, `center`
- `bgColor` - 自定义背景颜色（仅当theme=custom时使用）
- `textColor` - 自定义文字颜色（仅当theme=custom时使用）
- `accentColor` - 自定义边框颜色（仅当theme=custom时使用）

示例:
```
/api/og?title=Hello%20World&description=This%20is%20my%20awesome%20content&theme=custom&font=serif&bgColor=%23FF5733&textColor=%23FFFFFF&accentColor=%23FFD700&backgroundImage=https://example.com/my-image.jpg&imageMode=contain
```

## 自定义背景图片

应用允许上传JPG、PNG、WebP或GIF格式的图片，大小限制为5MB。上传的图片将被用作OG图像的背景，文本将自动调整为白色并添加阴影以确保在图片上可读。

## 自定义

如需自定义OG图像的生成逻辑，可以编辑 `src/app/api/og/route.tsx` 文件。

## 部署

该项目可以轻松部署到Vercel平台：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fog-image-generator)

## 许可证

MIT
