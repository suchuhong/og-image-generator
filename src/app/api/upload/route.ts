import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { mkdir } from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: '未找到文件' },
        { status: 400 }
      );
    }

    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '不支持的文件类型。请上传 JPG, PNG, WebP 或 GIF 格式的图片' },
        { status: 400 }
      );
    }

    // 限制文件大小 (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '文件大小不能超过 5MB' },
        { status: 400 }
      );
    }

    // 获取文件扩展名
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    
    // 生成唯一文件名
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // 创建上传目录
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.error('创建目录失败:', error);
    }
    
    // 文件保存路径
    const filePath = path.join(uploadDir, fileName);
    
    // 转换文件为 Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // 写入文件
    await writeFile(filePath, buffer);
    
    // 返回文件URL路径
    const fileUrl = `/uploads/${fileName}`;
    
    return NextResponse.json({
      success: true,
      fileUrl
    });
    
  } catch (error) {
    console.error('上传处理错误:', error);
    return NextResponse.json(
      { error: '文件上传失败' },
      { status: 500 }
    );
  }
} 