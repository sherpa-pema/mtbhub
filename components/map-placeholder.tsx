export function MapPlaceholder({ height = 'h-[400px]' }: { height?: string }) {
  return (
    <div className={`${height} w-full rounded-2xl bg-gradient-to-br from-green-100 to-orange-100 border flex items-center justify-center relative overflow-hidden`}>
      <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px'}}/>
      <div className="text-center">
        <div className="text-sm font-semibold">Mapbox / MapLibre Integration</div>
        <div className="text-xs text-zinc-600 mt-1">Replace with MapLibre GL + PostGIS geom</div>
      </div>
    </div>
  )
}
