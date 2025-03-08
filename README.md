# OG 图像生成器

这是一个基于 Next.js 构建的 Open Graph (OG) 图像生成器，可以帮助你为网站或应用创建自定义的社交媒体分享卡片。

![OG 图像生成器预览](https://i.imgur.com/example.png)

## 功能特点

- 🎨 自定义图像标题和描述
- 🖼️ 支持上传自定义背景图片
- 🌈 多种主题色彩选择
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
2. 上传自定义背景图片（可选）
3. 选择一个你喜欢的主题颜色
4. 预览生成的OG图像
5. 复制图像链接或下载图像
6. 将链接添加到你的网站的`<head>`标签中：

```html
<meta property="og:image" content="https://your-domain.com/api/og?title=Your%20Title&description=Your%20Description&theme=light&backgroundImage=https://your-domain.com/uploads/your-image.jpg" />
```

## API 参考

OG图像生成API接受以下查询参数：

- `title` - 图像标题文本
- `description` - 图像描述文本
- `theme` - 主题选择 (`light`, `dark`, `blue`, `green`)
- `backgroundImage` - 背景图片URL（可选）

示例:
```
/api/og?title=Hello%20World&description=This%20is%20my%20awesome%20content&theme=dark&backgroundImage=https://example.com/my-image.jpg
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
