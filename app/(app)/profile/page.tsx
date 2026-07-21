import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export default function ProfilePage() {
  return (
    <div className="container py-8 max-w-3xl">
      <div className="flex gap-6 items-center">
        <div className="h-20 w-20 rounded-full bg-zinc-200"/>
        <div><h1 className="text-2xl font-bold">Bishal Rider</h1><p className="text-sm text-zinc-600">Kathmandu • 124 rides • 980 km • 15,400 m climbed</p><div className="flex gap-2 mt-2"><Badge>Kora Finisher</Badge><Badge variant="secondary">Trail Builder</Badge><Badge variant="success">1000m Club</Badge></div></div>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mt-10">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">32</div><div className="text-xs text-zinc-500">Trails Ridden</div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">12</div><div className="text-xs text-zinc-500">Events Joined</div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">540</div><div className="text-xs text-zinc-500">Karma Points</div></CardContent></Card>
      </div>
    </div>
  )
}
