import { NextResponse } from 'next/server';

const WEBHOOK_URL = 'http://localhost:4100/webhook/whatsapp';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Simulate sending to Webhook
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: body.from,
        body: body.body,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send to webhook');
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
