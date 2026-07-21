'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ImagePlus, MessageSquare, Heart, Share2, Send, Plus, X } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface Post {
  id: string
  content: string
  author_name: string
  author_avatar: string
  author_role: string
  images: string[]
  created_at: string
}

export default function CommunityPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [content, setContent] = useState('')
  const [imageUrls, setImageUrls] = useState<string[]>([''])
  const [submitting, setSubmitting] = useState(false)

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts')
      const data = await res.json()
      if (Array.isArray(data)) {
        setPosts(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
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
    if (!content.trim()) return

    setSubmitting(true)
    const validImages = imageUrls.filter(url => url.trim() !== '')

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          author_name: user?.fullName || 'Community Rider',
          author_avatar: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
          author_role: user?.role || 'rider',
          images: validImages.length > 0 ? validImages : [
            'https://images.unsplash.com/photo-1544191696-102ab03d4c01?q=80&w=800'
          ]
        })
      })

      if (res.ok) {
        setContent('')
        setImageUrls([''])
        setShowCreateModal(false)
        fetchPosts()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container py-8 max-w-3xl mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">Nepal MTB Community</h1>
          <p className="text-sm text-zinc-600 mt-1">Connect with riders, report trail conditions, and share trail photos.</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)} 
          className="bg-orange-600 hover:bg-orange-700 font-bold rounded-xl flex items-center gap-2 shadow-md shadow-orange-600/20"
        >
          <Plus className="w-4 h-4" /> Share Ride / Post
        </Button>
      </div>

      {/* Post Creation Modal / Box */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button 
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-zinc-900 mb-4">Create Community Post</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Share trail conditions, ride updates, or ask the community..."
                  className="w-full h-32 p-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600/20 resize-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-2">Photo URLs (Up to 5)</label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
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
                    <Plus className="w-3.5 h-3.5" /> Add another photo URL
                  </button>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-orange-600 hover:bg-orange-700 font-bold px-6">
                  {submitting ? 'Publishing...' : 'Publish Post'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feed List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-zinc-100 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border">
          <p className="text-zinc-500 font-medium">No posts yet. Be the first to share a post!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <Card key={post.id} className="overflow-hidden border-zinc-200 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'}
                      alt={post.author_name}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                    />
                    <div>
                      <div className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                        {post.author_name}
                        <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-semibold capitalize">
                          {post.author_role || 'rider'}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400">
                        {new Date(post.created_at).toLocaleDateString()} • Kathmandu Rim
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-zinc-800 text-sm leading-relaxed mb-4">{post.content}</p>

                {/* Images Gallery */}
                {post.images && post.images.length > 0 && (
                  <div className={`grid gap-2 mb-4 rounded-xl overflow-hidden ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {post.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Community ride"
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ))}
                  </div>
                )}

                {/* Interaction Footer */}
                <div className="flex items-center gap-6 border-t pt-4 text-xs font-semibold text-zinc-500">
                  <button className="flex items-center gap-1.5 hover:text-red-600 transition-colors">
                    <Heart className="w-4 h-4" /> Like
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-orange-600 transition-colors">
                    <MessageSquare className="w-4 h-4" /> Comment
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-zinc-900 transition-colors">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
