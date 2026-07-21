'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar, Plus, MapPin, Users, Ticket, CheckCircle2, X } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface EventItem {
  id: string
  slug: string
  title: string
  description: string
  event_type: string
  start_at: string
  location_text: string
  difficulty: string
  distance_km: number
  max_participants: number
  registration_fee: number
  images: string[]
  has_registration_form: boolean
}

export default function EventsPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [registered, setRegistered] = useState(false)

  // Event Creation state
  const [title, setTitle] = useState('')
  const [eventType, setEventType] = useState('enduro')
  const [locationText, setLocationText] = useState('')
  const [description, setDescription] = useState('')
  const [distanceKm, setDistanceKm] = useState('')
  const [maxParticipants, setMaxParticipants] = useState('100')
  const [registrationFee, setRegistrationFee] = useState('0')
  const [hasRegistrationForm, setHasRegistrationForm] = useState(true)
  const [imageUrls, setImageUrls] = useState<string[]>([''])
  const [submitting, setSubmitting] = useState(false)

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events')
      const data = await res.json()
      if (Array.isArray(data)) {
        setEvents(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
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
    if (!title || !locationText) return

    setSubmitting(true)
    const validImages = imageUrls.filter(url => url.trim() !== '')

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          event_type: eventType,
          location_text: locationText,
          description,
          distance_km: Number(distanceKm || 25),
          max_participants: Number(maxParticipants || 100),
          registration_fee: Number(registrationFee || 0),
          has_registration_form: hasRegistrationForm,
          images: validImages.length > 0 ? validImages : [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800'
          ]
        })
      })

      if (res.ok) {
        setTitle('')
        setLocationText('')
        setDescription('')
        setImageUrls([''])
        setShowModal(false)
        fetchEvents()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegisterEvent = (e: React.FormEvent) => {
    e.preventDefault()
    setRegistered(true)
    setTimeout(() => {
      setRegistered(false)
      setSelectedEvent(null)
    }, 2000)
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">Nepal MTB Events & Races</h1>
          <p className="text-sm text-zinc-600 mt-1">Kathmandu Kora, Enduro stage races, and local group rides.</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)} 
          className="bg-orange-600 hover:bg-orange-700 font-bold rounded-xl flex items-center gap-2 shadow-md shadow-orange-600/20"
        >
          <Plus className="w-4 h-4" /> Create Event
        </Button>
      </div>

      {/* Create Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-zinc-900 mb-1">Create MTB Event</h2>
            <p className="text-xs text-zinc-500 mb-6">Organize races, enduro challenges, or charity group rides.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Event Title</label>
                <Input
                  placeholder="e.g. Ratnange Downhill Challenge 2026"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Event Type</label>
                  <select
                    value={eventType}
                    onChange={e => setEventType(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-zinc-200 bg-white text-sm"
                  >
                    <option value="race">XC Race</option>
                    <option value="enduro">Enduro Stage Race</option>
                    <option value="charity">Charity Ride</option>
                    <option value="festival">MTB Festival</option>
                    <option value="group_ride">Group Ride</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Location</label>
                  <Input
                    placeholder="e.g. Nagarkot, Kathmandu"
                    value={locationText}
                    onChange={e => setLocationText(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Distance (km)</label>
                  <Input
                    placeholder="e.g. 45"
                    type="number"
                    value={distanceKm}
                    onChange={e => setDistanceKm(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Max Riders</label>
                  <Input
                    placeholder="e.g. 150"
                    type="number"
                    value={maxParticipants}
                    onChange={e => setMaxParticipants(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Fee (NPR)</label>
                  <Input
                    placeholder="0 for Free"
                    type="number"
                    value={registrationFee}
                    onChange={e => setRegistrationFee(e.target.value)}
                  />
                </div>
              </div>

              {/* Registration Form Option */}
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-orange-950">Enable Online Rider Registration Form</div>
                  <div className="text-[11px] text-orange-700">Allow riders to register directly with entry form</div>
                </div>
                <input
                  type="checkbox"
                  checked={hasRegistrationForm}
                  onChange={e => setHasRegistrationForm(e.target.checked)}
                  className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Event Description & Rules</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Mandatory gear, start line coordinates, schedule..."
                  className="w-full h-24 p-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600/20 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-2">Banner & Track Images (Up to 5)</label>
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
                    <Plus className="w-3.5 h-3.5" /> Add banner image URL
                  </button>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-orange-600 hover:bg-orange-700 font-bold px-6">
                  {submitting ? 'Publishing...' : 'Publish Event'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Registration Modal for Riders */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button 
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {registered ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="text-xl font-bold text-zinc-900">Registration Confirmed!</h3>
                <p className="text-xs text-zinc-500">Your ticket code has been generated. See you at the start line!</p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-zinc-900 mb-1">{selectedEvent.title}</h2>
                <p className="text-xs text-zinc-500 mb-4">Official Rider Registration Form</p>

                <form onSubmit={handleRegisterEvent} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">Rider Full Name</label>
                    <Input defaultValue={user?.fullName || 'Pasang Sherpa'} required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">Emergency Phone Number</label>
                    <Input placeholder="+977-9800000000" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">Bike Brand & Model</label>
                    <Input placeholder="e.g. Santa Cruz Bronson" required />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 font-bold py-5">
                      Confirm Registration {selectedEvent.registration_fee > 0 ? `(NPR ${selectedEvent.registration_fee})` : '(Free Entry)'}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid of Events */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 rounded-2xl bg-zinc-100 animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border">
          <p className="text-zinc-500 font-medium">No events scheduled.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {events.map(event => (
            <Card key={event.id} className="overflow-hidden border-zinc-200 shadow-sm rounded-2xl flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="relative h-48 bg-zinc-100 overflow-hidden">
                  <img
                    src={(event.images && event.images[0]) || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-orange-600 text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full shadow">
                    {event.event_type}
                  </div>
                </div>

                <CardContent className="p-5">
                  <h3 className="font-bold text-base text-zinc-900 line-clamp-1 mb-1">{event.title}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 mb-4">{event.description}</p>

                  <div className="space-y-1.5 text-xs text-zinc-600 border-t pt-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{event.location_text}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Max {event.max_participants || 100} Riders</span>
                    </div>
                  </div>
                </CardContent>
              </div>

              <div className="p-4 bg-zinc-50 border-t flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900">
                  {event.registration_fee > 0 ? `NPR ${event.registration_fee}` : 'Free Entry'}
                </span>
                {event.has_registration_form ? (
                  <Button 
                    onClick={() => setSelectedEvent(event)} 
                    size="sm" 
                    className="bg-orange-600 hover:bg-orange-700 text-xs font-bold rounded-lg flex items-center gap-1.5"
                  >
                    <Ticket className="w-3.5 h-3.5" /> Register Now
                  </Button>
                ) : (
                  <span className="text-xs text-zinc-400">No Registration Needed</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
