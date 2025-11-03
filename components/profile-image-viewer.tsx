'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProfileImageViewerProps {
  imageUrl: string
  userName: string
}

export function ProfileImageViewer({ imageUrl, userName }: ProfileImageViewerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [swipeStartY, setSwipeStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleTouchStart = (e: React.TouchEvent) => {
    setSwipeStartY(e.touches[0].clientY)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const deltaY = e.touches[0].clientY - swipeStartY
    if (deltaY > 0) {
      setCurrentY(deltaY)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    if (currentY > 100) {
      setIsOpen(false)
    }
    setCurrentY(0)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setSwipeStartY(e.clientY)
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const deltaY = e.clientY - swipeStartY
    if (deltaY > 0) {
      setCurrentY(deltaY)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (currentY > 100) {
      setIsOpen(false)
    }
    setCurrentY(0)
  }

  return (
    <>
      {/* Trigger - Profile Image */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative cursor-pointer focus:outline-none"
      >
        <img
          src={imageUrl}
          alt={userName}
          className="w-40 h-40 rounded-full object-cover bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-700 shadow-lg"
        />
      </button>

      {/* Full Screen Viewer */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center"
          style={{
            transform: `translateY(${currentY}px)`,
            opacity: Math.max(0.3, 1 - currentY / 500),
            transition: isDragging ? 'none' : 'all 0.3s ease-out'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Close Button */}
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full z-10"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Swipe Indicator */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/30 rounded-full"></div>

          {/* Image Container */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <div className="relative max-w-2xl max-h-[90vh]">
              <img
                src={imageUrl}
                alt={userName}
                className="relative w-full h-full object-contain rounded-2xl shadow-2xl"
                style={{
                  maxHeight: '90vh'
                }}
              />
            </div>
          </div>

          {/* Hint Text */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            Swipe down to close
          </div>
        </div>
      )}
    </>
  )
}

