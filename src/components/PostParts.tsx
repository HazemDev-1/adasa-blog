import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Author } from '../types'

/** Avatar + name + a second line (role or date). Used by every post card. */
export function AuthorLine({ author, subtitle }: { author: Author; subtitle: string }) {
  return (
    <div className="post-meta">
      <img src={author.avatar} alt={author.name} className="author-avatar" />
      <div>
        <strong>{author.name}</strong>
        <small>{subtitle}</small>
      </div>
    </div>
  )
}

export function PostLink({ slug, children, className }: { slug: string; children: ReactNode; className?: string }) {
  return (
    <Link to={`/blog/${slug}`} className={className}>
      {children}
    </Link>
  )
}
