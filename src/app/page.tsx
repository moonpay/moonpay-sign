'use client';

import dynamic from 'next/dynamic';

const MoonPayWidget = dynamic(
  () => import('./components/MoonPayWidget').then(mod => mod.default),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  }
);

export default function Home() {
  return <MoonPayWidget />;
}
