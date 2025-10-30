'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'

interface StreakInfo {
  currentStreak: number
  checkedInToday: boolean
  nextStreakBonus?: number
}

export default function DailyCheckIn() {
  const { data: session } = useSession()
  const [streakInfo, setStreakInfo] = useState<StreakInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (session?.user) {
      fetchStreakInfo()
    }
  }, [session])

  const fetchStreakInfo = async () => {
    try {
      const response = await fetch('/api/points/stats')
      if (response.ok) {
        const data = await response.json()
        setStreakInfo(data.data.streak)
      }
    } catch (error) {
      console.error('Error fetching streak info:', error)
    }
  }

  const handleCheckIn = async () => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/points/check-in', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        setMessage(data.data.message)
        await fetchStreakInfo()

        // Auto-hide success message after 5 seconds
        setTimeout(() => setMessage(''), 5000)
      } else {
        setMessage(data.message || 'Already checked in today!')
      }
    } catch (error) {
      console.error('Error checking in:', error)
      setMessage('Failed to check in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!session?.user) {
    return null
  }

  const isDisabled = loading || streakInfo?.checkedInToday

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleCheckIn}
        disabled={isDisabled}
        className="relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          '...'
        ) : streakInfo?.checkedInToday ? (
          <>
            ✓ Checked In Today
          </>
        ) : (
          <>
            🎯 Daily Check-In
          </>
        )}
      </Button>

      {streakInfo && (
        <div className="text-xs text-center text-gray-600 dark:text-gray-400">
          {streakInfo.currentStreak > 0 ? (
            <>
              🔥 {streakInfo.currentStreak} day streak!
              {streakInfo.nextStreakBonus && (
                <span className="ml-1 text-amber-600 dark:text-amber-400">
                  (Next bonus at {streakInfo.nextStreakBonus} days)
                </span>
              )}
            </>
          ) : (
            'Start your streak today!'
          )}
        </div>
      )}

      {message && (
        <div className={`text-sm text-center p-2 rounded ${
          message.includes('🎉') || message.includes('Earned')
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
        }`}>
          {message}
        </div>
      )}
    </div>
  )
}
