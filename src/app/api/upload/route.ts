import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: '没有上传图片' },
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
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '图片大小不能超过 5MB' },
        { status: 400 }
      );
    }

    // 生成唯一文件名
    const fileExtension = file.name.split('.').pop();
    const uniqueId = crypto.randomBytes(16).toString('hex');
    const fileName = `${uniqueId}.${fileExtension}`;
    
    // 创建uploads目录路径
    const publicDir = join(process.cwd(), 'public');
    const uploadsDir = join(publicDir, 'uploads');
    
    try {
      // 确保目录存在
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
        console.log('Created uploads directory');
      }
      
      // 写入文件
      await writeFile(join(uploadsDir, fileName), Buffer.from(await file.arrayBuffer()));
    } catch (error) {
      console.error('文件保存失败:', error);
      return NextResponse.json(
        { error: '文件上传失败，无法保存文件' },
        { status: 500 }
      );
    }

    // 文件的网址路径
    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({ fileUrl });
  } catch (error) {
    console.error('上传出错:', error);
    return NextResponse.json(
      { error: '上传过程中发生错误' },
      { status: 500 }
    );
  }
} 