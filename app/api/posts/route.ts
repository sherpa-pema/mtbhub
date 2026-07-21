import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const result = await query(`
      select id, content, author_name, author_avatar, author_role, images, created_at
      from posts
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
    const { content, author_name, author_avatar, author_role, images } = body

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const result = await query(
      `insert into posts (content, author_name, author_avatar, author_role, images)
       values ($1, $2, $3, $4, $5)
       returning *`,
      [
        content,
        author_name || 'Rider Community Member',
        author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
        author_role || 'rider',
        images || []
      ]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
