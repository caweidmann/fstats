'use client'

import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { initChartJS } from '@/lib/chartjs'

type ChartProviderProps = {
  children: ReactNode
}

const Component = ({ children }: ChartProviderProps) => {
  useEffect(() => {
    initChartJS()
  }, [])

  return <>{children}</>
}

export default Component
