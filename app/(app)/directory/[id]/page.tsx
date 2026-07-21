'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Store, Plus, MapPin, Phone, ArrowLeft, PhoneCall, ShoppingBag, X } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface Shop {
  id: string
  name: string
  address: string
  phone: string
  type: string
  description: string
  image_url: string
}

interface ShopItem {
  id: string
  title: string
  category: string
  price: number
  description: string
  contact_name: string
  contact_phone: string
  images: string[]
}

export default function ShopDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [shop, setShop] = useState<Shop | null>(null)
  const [shopItems, setShopItems] = useState<ShopItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  // Item creation form (tied to shop)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('bike')
  const [condition, setCondition] = useState('Like New')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [contactName, setContactName] = useState(user?.fullName || '')
  const [contactPhone, setContactPhone] = useState('')
  const [imageUrls, setImageUrls] = useState<string[]>([''])
  const [submitting, setSubmitting] = useState(false)

  const fetchData = async () => {
    try {
      const shopRes = await fetch('/api/shops')
      const shopData = await shopRes.json()
      if (Array.isArray(shopData)) {
        const found = shopData.find((s: any) => s.id === id || s.slug === id)
        if (found) setShop(found)
      }

      const itemRes = await fetch('/api/marketplace')
      const itemData = await itemRes.json()
      if (Array.isArray(itemData)) {
        setShopItems(itemData.filter((i: any) => i.shop_id === id))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

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
    if (!title || !price) return

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
          contact_name: contactName || shop?.name || 'Shop Manager',
          contact_phone: contactPhone || shop?.phone || '+977-9800000000',
          location_text: shop?.address || 'Kathmandu',
          shop_id: id,
          images: validImages.length > 0 ? validImages : [
            'https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=800'
          ]
        })
      })

      if (res.ok) {
        setTitle('')
        setPrice('')
        setDescription('')
        setImageUrls([''])
        setShowModal(false)
        fetchData()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="container py-20 text-center text-zinc-500">Loading shop profile...</div>
  }

  return (
    <div className="container py-8 max-w-5xl mx-auto px-4">
      <Link href="/directory" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Shops Directory
      </Link>

      {shop ? (
        <div className="space-y-8">
          {/* Shop Banner Header */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex gap-4 items-center">
                <img
                  src={shop.image_url || 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=800'}
                  alt={shop.name}
                  className="w-20 h-20 rounded-2xl object-cover border"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                    {shop.type}
                  </span>
                  <h1 className="text-2xl font-black text-zinc-900 mt-1">{shop.name}</h1>
                  <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-600" /> {shop.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {shop.phone && (
                  <a href={`tel:${shop.phone}`}>
                    <Button variant="outline" className="rounded-xl flex items-center gap-2 font-bold text-xs">
                      <PhoneCall className="w-3.5 h-3.5" /> Call Shop
                    </Button>
                  </a>
                )}
                <Button 
                  onClick={() => setShowModal(false)}
                  onClickCapture={() => setShowModal(true)} 
                  className="bg-orange-600 hover:bg-orange-700 font-bold rounded-xl flex items-center gap-2 shadow-md shadow-orange-600/20 text-xs"
                >
                  <Plus className="w-4 h-4" /> Add Item for Sale in Shop
                </Button>
              </div>
            </div>

            <p className="text-zinc-600 text-sm mt-6 border-t pt-4 leading-relaxed">{shop.description}</p>
          </div>

          {/* Add Item Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
                <button 
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-zinc-900 mb-1">Add Item for Sale in {shop.name}</h2>
                <p className="text-xs text-zinc-500 mb-6">List inventory item directly attached to this shop profile.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">Item Title</label>
                    <Input
                      placeholder="e.g. Maxxis Minion DHR II 27.5x2.4 Tire"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                        placeholder="e.g. 7500"
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">Description</label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Item specifications and availability..."
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
                      {submitting ? 'Saving...' : 'Add Item to Shop Inventory'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Shop Inventory Grid */}
          <div>
            <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" /> Items for Sale in {shop.name}
            </h2>

            {shopItems.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border">
                <p className="text-zinc-500 text-sm">No items listed for this shop yet. Click "Add Item for Sale in Shop" above to list items!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {shopItems.map(item => (
                  <Card key={item.id} className="overflow-hidden border-zinc-200 shadow-sm rounded-2xl flex flex-col justify-between">
                    <div>
                      <img
                        src={(item.images && item.images[0]) || 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=800'}
                        alt={item.title}
                        className="w-full h-44 object-cover"
                      />
                      <CardContent className="p-4">
                        <h3 className="font-bold text-sm text-zinc-900 line-clamp-1 mb-1">{item.title}</h3>
                        <p className="text-xs text-zinc-500 line-clamp-2 mb-3">{item.description}</p>
                        <div className="text-base font-black text-orange-600">NPR {item.price?.toLocaleString()}</div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">Shop not found.</div>
      )}
    </div>
  )
}
