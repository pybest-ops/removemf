import { getCurrentUser } from '@/lib/googleAuth';

// AuthenticatedUser 是付费和任务接口使用的最小用户身份。
export type AuthenticatedUser = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
};

// getAuthenticatedUser 从本站签名 session cookie 中读取 Google 邮箱身份。
export async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
  const user = await getCurrentUser(request);
  const email = user?.email;

  if (!email) return null;

  return {
    id: user.id,
    email,
    name: user.name,
    image: user.image
  };
}
