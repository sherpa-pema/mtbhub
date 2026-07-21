import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, TrendingUp } from 'lucide-react'
export function TrailCard({ trail }: { trail: any }) {
  return (
    <Link href={`/trails/${trail.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-[16/10] bg-zinc-100 relative overflow-hidden">
          <img src={trail.image} alt={trail.name} className="h-full w-full object-cover" />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant={trail.difficulty === 'black' ? 'danger' : 'secondary'}>{trail.difficulty}</Badge>
            <Badge variant={trail.condition === 'dry' ? 'success' : 'warning'}>{trail.condition}</Badge>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold">{trail.name}</h3>
          <div className="flex items-center gap-1 text-xs text-zinc-500 mt-1"><MapPin className="h-3 w-3"/>{trail.location}</div>
          <div className="flex gap-4 mt-3 text-xs font-medium">
            <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3"/>{trail.distance} km</span>
            <span>{trail.elevation} m ↑</span>
            <span>★ {trail.rating}</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
