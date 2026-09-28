// Shapes of the data in public/data/posts.json.

export interface Author {
  name: string
  avatar: string
  role: string
}

export interface Post {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  author: Author
  image: string
  date: string
  readTime: string
  featured: boolean
  tags: string[]
}

export interface Category {
  name: string
  count: number
  color: string
}

export interface SiteInfo {
  name: string
  tagline: string
  description: string
  email: string
  social: Record<string, string>
}

export interface BlogData {
  posts: Post[]
  categories: Category[]
  siteInfo: SiteInfo
}
