import { ALL, filterPosts, paginate, parseContent, slugifyHeading } from './posts'
import type { Post } from '../types'

const post = (id: number, title: string, category: string, excerpt = ''): Post => ({
  id,
  slug: `post-${id}`,
  title,
  excerpt,
  content: '',
  category,
  author: { name: 'A', avatar: '', role: '' },
  image: '',
  date: '2026-01-01',
  readTime: '5',
  featured: false,
  tags: [],
})

const posts = [
  post(1, 'Golden hour tips', 'طبيعة', 'light at sunset'),
  post(2, 'Street photography', 'شوارع'),
  post(3, 'Portrait lighting', 'بورتريه', 'soft golden light'),
]

describe('filterPosts', () => {
  it('returns everything for the "all" category and an empty query', () => {
    expect(filterPosts(posts, ALL, '')).toHaveLength(3)
  })

  it('filters by category', () => {
    expect(filterPosts(posts, 'شوارع', '').map((p) => p.id)).toEqual([2])
  })

  it('searches title and excerpt, ignoring case and surrounding spaces', () => {
    expect(filterPosts(posts, ALL, '  GOLDEN ').map((p) => p.id)).toEqual([1, 3])
  })

  it('combines category and search', () => {
    expect(filterPosts(posts, 'بورتريه', 'golden').map((p) => p.id)).toEqual([3])
  })
})

describe('paginate', () => {
  const items = Array.from({ length: 13 }, (_, i) => i + 1)

  it('splits into pages of 6', () => {
    expect(paginate(items, 1)).toEqual({ items: [1, 2, 3, 4, 5, 6], page: 1, totalPages: 3 })
    expect(paginate(items, 3).items).toEqual([13])
  })

  it('clamps a page that is out of range', () => {
    expect(paginate(items, 99).page).toBe(3)
    expect(paginate(items, 0).page).toBe(1)
  })

  it('always has at least one page', () => {
    expect(paginate([], 1)).toEqual({ items: [], page: 1, totalPages: 1 })
  })
})

describe('parseContent', () => {
  it('splits content into an intro and headed sections', () => {
    const sections = parseContent('Intro line\n\n## First part\nA\nB\n## Second part\nC')

    expect(sections).toEqual([
      { heading: null, id: null, paragraphs: ['Intro line'] },
      { heading: 'First part', id: 'First-part', paragraphs: ['A', 'B'] },
      { heading: 'Second part', id: 'Second-part', paragraphs: ['C'] },
    ])
  })

  it('returns nothing for empty content', () => {
    expect(parseContent('\n  \n')).toEqual([])
  })

  it('slugifies headings with spaces, including Arabic', () => {
    expect(slugifyHeading('  إعدادات   الكاميرا ')).toBe('إعدادات-الكاميرا')
  })
})
