'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Compass, Plus, MapPin, Calendar, Lock, ShieldAlert, X } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface Tour {
  id: string
  slug: string
  title: string
  location: string
  company_name: string
  days: number
  difficulty: string
  price: number
  itinerary: any
  images: string[]
  created_at: string
}

export default function ToursPage() {
  const { user } = useAuth()
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null)

  // Tour creation form
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('Upper Mustang, Nepal')
  const [days, setDays] = useState('10')
  const [price, setPrice] = useState('185000')
  const [difficulty, setDifficulty] = useState('black')
  const [day1Title, setDay1Title] = useState('Fly to Jomsom & Ride to Kagbeni')
  const [day1Desc, setDay1Desc] = useState('Assemble bikes and ride Kali Gandaki canyon riverbed.')
  const [day2Title, setDay2Title] = useState('Climb to High Mustang Passes')
  const [day2Desc, setDay2Desc] = useState('Cross high altitude Himalayan mountain passes.')
  const [imageUrls, setImageUrls] = useState<string[]>([''])
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const fetchTours = async () => {
    try {
      const res = await fetch('/api/tours')
      const data = await res.json()
      if (Array.isArray(data)) {
        setTours(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTours()
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
    setErrorMsg('')
    if (!title || !location || !days || !price) return

    setSubmitting(true)
    const validImages = imageUrls.filter(url => url.trim() !== '')

    const itineraryObj = [
      { day: 1, title: day1Title, desc: day1Desc },
      { day: 2, title: day2Title, desc: day2Desc }
    ]

    try {
      const res = await fetch('/api/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          location,
          company_name: user?.fullName || 'Himalayan Singletrack Tours',
          days: Number(days),
          price: Number(price),
          difficulty,
          itinerary: itineraryObj,
          user_role: user?.role || 'rider',
          images: validImages.length > 0 ? validImages : [
            'https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?q=80&w=800'
          ]
        })
      })

      const data = await res.json()

      if (res.ok) {
        setTitle('')
        setImageUrls([''])
        setShowModal(false)
        fetchTours()
      } else {
        setErrorMsg(data.error || 'Failed to create tour.')
      }
    } catch (e: any) {
      setErrorMsg(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const isMtbCompany = user?.role === 'mtb_company' || user?.role === 'shop_owner'

  return (
    <div className="container py-8 max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-tight text-zinc-900">Himalayan MTB Tours</h1>
            {isMtbCompany && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full font-bold border border-purple-200">
                MTB Company Access
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-600 mt-1">Guided multi-day expeditions in Mustang, Annapurna, and Langtang.</p>
        </div>

        {/* RBAC creation button */}
        {isMtbCompany ? (
          <Button 
            onClick={() => setShowModal(true)} 
            className="bg-purple-600 hover:bg-purple-700 font-bold rounded-xl flex items-center gap-2 shadow-md shadow-purple-600/20"
          >
            <Plus className="w-4 h-4" /> Create Tour Package
          </Button>
        ) : (
          <div className="text-xs bg-zinc-100 border text-zinc-500 px-3 py-2 rounded-xl flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Log in as MTB Company to publish tours
          </div>
        )}
      </div>

      {/* Create Tour Modal (MTB Company Only) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-zinc-900 mb-1">Create Guided Tour Package</h2>
            <p className="text-xs text-zinc-500 mb-6">Exclusively available for verified MTB companies and tour operators.</p>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 font-semibold">
                <ShieldAlert className="w-4 h-4 text-red-600" /> {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Tour Package Name</label>
                <Input
                  placeholder="e.g. Upper Mustang Forbidden Kingdom MTB Expedition"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Tour Location / Region</label>
                  <Input
                    placeholder="e.g. Upper Mustang, Nepal"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Difficulty Level</label>
                  <select
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-zinc-200 bg-white text-sm"
                  >
                    <option value="blue">Blue (Moderate)</option>
                    <option value="black">Black (Advanced)</option>
                    <option value="double_black">Double Black (Expert Alpine)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Total Days</label>
                  <Input
                    placeholder="e.g. 12"
                    type="number"
                    value={days}
                    onChange={e => setDays(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Price per Rider (NPR)</label>
                  <Input
                    placeholder="e.g. 245000"
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="border p-3 rounded-xl bg-zinc-50 space-y-2">
                <div className="text-xs font-bold text-zinc-800">Itinerary Highlights</div>
                <div>
                  <label className="text-[11px] text-zinc-500 font-semibold">Day 1 Overview</label>
                  <Input placeholder="Day 1 Title" value={day1Title} onChange={e => setDay1Title(e.target.value)} className="text-xs h-8 mb-1" />
                  <Input placeholder="Day 1 Description" value={day1Desc} onChange={e => setDay1Desc(e.target.value)} className="text-xs h-8" />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-500 font-semibold">Day 2 Overview</label>
                  <Input placeholder="Day 2 Title" value={day2Title} onChange={e => setDay2Title(e.target.value)} className="text-xs h-8 mb-1" />
                  <Input placeholder="Day 2 Description" value={day2Desc} onChange={e => setDay2Desc(e.target.value)} className="text-xs h-8" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-2">Tour Gallery Images (Up to 5)</label>
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
                    className="mt-2 text-xs font-bold text-purple-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add gallery image URL
                  </button>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-purple-600 hover:bg-purple-700 font-bold px-6">
                  {submitting ? 'Publishing...' : 'Save & Publish Tour'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tour Detail Drawer / Modal */}
      {selectedTour && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <button 
              onClick={() => setSelectedTour(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-black text-zinc-900 mb-1">{selectedTour.title}</h2>
            <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {selectedTour.location}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {selectedTour.days} Days</span>
              <span className="font-bold text-purple-600">Offered by {selectedTour.company_name}</span>
            </div>

            {selectedTour.images && selectedTour.images.length > 0 && (
              <img
                src={selectedTour.images[0]}
                alt={selectedTour.title}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
            )}

            <h3 className="font-bold text-sm text-zinc-900 mb-3 uppercase tracking-wider">Day-by-Day Expedition Itinerary</h3>
            <div className="space-y-3">
              {Array.isArray(selectedTour.itinerary) ? selectedTour.itinerary.map((step: any, idx: number) => (
                <div key={idx} className="p-3 bg-zinc-50 border rounded-xl">
                  <div className="font-bold text-xs text-zinc-900">Day {step.day || idx + 1}: {step.title}</div>
                  <div className="text-xs text-zinc-600 mt-1">{step.desc}</div>
                </div>
              )) : (
                <div className="text-xs text-zinc-500">Comprehensive itinerary provided upon booking.</div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400 block">Package Price</span>
                <span className="text-xl font-black text-zinc-900">NPR {selectedTour.price?.toLocaleString()}</span>
              </div>
              <Button onClick={() => alert('Booking request submitted to tour company!')} className="bg-purple-600 hover:bg-purple-700 font-bold">
                Inquire & Book Tour
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Tours */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="h-80 rounded-2xl bg-zinc-100 animate-pulse" />
          ))}
        </div>
      ) : tours.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border">
          <p className="text-zinc-500 font-medium">No tour packages available.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {tours.map(tour => (
            <Card key={tour.id} className="overflow-hidden border-zinc-200 shadow-sm rounded-2xl flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="relative h-56 bg-zinc-100 overflow-hidden">
                  <img
                    src={(tour.images && tour.images[0]) || 'https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?q=80&w=800'}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-purple-600 text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full shadow">
                    {tour.days} Days Expedition
                  </div>
                  <div className="absolute bottom-3 right-3 bg-zinc-900 text-white font-black text-sm px-3 py-1 rounded-full shadow">
                    NPR {tour.price?.toLocaleString()}
                  </div>
                </div>

                <CardContent className="p-5">
                  <h3 className="font-bold text-lg text-zinc-900 mb-1">{tour.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{tour.location}</span>
                    <span>•</span>
                    <span className="font-semibold text-purple-700">{tour.company_name}</span>
                  </div>
                </CardContent>
              </div>

              <div className="p-4 bg-zinc-50 border-t flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 uppercase">{tour.difficulty} Difficulty</span>
                <Button 
                  onClick={() => setSelectedTour(tour)} 
                  size="sm" 
                  className="bg-purple-600 hover:bg-purple-700 text-xs font-bold rounded-lg"
                >
                  View Itinerary
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
