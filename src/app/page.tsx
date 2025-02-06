import dynamic from 'next/dynamic';

const ClientHome = dynamic(
  () => import('./components/MoonPayWidget').then(mod => mod.default),
  {
    loading: () => <div>Loading...</div>,
  }
);

export default function Home() {
  return <ClientHome />;
}
