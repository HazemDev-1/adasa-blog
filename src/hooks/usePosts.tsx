import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { BlogData } from '../types'

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: BlogData }

const PostsContext = createContext<State>({ status: 'loading' })

/**
 * Loads the blog data once, over HTTP, and shares it with every page.
 * Before, each page imported the JSON directly (bundled into the JS);
 * fetching it works the same way a real backend API would.
 */
export function PostsProvider({ children, url = '/data/posts.json' }: { children: ReactNode; url?: string }) {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<BlogData>
      })
      .then((data) => setState({ status: 'ready', data }))
      .catch((err: Error) => {
        if (err.name !== 'AbortError') setState({ status: 'error', message: err.message })
      })

    // Cancel the request if the component unmounts (e.g. StrictMode's double render).
    return () => controller.abort()
  }, [url])

  return <PostsContext.Provider value={state}>{children}</PostsContext.Provider>
}

export function usePosts(): State {
  return useContext(PostsContext)
}
