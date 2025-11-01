"use client"

import { useState, useEffect } from 'react'
import { Bell, MessageSquare, Heart, UserPlus, Gift } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

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

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [viewedNotifications, setViewedNotifications] = useState<Set<string>>(new Set())
  const router = useRouter()

  useEffect(() => {
    // Load viewed notifications from localStorage first
    const viewed = localStorage.getItem('viewedNotifications')
    if (viewed) {
      try {
        const viewedSet = new Set(JSON.parse(viewed))
        setViewedNotifications(viewedSet)
        // Fetch notifications after loading viewed ones
        fetchNotifications(viewedSet)
      } catch (e) {
        console.error('Error loading viewed notifications:', e)
        fetchNotifications(new Set())
      }
    } else {
      fetchNotifications(new Set())
    }
  }, [])

  useEffect(() => {
    // Save viewed notifications to localStorage
    if (viewedNotifications.size > 0) {
      localStorage.setItem('viewedNotifications', JSON.stringify(Array.from(viewedNotifications)))
    }
    // Recalculate unread count when viewed notifications change
    const unread = notifications.filter((n: Notification) => 
      !n.isRead && !viewedNotifications.has(n.id)
    ).length
    setUnreadCount(unread)
  }, [viewedNotifications, notifications])

  const fetchNotifications = async (viewedSet: Set<string> = viewedNotifications) => {
    setLoading(true)
    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
        // Calculate unread count excluding viewed notifications
        const unread = data.notifications.filter((n: Notification) => 
          !n.isRead && !viewedSet.has(n.id)
        ).length
        setUnreadCount(unread)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      // When popover opens, mark all current notifications as viewed
      const currentNotificationIds = new Set(notifications.map(n => n.id))
      setViewedNotifications(prev => {
        const updated = new Set(prev)
        currentNotificationIds.forEach(id => updated.add(id))
        return updated
      })
      // Reset badge count
      setUnreadCount(0)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    // Mark this notification as viewed
    setViewedNotifications(prev => new Set(prev).add(notification.id))
    
    // Navigate to the notification's destination
    router.push(notification.href)
    
    // Close the popover
    setIsOpen(false)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-green-500" />
      case 'follow':
        return <UserPlus className="h-4 w-4 text-purple-500" />
      case 'points':
        return <Gift className="h-4 w-4 text-amber-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-accent transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const isUnread = !notification.isRead && !viewedNotifications.has(notification.id)
                return (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`block w-full text-left p-4 hover:bg-accent transition-colors ${
                      isUnread ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {notification.avatar ? (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={notification.avatar} />
                            <AvatarFallback>
                              {getNotificationIcon(notification.type)}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {isUnread && (
                        <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Link
              href="/notifications"
              className="block text-center text-sm text-primary hover:underline py-2"
              onClick={() => setIsOpen(false)}
            >
              View all notifications
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}



