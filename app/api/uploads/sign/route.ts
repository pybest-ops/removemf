import { NextResponse } from 'next/server';
import { createR2UploadUrl } from '@/lib/r2';

// maxSizeBytes 是上传接口的服务端图片大小限制。
const maxSizeBytes = 10 * 1024 * 1024;

// supportedTypes 是服务端允许进入图片恢复链路的格式白名单。
const supportedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

// POST 生成上传凭证；已配置 R2 时返回 R2 签名上传地址，否则走本地 mock 直传。
export async function POST(request: Request) {
  const body = await request.json();
  const contentType = String(body.contentType ?? '');
  const sizeBytes = Number(body.sizeBytes ?? 0);

  if (!supportedTypes.has(contentType)) {
    return NextResponse.json({ errorCode: 'UNSUPPORTED_FORMAT' }, { status: 400 });
  }

  if (!sizeBytes || sizeBytes > maxSizeBytes) {
    return NextResponse.json({ errorCode: 'FILE_TOO_LARGE' }, { status: 400 });
  }

  const extension = contentType.split('/')[1] ?? 'image';
  const objectKey = `uploads/original/${crypto.randomUUID()}.${extension}`;
  const r2UploadTarget = await createR2UploadUrl(objectKey, contentType, maxSizeBytes);

  if (r2UploadTarget) {
    return NextResponse.json({
      ...r2UploadTarget,
      mockUpload: false
    });
  }

  return NextResponse.json({
    uploadUrl: null,
    objectKey,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    maxSizeBytes,
    mockUpload: true
  });
}
