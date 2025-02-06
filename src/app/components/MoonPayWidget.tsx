'use client';

import { MoonPayBuyWidget } from '@moonpay/moonpay-react';
import dynamic from 'next/dynamic';

const MoonPayProvider = dynamic(
  () => import('@moonpay/moonpay-react').then(mod => mod.MoonPayProvider),
  {
    ssr: false,
    loading: () => <div>Loading MoonPay...</div>,
  }
);

export default function MoonPayWidget() {
  const handleUrlSignatureRequested = async (widgetUrl: string) => {
    try {
      const response = await fetch('/api/sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: widgetUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to get signature');
      }

      const data = await response.json();
      return data.signature;
    } catch (error) {
      console.error('Error getting signature:', error);
      throw error;
    }
  };
  return (
    <main className="flex flex-col items-center justify-between -mt-8 overflow-hidden h-screen w-screen fixed">
      <div id="moonpay-container">
        <MoonPayProvider
          apiKey={process.env.NEXT_PUBLIC_WIDGET_API_KEY || ''}
          debug
        >
          <div
            id="moonpay-widget"
            className="flex flex-col items-center justify-center"
          >
            <MoonPayBuyWidget
              className="p-4 min-h-screen"
              variant="embedded"
              onUrlSignatureRequested={handleUrlSignatureRequested}
            />
          </div>
        </MoonPayProvider>
      </div>
    </main>
  );
}
