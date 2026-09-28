import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { PostsProvider } from '../hooks/usePosts'
import type { BlogData, Post } from '../types'

const makePost = (id: number, category: string): Post => ({
  id,
  slug: `post-${id}`,
  title: `Post number ${id}`,
  excerpt: id === 7 ? 'about lenses' : 'excerpt',
  content: '## Intro\nHello',
  category,
  author: { name: `Author ${id % 2}`, avatar: '', role: 'Writer' },
  image: '',
  date: '2026-01-01',
  readTime: '5 دقائق',
  featured: id === 1,
  tags: [],
})

const data: BlogData = {
  posts: Array.from({ length: 8 }, (_, i) => makePost(i + 1, i < 5 ? 'طبيعة' : 'شوارع')),
  categories: [
    { name: 'طبيعة', count: 5, color: 'emerald' },
    { name: 'شوارع', count: 3, color: 'purple' },
  ],
  siteInfo: { name: 'عدسة', tagline: '', description: 'desc', email: '', social: {} },
}

function renderAt(path: string, fetchImpl = () => Promise.resolve(new Response(JSON.stringify(data)))) {
  vi.stubGlobal('fetch', vi.fn(fetchImpl))
  return render(
    <MemoryRouter initialEntries={[path]}>
      <PostsProvider>
        <App />
      </PostsProvider>
    </MemoryRouter>,
  )
}

const visibleTitles = () =>
  within(screen.getByTestId('posts'))
    .queryAllByRole('heading', { level: 3 })
    .map((h) => h.textContent)

describe('Blog page', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('loads posts over HTTP and shows the first page of 6', async () => {
    renderAt('/blog')

    expect(screen.getByRole('status')).toHaveTextContent('جاري التحميل')
    expect(await screen.findByText('Post number 1')).toBeInTheDocument()
    expect(visibleTitles()).toHaveLength(6)
    expect(screen.getByText('صفحة 1 من 2')).toBeInTheDocument()
  })

  it('goes to the next page', async () => {
    const user = userEvent.setup()
    renderAt('/blog')
    await screen.findByText('Post number 1')

    await user.click(screen.getByRole('button', { name: 'الصفحة التالية' }))

    expect(visibleTitles()).toEqual(['Post number 7', 'Post number 8'])
  })

  it('filters by category and resets to page 1', async () => {
    const user = userEvent.setup()
    renderAt('/blog')
    await screen.findByText('Post number 1')
    await user.click(screen.getByRole('button', { name: '2' }))

    await user.click(within(document.querySelector('.category-filters') as HTMLElement).getByRole('button', { name: 'شوارع' }))

    expect(visibleTitles()).toEqual(['Post number 6', 'Post number 7', 'Post number 8'])
    expect(screen.queryByText(/صفحة \d من/)).not.toBeInTheDocument()
  })

  it('searches the excerpt and can clear filters', async () => {
    const user = userEvent.setup()
    renderAt('/blog')
    await screen.findByText('Post number 1')

    await user.type(screen.getByLabelText('ابحث في المقالات'), 'LENSES')
    expect(visibleTitles()).toEqual(['Post number 7'])

    await user.click(screen.getByRole('button', { name: /مسح الفلاتر/ }))
    expect(visibleTitles()).toHaveLength(6)
  })

  it('shows an error when the data cannot be loaded', async () => {
    renderAt('/blog', () => Promise.resolve(new Response('nope', { status: 500 })))

    expect(await screen.findByRole('alert')).toHaveTextContent('HTTP 500')
  })
})

describe('Blog details page', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('renders the post with a table of contents', async () => {
    renderAt('/blog/post-3')

    expect(await screen.findByRole('heading', { level: 1, name: 'Post number 3' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '1. Intro' })).toHaveAttribute('href', '#Intro')
  })

  it('shows 404 for an unknown slug', async () => {
    renderAt('/blog/does-not-exist')

    expect(await screen.findByText('عفواً! الصفحة غير موجودة')).toBeInTheDocument()
  })
})
