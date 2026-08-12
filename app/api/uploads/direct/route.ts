import { NextResponse } from 'next/server';
import { saveUploadedAsset } from '@/lib/uploadsStore';

// directUploadMaxSizeBytes 是未接 R2 前的临时直传限制，避免 data URI 过大。
const directUploadMaxSizeBytes = 1024 * 1024;

// supportedTypes 是服务端允许临时直传的图片格式白名单。
const supportedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

// POST 接收本地开发直传图片，并保存为 data URI；生产环境应替换为 R2 上传。
export async function POST(request: Request) {
  const formData = await request.formData();
  const objectKey = String(formData.get('objectKey') ?? '');
  const file = formData.get('file');

  if (!objectKey.startsWith('uploads/original/')) {
    return NextResponse.json({ errorCode: 'INVALID_OBJECT_KEY' }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ errorCode: 'FILE_REQUIRED' }, { status: 400 });
  }

  if (!supportedTypes.has(file.type)) {
    return NextResponse.json({ errorCode: 'UNSUPPORTED_FORMAT' }, { status: 400 });
  }

  if (file.size > directUploadMaxSizeBytes) {
    return NextResponse.json({ errorCode: 'FILE_TOO_LARGE' }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const dataUrl = `data:${file.type};base64,${bytes.toString('base64')}`;

  saveUploadedAsset({
    objectKey,
    dataUrl,
    contentType: file.type,
    sizeBytes: file.size,
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({ objectKey, ok: true });
}
