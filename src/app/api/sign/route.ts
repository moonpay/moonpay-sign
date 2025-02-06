import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const secretKey = process.env.SIGNING_SECRET || '';
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(new URL(body.url).search)
      .digest('base64');
    const response = {
      signature,
    };
    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
