import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const result = await query(`
      select id, slug, name, type, description, location_text, address, phone, whatsapp, image_url, created_at
      from shops
      order by created_at desc
    `)
    return NextResponse.json(result.rows)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, address, location_text, phone, type, description, image_url } = body

    if (!name || !address) {
      return NextResponse.json(
        { error: 'Shop name and address are required.' },
        { status: 400 }
      )
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4)

    const result = await query(
      `insert into shops (slug, name, type, description, location_text, address, phone, image_url)
       values ($1, $2, $3, $4, $5, $6, $7, $8)
       returning *`,
      [
        slug,
        name,
        type || 'shop',
        description || '',
        location_text || 'Kathmandu',
        address,
        phone || '',
        image_url || 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=800'
      ]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
