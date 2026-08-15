import { createR2DownloadUrl, deleteR2Object, isR2Configured, putR2Object } from './r2';
import { getUploadedAsset } from './uploadsStore';

// getPublicInputUrl 当前优先返回 R2 短期签名 URL；无 R2 时回退到本地上传 data URI。
export async function getPublicInputUrl(objectKey: string) {
  const r2Url = await createR2DownloadUrl(objectKey, 30 * 60);

  if (r2Url) return r2Url;

  const uploadedAsset = getUploadedAsset(objectKey);

  if (uploadedAsset) return uploadedAsset.dataUrl;

  const publicBaseUrl = process.env.NEXT_PUBLIC_MOCK_INPUT_IMAGE_URL;

  if (publicBaseUrl) return publicBaseUrl;

  return `https://picsum.photos/seed/${encodeURIComponent(objectKey)}/1200/900`;
}

// persistRemoteImageToR2 下载 Replicate 结果图并保存到 R2；无 R2 时返回远程结果地址。
export async function persistRemoteImageToR2(remoteUrl: string, jobId: string) {
  if (!isR2Configured()) {
    return {
      objectKey: `results/final/${jobId}.png`,
      publicUrl: remoteUrl
    };
  }

  const response = await fetch(remoteUrl);

  if (!response.ok) throw new Error('Failed to download Replicate output image');

  const contentType = response.headers.get('content-type') ?? 'image/png';
  const bytes = new Uint8Array(await response.arrayBuffer());
  const extension = contentType.includes('webp') ? 'webp' : contentType.includes('jpeg') ? 'jpg' : 'png';
  const objectKey = `results/final/${jobId}.${extension}`;

  await putR2Object(objectKey, bytes, contentType);

  const publicUrl = await createR2DownloadUrl(objectKey);

  return {
    objectKey,
    publicUrl: publicUrl ?? remoteUrl
  };
}

// deleteStoredResultImage 尽量删除已生成结果图；本地 fallback 或删除失败不阻断历史记录移除。
export async function deleteStoredResultImage(outputObjectKey?: string) {
  if (!outputObjectKey || !isR2Configured()) return;

  try {
    await deleteR2Object(outputObjectKey);
  } catch {
    // 删除对象失败时保留软删除结果，避免用户界面继续显示已移除图片。
  }
}
