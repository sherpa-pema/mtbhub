'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Store, Plus, MapPin, Phone, ArrowRight, X } from 'lucide-react'

interface Shop {
  id: string
  slug: string
  name: string
  type: string
  description: string
  location_text: string
  address: string
  phone: string
  image_url: string
}

export default function DirectoryPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  // Shop creation form
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [type, setType] = useState('shop')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchShops = async () => {
    try {
      const res = await fetch('/api/shops')
      const data = await res.json()
      if (Array.isArray(data)) {
        setShops(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShops()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !address) return

    setSubmitting(true)

    try {
      const res = await fetch('/api/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          address,
          phone,
          type,
          description,
          image_url: imageUrl || 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=800'
        })
      })

      if (res.ok) {
        setName('')
        setAddress('')
        setPhone('')
        setDescription('')
        setImageUrl('')
        setShowModal(false)
        fetchShops()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">Kathmandu Valley MTB Shops</h1>
          <p className="text-sm text-zinc-600 mt-1">Bike sales, custom repairs, suspension tuning, and rental hubs in Thamel & Pokhara.</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)} 
          className="bg-orange-600 hover:bg-orange-700 font-bold rounded-xl flex items-center gap-2 shadow-md shadow-orange-600/20"
        >
          <Plus className="w-4 h-4" /> Create Shop Profile
        </Button>
      </div>

      {/* Create Shop Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-zinc-900 mb-1">Create Shop Listing</h2>
            <p className="text-xs text-zinc-500 mb-6">List your mountain bike shop, repair hub, or rental center.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Shop Name</label>
                <Input
                  placeholder="e.g. Epic Mountain Bike Thamel"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Shop Address</label>
                <Input
                  placeholder="e.g. Z-Street, Thamel, Kathmandu"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Phone Number</label>
                  <Input
                    placeholder="+977-9801234567"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Shop Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-zinc-200 bg-white text-sm"
                  >
                    <option value="shop">Retail Bike Shop</option>
                    <option value="workshop">Repair & Workshop</option>
                    <option value="rental">Bike Rental Center</option>
                    <option value="guide">Guide Service</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Description & Services Offered</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Wheel truing, hydraulic brake bleed, Santa Cruz sales..."
                  className="w-full h-24 p-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600/20 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Storefront Image URL</label>
                <Input
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-orange-600 hover:bg-orange-700 font-bold px-6">
                  {submitting ? 'Creating...' : 'Save & Publish Shop'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid of Shops */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-72 rounded-2xl bg-zinc-100 animate-pulse" />
          ))}
        </div>
      ) : shops.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border">
          <p className="text-zinc-500 font-medium">No shops found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {shops.map(shop => (
            <Card key={shop.id} className="overflow-hidden border-zinc-200 shadow-sm rounded-2xl flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="relative h-48 bg-zinc-100 overflow-hidden">
                  <img
                    src={shop.image_url || 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=800'}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full">
                    {shop.type}
                  </div>
                </div>

                <CardContent className="p-5">
                  <h3 className="font-bold text-base text-zinc-900 line-clamp-1 mb-1">{shop.name}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 mb-4">{shop.description}</p>

                  <div className="space-y-1 text-xs text-zinc-600 border-t pt-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-orange-600" />
                      <span className="font-medium text-zinc-900">{shop.address}</span>
                    </div>
                    {shop.phone && (
                      <div className="flex items-center gap-2 text-zinc-500">
                        <Phone className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{shop.phone}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </div>

              <div className="p-4 bg-zinc-50 border-t">
                <Link href={`/directory/${shop.id}`}>
                  <Button className="w-full bg-zinc-900 hover:bg-orange-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors">
                    View Shop & Add Items <ArrowRight className="w-3.5 h-3.5" />
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
