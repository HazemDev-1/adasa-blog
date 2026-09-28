import type { Post } from '../types'

/** The value of the "all categories" filter. */
export const ALL = 'الكل'

export const POSTS_PER_PAGE = 6

/** Keeps posts that match the category and whose title or excerpt contains the query. */
export function filterPosts(posts: Post[], category: string, query: string): Post[] {
  const q = query.trim().toLowerCase()
  return posts.filter(
    (post) =>
      (category === ALL || post.category === category) &&
      (q === '' || post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q)),
  )
}

export interface Page<T> {
  items: T[]
  page: number
  totalPages: number
}

/** Returns one page of items. An out-of-range page is clamped to the last valid page. */
export function paginate<T>(items: T[], page: number, perPage = POSTS_PER_PAGE): Page<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage))
  const safePage = Math.min(Math.max(1, page), totalPages)
  return {
    items: items.slice((safePage - 1) * perPage, safePage * perPage),
    page: safePage,
    totalPages,
  }
}

export function slugifyHeading(text: string): string {
  return text.trim().replace(/\s+/g, '-')
}

export interface Section {
  heading: string | null
  id: string | null
  paragraphs: string[]
}

/**
 * Splits a post's content (sections start with "## Heading") into
 * { heading, id, paragraphs } blocks, used for the article body and its table of contents.
 */
export function parseContent(content: string): Section[] {
  const sections: Section[] = []
  let current: Section = { heading: null, id: null, paragraphs: [] }

  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (trimmed.startsWith('## ')) {
      if (current.heading || current.paragraphs.length) sections.push(current)
      const heading = trimmed.slice(3)
      current = { heading, id: slugifyHeading(heading), paragraphs: [] }
    } else if (trimmed !== '') {
      current.paragraphs.push(trimmed)
    }
  }
  if (current.heading || current.paragraphs.length) sections.push(current)
  return sections
}
