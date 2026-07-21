import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const result = await query(`
      select id, slug, name, description, location_text, distance_km, elevation_gain_m, difficulty, trail_type, avg_rating, status, created_at
      from trails
      order by created_at desc
    `)
    return NextResponse.json(result.rows)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
