'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Wallet, Calendar, Heart, MapPin, TrendingUp, Plus, Search } from 'lucide-react'
import Link from 'next/link'
import PointsDisplay from '@/components/points/PointsDisplay'
import DailyCheckIn from '@/components/points/DailyCheckIn'

interface WalletDialogProps {
  userRole: string
  userName: string
}

export function WalletDialog({ userRole, userName }: WalletDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isHost = userRole === 'HOST'
  const isTraveler = ['GUEST', 'TRAVELER'].includes(userRole)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full max-w-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg px-4 py-2.5 font-medium transition-all shadow-lg hover:shadow-xl"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-800/95 border border-blue-400/30 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Welcome back, {userName}!
          </DialogTitle>
          <p className="text-gray-300 text-sm mt-2">
            {isHost ? 'Manage your properties and bookings' : 'Discover your next adventure'}
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Points and Daily Check-in */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-3 flex-wrap">
              <PointsDisplay />
              <DailyCheckIn />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/50 border border-blue-400/20 rounded-lg p-4">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-blue-400" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-300">
                    {isHost ? 'Active Bookings' : 'Upcoming Trips'}
                  </p>
                  <p className="text-xl font-bold text-white">0</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/50 border border-blue-400/20 rounded-lg p-4">
              <div className="flex items-center">
                <Heart className="h-6 w-6 text-red-400" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-300">
                    {isHost ? 'Property Views' : 'Saved Properties'}
                  </p>
                  <p className="text-xl font-bold text-white">0</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/50 border border-blue-400/20 rounded-lg p-4">
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-green-400" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-300">
                    {isHost ? 'Properties Listed' : 'Places Visited'}
                  </p>
                  <p className="text-xl font-bold text-white">0</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/50 border border-blue-400/20 rounded-lg p-4">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-cyan-400" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-300">
                    {isHost ? 'Total Earnings' : 'Total Saved'}
                  </p>
                  <p className="text-xl font-bold text-white">€0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-700/50 border border-blue-400/20 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {isTraveler && (
                <>
                  <Button 
                    asChild 
                    className="w-full justify-start bg-pink-500 hover:bg-pink-600 text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/search">
                      <MapPin className="w-4 h-4 mr-2" />
                      Search Properties
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    variant="outline" 
                    className="w-full justify-start bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/host">
                      <Plus className="w-4 h-4 mr-2" />
                      Become a Host
                    </Link>
                  </Button>
                </>
              )}
              
              {isHost && (
                <>
                  <Button 
                    asChild 
                    className="w-full justify-start bg-pink-500 hover:bg-pink-600 text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/host/create-property">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Property
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    variant="outline" 
                    className="w-full justify-start bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/search">
                      <Search className="w-4 h-4 mr-2" />
                      Browse Properties
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

