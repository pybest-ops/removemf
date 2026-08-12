import { auth } from '@/auth';

// AuthenticatedUser 是付费和任务接口使用的最小用户身份。
export type AuthenticatedUser = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
};

// getAuthenticatedUser 从 Auth.js session 中读取 Google 邮箱身份。
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) return null;

  return {
    id: `google:${email.toLowerCase()}`,
    email,
    name: session.user?.name,
    image: session.user?.image
  };
}
