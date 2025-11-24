import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contactId = searchParams.get('contactId');

  if (!contactId) {
    return NextResponse.json({ error: 'Missing contactId' }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    const query = `
      SELECT m.* 
      FROM "Message" m
      JOIN "Conversation" c ON m."conversationId" = c.id
      WHERE c."contactId" = $1
      ORDER BY m."createdAt" ASC
    `;
    const result = await client.query(query, [contactId]);
    client.release();
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
