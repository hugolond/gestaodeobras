'use client';

import { usePathname } from 'next/navigation';
import fundo from '../public/fundo.png';

export default function BodyWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isRoot = pathname === '/';

  const style = !isRoot
    ? {
        backgroundImage: `url('${fundo.src}')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }
    : {};

  return <div style={style}>{children}</div>;
}
