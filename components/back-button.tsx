"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  label?: string
  variant?: 'ghost' | 'outline' | 'default'
  size?: 'sm' | 'default' | 'lg'
  className?: string
  icon?: 'chevron' | 'arrow'
}

export function BackButton({ 
  label = 'Indietro', 
  variant = 'ghost', 
  size = 'sm',
  className = '',
  icon = 'chevron'
}: BackButtonProps) {
  const router = useRouter()
  
  const Icon = icon === 'chevron' ? ChevronLeft : ArrowLeft

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={() => router.back()}
      className={className}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </Button>
  )
}

