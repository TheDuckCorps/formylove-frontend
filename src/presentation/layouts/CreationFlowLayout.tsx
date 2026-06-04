import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useSiteBuilderStore } from '@/shared/store/siteBuilderStore'

export function CreationFlowLayout() {
  const reset = useSiteBuilderStore((s) => s.reset)

  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  return <Outlet />
}
