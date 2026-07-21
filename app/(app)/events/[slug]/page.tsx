import { mockEvents } from '@/lib/mockData'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MapPlaceholder } from '@/components/map-placeholder'
export default function EventDetail({ params }: { params: { slug: string } }) {
  const event = mockEvents.find(e => e.slug === params.slug) || mockEvents[0]
  return (
    <div className="container py-8">
      <img src={event.image} className="w-full h-[360px] object-cover rounded-2xl" />
      <div className="grid md:grid-cols-[1fr_360px] gap-8 mt-6">
        <div>
          <Badge>{event.type}</Badge>
          <h1 className="text-4xl font-bold mt-3">{event.title}</h1>
          <p className="text-zinc-600 mt-2">{event.location} • {event.date} • {event.distance}</p>
          <div className="prose mt-6 text-sm text-zinc-700">
            <p>Join Nepal&apos;s biggest cycling community. This event includes marked route, aid stations, timing, photos, and after party. Open to all levels.</p>
            <ul><li>Date and Time: {event.date}</li><li>Location with Map: {event.location}</li><li>Difficulty: Intermediate</li><li>Organizer: Nepal Cycling Association</li></ul>
          </div>
        </div>
        <div className="space-y-6">
          <Card><CardHeader><CardTitle>Register</CardTitle></CardHeader><CardContent><Button className="w-full">Register via eSewa</Button><div className="text-xs text-zinc-500 mt-3">{event.participants} riders joined • 200 spots left</div></CardContent></Card>
          <MapPlaceholder height="h-[240px]" />
          <Card><CardHeader><CardTitle>Participants</CardTitle></CardHeader><CardContent><div className="text-sm">Bishal, Anusha, Jake, Sunita + {event.participants - 4} more</div></CardContent></Card>
        </div>
      </div>
    </div>
  )
}
