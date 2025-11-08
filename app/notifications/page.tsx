"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, MessageSquare, Heart, UserPlus, Gift, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { BackButton } from '@/components/back-button'
import { formatDistanceToNow } from 'date-fns'
import { it } from 'date-fns/locale'

interface Notification {
  id: string
  type: 'message' | 'like' | 'comment' | 'follow' | 'points'
  title: string
  message: string
  avatar?: string
  href: string
  createdAt: string
  isRead: boolean
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const observerTarget = useRef<HTMLDivElement>(null)

  // Fetch initial notifications
  useEffect(() => {
    fetchNotifications(1)
  }, [])

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreNotifications()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loadingMore, page])

  const fetchNotifications = async (pageNum: number) => {
    try {
      if (pageNum === 1) setLoading(true)
      else setLoadingMore(true)

      const response = await fetch(`/api/notifications?page=${pageNum}&limit=20`)
      if (response.ok) {
        const data = await response.json()
        const newNotifications = data.notifications || []
        
        if (pageNum === 1) {
          setNotifications(newNotifications)
        } else {
          setNotifications(prev => [...prev, ...newNotifications])
        }

        // Check if there are more notifications
        setHasMore(newNotifications.length === 20)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMoreNotifications = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchNotifications(nextPage)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
      case 'comment':
        return <MessageSquare className="h-5 w-5" />
      case 'like':
        return <Heart className="h-5 w-5 fill-current" />
      case 'follow':
        return <UserPlus className="h-5 w-5" />
      case 'points':
        return <Gift className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'message':
      case 'comment':
        return 'bg-blue-500'
      case 'like':
        return 'bg-red-500'
      case 'follow':
        return 'bg-green-500'
      case 'points':
        return 'bg-orange-500'
      default:
        return 'bg-primary'
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read in localStorage
    const viewed = localStorage.getItem('viewedNotifications')
    const viewedSet = viewed ? new Set(JSON.parse(viewed)) : new Set()
    viewedSet.add(notification.id)
    localStorage.setItem('viewedNotifications', JSON.stringify(Array.from(viewedSet)))
    
    // Navigate to destination
    router.push(notification.href)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="mb-4">
            <BackButton />
          </div>
          <h1 className="text-3xl font-bold mb-6">Notifiche</h1>
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Notifiche</h1>
          <p className="text-muted-foreground mt-1">
            {notifications.length === 0 
              ? 'Nessuna notifica' 
              : `${notifications.length} notific${notifications.length === 1 ? 'a' : 'he'}`
            }
          </p>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nessuna Notifica</h3>
              <p className="text-muted-foreground">
                Le tue notifiche appariranno qui
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const isUnread = !notification.isRead
              const IconComponent = getNotificationIcon(notification.type)
              const iconColor = getNotificationColor(notification.type)

              return (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left hover:bg-accent transition-colors rounded-lg ${
                    isUnread ? 'bg-primary/5' : ''
                  }`}
                >
                  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {notification.avatar ? (
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src={notification.avatar} />
                            <AvatarFallback>
                              <div className={`w-full h-full ${iconColor} text-white flex items-center justify-center`}>
                                {IconComponent}
                              </div>
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className={`h-10 w-10 rounded-full ${iconColor} text-white flex items-center justify-center flex-shrink-0`}>
                            {IconComponent}
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground">
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: it })}
                          </p>
                        </div>
                        {isUnread && (
                          <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </button>
              )
            })}

            {/* Infinite Scroll Trigger */}
            {hasMore && (
              <div ref={observerTarget} className="py-8 flex justify-center">
                {loadingMore && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm">Caricamento notifiche...</span>
                  </div>
                )}
              </div>
            )}

            {!hasMore && notifications.length > 0 && (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Hai visualizzato tutte le notifiche
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

