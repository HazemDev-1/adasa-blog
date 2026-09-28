import type { ReactNode } from 'react'
import { usePosts } from '../hooks/usePosts'
import type { BlogData } from '../types'

/**
 * Shows a loading or error message until the data is ready,
 * then renders the page with the data. Pages don't repeat this logic.
 */
function DataGate({ children }: { children: (data: BlogData) => ReactNode }) {
  const state = usePosts()

  if (state.status === 'loading') {
    return (
      <p className="status-message" role="status">
        جاري التحميل…
      </p>
    )
  }
  if (state.status === 'error') {
    return (
      <p className="status-message error" role="alert">
        تعذر تحميل المقالات ({state.message}). حاول تحديث الصفحة.
      </p>
    )
  }
  return <>{children(state.data)}</>
}

export default DataGate
