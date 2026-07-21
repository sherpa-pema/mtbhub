import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const result = await query(`
      select id, slug, title, description, event_type, start_at, location_text, difficulty, distance_km, max_participants, registration_fee, images, has_registration_form, created_at
      from events
      order by start_at asc
    `)
    return NextResponse.json(result.rows)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      title,
      description,
      event_type,
      location_text,
      difficulty,
      distance_km,
      max_participants,
      registration_fee,
      images,
      has_registration_form,
      registration_instructions
    } = body

    if (!title || !event_type || !location_text) {
      return NextResponse.json(
        { error: 'Title, event type, and location are required.' },
        { status: 400 }
      )
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4)

    const result = await query(
      `insert into events (slug, title, description, event_type, start_at, location_text, difficulty, distance_km, max_participants, registration_fee, images, has_registration_form, registration_instructions)
       values ($1, $2, $3, $4, now() + interval '14 days', $5, $6, $7, $8, $9, $10, $11, $12)
       returning *`,
      [
        slug,
        title,
        description || '',
        event_type,
        location_text,
        difficulty || 'blue',
        distance_km ? Number(distance_km) : 25,
        max_participants ? Number(max_participants) : 100,
        registration_fee ? Number(registration_fee) : 0,
        images || [],
        has_registration_form !== undefined ? has_registration_form : true,
        registration_instructions || ''
      ]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
