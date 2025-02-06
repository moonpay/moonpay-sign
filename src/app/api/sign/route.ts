import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  // Get the URL from searchParams
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  // Validate URL parameter
  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  // Get secret key from environment variable
  const secretKey = process.env.SIGNING_SECRET;
  if (!secretKey) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    // Create HMAC signature
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(url);
    const signature = hmac.digest('hex');

    // Return the signature
    return NextResponse.json({
      signature,
      signedUrl: `${url}?signature=${signature}`,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate signature' },
      { status: 500 }
    );
  }
}
