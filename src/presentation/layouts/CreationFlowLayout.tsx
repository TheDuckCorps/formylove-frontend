import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useSiteBuilderStore, BUILDER_STORAGE_KEY } from '@/shared/store/siteBuilderStore'
import { FlowPageShell } from '@/presentation/components/layout/FlowPageShell'

export function CreationFlowLayout() {
  const reset = useSiteBuilderStore((s) => s.reset)

  useEffect(() => {
    return () => {
      reset()
      localStorage.removeItem(BUILDER_STORAGE_KEY)
    }
  }, [reset])

  return (
    <FlowPageShell>
      <Outlet />
    </FlowPageShell>
  )
}
