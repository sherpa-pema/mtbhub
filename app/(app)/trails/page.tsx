'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Navigation, Mountain, Star, ArrowRight } from 'lucide-react'

interface Trail {
  id: string
  slug: string
  name: string
  description: string
  location_text: string
  distance_km: number
  elevation_gain_m: number
  difficulty: string
  trail_type: string
  avg_rating: number
}

export default function TrailsPage() {
  const [trails, setTrails] = useState<Trail[]>([])
  const [loading, setLoading] = useState(true)
  const [filterDifficulty, setFilterDifficulty] = useState('all')

  useEffect(() => {
    fetch('/api/trails')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTrails(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filteredTrails = filterDifficulty === 'all'
    ? trails
    : trails.filter(t => t.difficulty === filterDifficulty)

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'green':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">Green • Beginner</span>
      case 'blue':
        return <span className="bg-blue-100 text-blue-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">Blue • Intermediate</span>
      case 'black':
        return <span className="bg-zinc-900 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">Black • Advanced</span>
      case 'double_black':
        return <span className="bg-red-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">Double Black • Pro</span>
      default:
        return <span className="bg-zinc-100 text-zinc-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">{diff}</span>
    }
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">Kathmandu Valley Trails</h1>
          <p className="text-sm text-zinc-600 mt-1">Explore Shivapuri National Park, Phulchowki, Lakuri Bhanjyang, and Kakani singletrack.</p>
        </div>

        <div className="flex gap-2">
          {['all', 'blue', 'black', 'double_black'].map(diff => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${filterDifficulty === diff ? 'bg-orange-600 text-white shadow' : 'bg-white border text-zinc-600'}`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-zinc-100 animate-pulse" />
          ))}
        </div>
      ) : filteredTrails.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border">
          <p className="text-zinc-500 font-medium">No trails matching this difficulty filter.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredTrails.map(trail => (
            <Card key={trail.id} className="overflow-hidden border-zinc-200 shadow-sm rounded-2xl flex flex-col justify-between hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  {getDifficultyBadge(trail.difficulty)}
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" /> {trail.avg_rating || 4.8}
                  </div>
                </div>

                <h3 className="font-bold text-lg text-zinc-900 mb-2">{trail.name}</h3>
                <p className="text-xs text-zinc-600 line-clamp-3 mb-4 leading-relaxed">{trail.description}</p>

                <div className="space-y-2 border-t pt-3 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{trail.location_text}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-700 font-medium pt-1">
                    <span className="flex items-center gap-1"><Navigation className="w-3.5 h-3.5 text-orange-600" /> {trail.distance_km} km</span>
                    <span className="flex items-center gap-1"><Mountain className="w-3.5 h-3.5 text-orange-600" /> +{trail.elevation_gain_m}m</span>
                  </div>
                </div>
              </CardContent>

              <div className="p-4 bg-zinc-50 border-t">
                <Link href={`/trails/${trail.slug}`}>
                  <Button className="w-full bg-zinc-900 hover:bg-orange-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors">
                    View Trail Specs & Map <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
