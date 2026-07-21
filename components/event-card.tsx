import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Users } from 'lucide-react'
export function EventCard({ event }: { event: any }) {
  return (
    <Link href={`/events/${event.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition">
        <div className="aspect-[16/9] bg-zinc-100"><img src={event.image} alt={event.title} className="h-full w-full object-cover"/></div>
        <div className="p-4">
          <Badge>{event.type}</Badge>
          <h3 className="font-semibold mt-2">{event.title}</h3>
          <div className="flex gap-4 mt-2 text-xs text-zinc-500">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3"/>{event.date}</span>
            <span className="flex items-center gap-1"><Users className="h-3 w-3"/>{event.participants}</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
