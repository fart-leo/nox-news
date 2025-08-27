import { ingestRSS } from '../../../lib/ingest'
import { NextResponse } from 'next/server'
export const revalidate = 0
export async function GET() {
  const res = await ingestRSS()
  return NextResponse.json(res)
}