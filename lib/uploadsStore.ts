type UploadedAsset = {
  objectKey: string;
  dataUrl: string;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
};

type UploadsStoreGlobal = typeof globalThis & {
  __removeMatchaUploads?: Map<string, UploadedAsset>;
};

// uploadsStore 是本地开发用的内存上传表，后续生产环境替换成 R2。
const uploadsStore = ((globalThis as UploadsStoreGlobal).__removeMatchaUploads ??= new Map<string, UploadedAsset>());

// saveUploadedAsset 保存用户上传图片的数据 URI，供 Replicate 在无 R2 时临时读取。
export function saveUploadedAsset(asset: UploadedAsset) {
  uploadsStore.set(asset.objectKey, asset);
  return asset;
}

// getUploadedAsset 按 object key 读取本地上传图片。
export function getUploadedAsset(objectKey: string) {
  return uploadsStore.get(objectKey) ?? null;
}
