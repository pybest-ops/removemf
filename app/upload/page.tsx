import { redirect } from 'next/navigation';

// UploadPage 将旧上传页入口收敛到首页 Hero 上传区域。
export default function UploadPage() {
  redirect('/#upload');
}
