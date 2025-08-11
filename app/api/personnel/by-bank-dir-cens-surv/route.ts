import { NextRequest } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bank = searchParams.get('bank');

  if (!bank) {
    return new Response(JSON.stringify({ error: 'Missing bank' }), { status: 400 });
  }

  try {
    const [rows] = await pool.execute(
      `SELECT name, ifu, account_number FROM dircenssuv WHERE bank = ?`,
      [bank]
    );

    const result = Object.fromEntries(
      (rows as any[]).map((dircenssurv) => [
        dircenssurv.name.trim(),
        {
          ifu: dircenssurv.ifu ?? '',
          account_number: dircenssurv.account_number ?? '',
        }
      ])
    );

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (err) {
    console.error('MySQL error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
