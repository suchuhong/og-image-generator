import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  onClear?: () => void;
}

export function FileUpload({ onUploadComplete, currentImage, onClear }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('不支持的文件类型。请上传 JPG, PNG, WebP 或 GIF 格式的图片');
      return;
    }
    
    // 限制文件大小 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('图片大小不能超过 5MB');
      return;
    }
    
    // 创建预览
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    setIsUploading(true);
    setError(null);
    
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
      
      // 回调返回url
      onUploadComplete(data.fileUrl);
      
    } catch (error) {
      console.error('上传错误:', error);
      setError(error instanceof Error ? error.message : '上传过程中发生错误');
      // 上传失败时清除预览
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      // 清空文件输入，允许重新上传相同的文件
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleClear = () => {
    setPreviewUrl(null);
    if (onClear) onClear();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="sr-only"
          id="image-upload"
        />
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex-1"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              上传中...
            </>
          ) : (
            <>
              <UploadCloud className="mr-2 h-4 w-4" />
              选择图片
            </>
          )}
        </Button>
        
        {previewUrl && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleClear}
            className="flex-none"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {error && <p className="text-sm text-destructive">{error}</p>}
      
      {previewUrl && (
        <div className="relative aspect-video w-full overflow-hidden rounded-md border">
          <Image
            src={previewUrl}
            alt="背景图片预览"
            fill
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
} 