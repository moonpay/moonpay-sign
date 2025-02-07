import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { headers } from 'next/headers';
import { rateLimit } from '@/app/utils/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
});

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'anonymous';

    try {
      await limiter.check(10, ip); // 10 requests per minute
    } catch {
      return NextResponse.json(
        { error: 'Too Many Requests' },
        {
          status: 429,
          headers: {
            'Access-Control-Allow-Origin': getAllowedOrigin(),
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    }

    const body = await request.json();
    const secretKey = process.env.SIGNING_SECRET || '';
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(new URL(body.url).search)
      .digest('base64');

    return NextResponse.json(
      { signature },
      {
        headers: {
          'Access-Control-Allow-Origin': getAllowedOrigin(),
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': getAllowedOrigin(),
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': getAllowedOrigin(),
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}

function getAllowedOrigin() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}
