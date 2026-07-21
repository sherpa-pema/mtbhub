import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const result = await query(`
      select id, slug, title, location, company_name, days, difficulty, price, itinerary, images, created_at
      from tours
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
      location,
      company_name,
      days,
      difficulty,
      price,
      itinerary,
      images,
      user_role
    } = body

    // RBAC Rule: Only mtb_company or shop_owner can create tours!
    if (user_role === 'rider') {
      return NextResponse.json(
        { error: 'Riders are not authorized to create tours. Only MTB Companies can publish tours.' },
        { status: 403 }
      )
    }

    if (!title || !location || !days || !price) {
      return NextResponse.json(
        { error: 'Title, location, days, and price are required.' },
        { status: 400 }
      )
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4)

    const result = await query(
      `insert into tours (slug, title, location, company_name, days, difficulty, price, itinerary, images)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       returning *`,
      [
        slug,
        title,
        location,
        company_name || 'Himalayan MTB Company',
        Number(days),
        difficulty || 'black',
        Number(price),
        typeof itinerary === 'string' ? itinerary : JSON.stringify(itinerary || []),
        images || []
      ]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
