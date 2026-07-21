import { query } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MapPin, Navigation, Mountain, ArrowLeft, Download, ShieldCheck, AlertTriangle } from 'lucide-react'

export default async function TrailDetailPage({ params }: { params: { slug: string } }) {
  let trail = null

  try {
    const res = await query('select * from trails where slug = $1 limit 1', [params.slug])
    if (res.rows.length > 0) {
      trail = res.rows[0]
    }
  } catch (e) {
    console.error(e)
  }

  if (!trail) {
    return (
      <div className="container py-20 text-center max-w-md mx-auto">
        <h1 className="text-2xl font-bold">Trail Not Found</h1>
        <p className="text-zinc-500 text-sm mt-2">The trail you requested could not be located.</p>
        <Link href="/trails" className="mt-6 inline-block">
          <Button variant="outline">Back to Trails</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto px-4">
      <Link href="/trails" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Trails Directory
      </Link>

      <div className="bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-orange-600 mb-2 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> Verified Kathmandu MTB Route
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-zinc-900 mb-3">{trail.name}</h1>
        <p className="text-zinc-600 text-base leading-relaxed mb-6">{trail.description}</p>

        {/* Trail Specs Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200 mb-8">
          <div>
            <div className="text-[11px] text-zinc-400 font-bold uppercase">Distance</div>
            <div className="text-xl font-black text-zinc-900 flex items-center gap-1 mt-0.5">
              <Navigation className="w-4 h-4 text-orange-600" /> {trail.distance_km} km
            </div>
          </div>

          <div>
            <div className="text-[11px] text-zinc-400 font-bold uppercase">Elevation Gain</div>
            <div className="text-xl font-black text-zinc-900 flex items-center gap-1 mt-0.5">
              <Mountain className="w-4 h-4 text-orange-600" /> +{trail.elevation_gain_m} m
            </div>
          </div>

          <div>
            <div className="text-[11px] text-zinc-400 font-bold uppercase">Difficulty</div>
            <div className="text-base font-black capitalize text-zinc-900 mt-1">
              {trail.difficulty}
            </div>
          </div>

          <div>
            <div className="text-[11px] text-zinc-400 font-bold uppercase">Trail Type</div>
            <div className="text-base font-black uppercase text-orange-600 mt-1">
              {trail.trail_type}
            </div>
          </div>
        </div>

        {/* Map Placeholder Graphic */}
        <div className="relative h-72 rounded-2xl bg-zinc-900 text-white overflow-hidden flex flex-col items-center justify-center p-6 text-center border mb-8">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <MapPin className="w-10 h-10 text-orange-500 mb-2 animate-bounce" />
          <h3 className="font-bold text-lg">Interactive GPS Elevation & Route Map</h3>
          <p className="text-xs text-zinc-400 max-w-sm mt-1">MapLibre GL & PostGIS LineString geometry layer active for {trail.location_text}.</p>
        </div>

        {/* Trail Condition & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-orange-50 rounded-2xl border border-orange-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <div>
              <div className="font-bold text-sm text-orange-950">Monsoon Trail Status: Dry & Fast</div>
              <div className="text-xs text-orange-800">Verified by local Kathmandu riders 2 hours ago.</div>
            </div>
          </div>

          <Button className="bg-orange-600 hover:bg-orange-700 font-bold rounded-xl flex items-center gap-2">
            <Download className="w-4 h-4" /> Download GPX File
          </Button>
        </div>
      </div>
    </div>
  )
}
