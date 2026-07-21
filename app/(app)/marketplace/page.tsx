'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShoppingBag, Plus, Phone, User, Tag, MapPin, X } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface Listing {
  id: string
  title: string
  category: string
  condition: string
  price: number
  description: string
  location_text: string
  contact_name: string
  contact_phone: string
  images: string[]
  created_at: string
}

export default function MarketplacePage() {
  const { user } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Form states
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('bike')
  const [condition, setCondition] = useState('Like New')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [contactName, setContactName] = useState(user?.fullName || '')
  const [contactPhone, setContactPhone] = useState('')
  const [locationText, setLocationText] = useState('Kathmandu')
  const [imageUrls, setImageUrls] = useState<string[]>([''])
  const [submitting, setSubmitting] = useState(false)

  const fetchListings = async () => {
    try {
      const res = await fetch('/api/marketplace')
      const data = await res.json()
      if (Array.isArray(data)) {
        setListings(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [])

  const handleAddImageUrl = () => {
    if (imageUrls.length < 5) {
      setImageUrls([...imageUrls, ''])
    }
  }

  const handleImageChange = (index: number, value: string) => {
    const updated = [...imageUrls]
    updated[index] = value
    setImageUrls(updated)
  }

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !price || !contactName || !contactPhone) return

    setSubmitting(true)
    const validImages = imageUrls.filter(url => url.trim() !== '')

    try {
      const res = await fetch('/api/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          condition,
          price: Number(price),
          description,
          contact_name: contactName,
          contact_phone: contactPhone,
          location_text: locationText,
          images: validImages.length > 0 ? validImages : [
            'https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=800'
          ]
        })
      })

      if (res.ok) {
        setTitle('')
        setPrice('')
        setDescription('')
        setContactPhone('')
        setImageUrls([''])
        setShowModal(false)
        fetchListings()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  const filteredListings = selectedCategory === 'all'
    ? listings
    : listings.filter(l => l.category === selectedCategory)

  return (
    <div className="container py-6 md:py-8 max-w-6xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900">MTB Marketplace Nepal</h1>
          <p className="text-xs md:text-sm text-zinc-600 mt-1">Buy and sell bikes, components, accessories, and gear directly from local riders and shops.</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)} 
          className="bg-orange-600 hover:bg-orange-700 font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> List Item for Sale
        </Button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {['all', 'bike', 'component', 'accessory', 'rental'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-zinc-900 text-white shadow' : 'bg-white border text-zinc-600 hover:bg-zinc-50'}`}
          >
            {cat === 'all' ? 'All Items' : cat + 's'}
          </button>
        ))}
      </div>

      {/* List Item Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-1">List Bike / Item for Sale</h2>
            <p className="text-xs text-zinc-500 mb-4 sm:mb-6">Fill in details. Accessible to all community members.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Listing Title</label>
                <Input
                  placeholder="e.g. Santa Cruz Megatower C 2024"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-zinc-200 bg-white text-sm"
                  >
                    <option value="bike">Complete Bike</option>
                    <option value="component">Components & Parts</option>
                    <option value="accessory">Apparel & Helmets</option>
                    <option value="rental">Bike Rental</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Price (NPR)</label>
                  <Input
                    placeholder="e.g. 185000"
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Condition</label>
                  <select
                    value={condition}
                    onChange={e => setCondition(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-zinc-200 bg-white text-sm"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Location</label>
                  <Input
                    placeholder="e.g. Thamel, Kathmandu"
                    value={locationText}
                    onChange={e => setLocationText(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Contact Person Name</label>
                  <Input
                    placeholder="Your Name"
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Contact Phone Number</label>
                  <Input
                    placeholder="+977-9801234567"
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Detail specs, fork size, gear ratio, service history..."
                  className="w-full h-24 p-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600/20 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-2">Photo URLs (Up to 5)</label>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        placeholder="https://images.unsplash.com/..."
                        value={url}
                        onChange={e => handleImageChange(index, e.target.value)}
                        className="text-xs"
                      />
                      {imageUrls.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveImage(index)}
                          className="h-8 w-8 text-zinc-400 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {imageUrls.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="mt-2 text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add photo URL
                  </button>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-orange-600 hover:bg-orange-700 font-bold px-6">
                  {submitting ? 'Publishing...' : 'Save & Publish Item'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid of Listings */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 rounded-2xl bg-zinc-100 animate-pulse" />
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border">
          <p className="text-zinc-500 font-medium">No items found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map(listing => (
            <Card key={listing.id} className="overflow-hidden border-zinc-200 shadow-sm rounded-2xl flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="relative h-48 bg-zinc-100 overflow-hidden">
                  <img
                    src={(listing.images && listing.images[0]) || 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=800'}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full">
                    {listing.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-orange-600 text-white font-black text-sm px-3 py-1 rounded-full shadow">
                    NPR {listing.price?.toLocaleString()}
                  </div>
                </div>

                <CardContent className="p-4 sm:p-5">
                  <h3 className="font-bold text-base text-zinc-900 line-clamp-1 mb-1">{listing.title}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 mb-4">{listing.description}</p>

                  <div className="space-y-1.5 text-xs text-zinc-600 border-t pt-3">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{listing.contact_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-orange-600" />
                      <span className="font-bold text-zinc-900">{listing.contact_phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{listing.location_text || 'Kathmandu'}</span>
                    </div>
                  </div>
                </CardContent>
              </div>

              <div className="p-4 bg-zinc-50 border-t flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 font-semibold uppercase">{listing.condition}</span>
                <a href={`tel:${listing.contact_phone}`}>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-xs font-bold rounded-lg flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Call Seller
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
