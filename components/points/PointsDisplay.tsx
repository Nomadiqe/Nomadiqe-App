'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/components/providers/supabase-auth-provider'

interface PointsBalance {
  totalPoints: number
  currentPoints: number
  lifetimeEarned: number
  lifetimeRedeemed: number
}

export default function PointsDisplay() {
  const { user } = useSupabase()
  const [balance, setBalance] = useState<PointsBalance | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchBalance()
    }
  }, [user])

  const fetchBalance = async () => {
    try {
      const response = await fetch('/api/points/balance')
      if (response.ok) {
        const data = await response.json()
        setBalance(data.data)
      }
    } catch (error) {
      console.error('Error fetching points balance:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user || loading) {
    return null
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20 rounded-lg border border-amber-200 dark:border-amber-700">
      <div className="flex items-center gap-1.5">
        {/* Animated Coin */}
        <div 
          className="relative w-6 h-6"
          style={{ perspective: '1000px' }}
        >
          <div 
            className="relative w-full h-full animate-coin-spin"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front side - Euro */}
            <div 
              className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg border-2 border-amber-700"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <span className="text-sm font-bold text-white">€</span>
            </div>
            {/* Back side - Dollar */}
            <div 
              className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg border-2 border-green-700"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <span className="text-sm font-bold text-white">$</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-amber-900 dark:text-amber-100">
            {balance?.currentPoints.toLocaleString() || 0}
          </span>
          <span className="text-[10px] text-amber-700 dark:text-amber-300">
            points
          </span>
        </div>
      </div>
    </div>
  )
}
