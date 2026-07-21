import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const result = await query(`
      select id, title, category, condition, price, description, location_text, contact_name, contact_phone, images, shop_id, created_at
      from listings
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
    const {
      title,
      category,
      price,
      description,
      contact_name,
      contact_phone,
      images,
      location_text,
      condition,
      shop_id
    } = body

    if (!title || !price || !category || !contact_name || !contact_phone) {
      return NextResponse.json(
        { error: 'Title, price, category, contact name, and contact phone are required.' },
        { status: 400 }
      )
    }

    const result = await query(
      `insert into listings (title, category, condition, price, description, location_text, contact_name, contact_phone, images, shop_id)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       returning *`,
      [
        title,
        category,
        condition || 'Good',
        Number(price),
        description || '',
        location_text || 'Kathmandu',
        contact_name,
        contact_phone,
        images || [],
        shop_id || null
      ]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
