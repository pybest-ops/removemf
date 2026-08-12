import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Remove Matcha Filter',
  description: 'Upload a photo and let AI restore a more natural look in seconds.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
