import React, { useEffect } from 'react'
import PullToRefresh from 'react-simple-pull-to-refresh'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Capacitor } from '@capacitor/core'
import { useLocation } from 'react-router-dom'

export const RefreshWrapper = ({
  children,
  scrollId = 'main-scroll-container'
}) => {
  const queryClient = useQueryClient()
  const { pathname } = useLocation()

  useEffect(() => {
    const element = document.getElementById(scrollId)
    if (element) {
      element.scrollTop = 0
    }
  }, [pathname, scrollId])

  const handleRefresh = async () => {
    try {
      await queryClient.invalidateQueries()
      await new Promise((resolve) => setTimeout(resolve, 800))
      return true
    } catch (error) {
      console.error('Error al refrescar')
      return false
    }
  }

  const CustomSpinner = (
    <div className='flex justify-center items-center py-6'>
      <Loader2 className='w-8 h-8 animate-spin text-purple-600' />
    </div>
  )

  if (!Capacitor.isNativePlatform()) {
    return (
      <div id={scrollId} className='h-full w-full overflow-y-auto'>
        {children}
      </div>
    )
  }

  return (
    <PullToRefresh
      id={scrollId}
      onRefresh={handleRefresh}
      pullingContent={''}
      refreshingContent={CustomSpinner}
      maxPullDownDistance={95}
      pullDownThreshold={60}
      className='h-full w-full overflow-y-auto'
      backgroundColor='transparent'
    >
      {children}
    </PullToRefresh>
  )
}
