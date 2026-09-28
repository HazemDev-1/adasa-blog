import { useMemo, useState, type ChangeEvent } from 'react'
import DataGate from '../components/DataGate'
import { AuthorLine, PostLink } from '../components/PostParts'
import { ALL, filterPosts, paginate } from '../lib/posts'
import type { BlogData } from '../types'

type ViewMode = 'grid' | 'list'

function Blog() {
  return (
    <div className="blog-page">
      <section className="blog-hero">
        <span className="hero-badge">مدونتنا</span>
        <h1>استكشف مقالاتنا</h1>
        <p>اكتشف الدروس والرؤى وأفضل الممارسات للتطوير الحديث</p>
      </section>

      <DataGate>{(data) => <PostBrowser data={data} />}</DataGate>
    </div>
  )
}

/** Search, category filter, grid/list toggle and pagination over the loaded posts. */
export function PostBrowser({ data }: { data: BlogData }) {
  const { posts, categories } = data

  const [activeCategory, setActiveCategory] = useState(ALL)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredPosts = useMemo(
    () => filterPosts(posts, activeCategory, searchQuery),
    [posts, activeCategory, searchQuery],
  )
  const { items: paginatedPosts, page, totalPages } = paginate(filteredPosts, currentPage)

  // Any filter change sends the user back to page 1.
  function handleCategoryClick(name: string) {
    setActiveCategory(name)
    setCurrentPage(1)
  }

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  function clearFilters() {
    setActiveCategory(ALL)
    setSearchQuery('')
    setCurrentPage(1)
  }

  const hasActiveFilters = activeCategory !== ALL || searchQuery !== ''

  return (
    <>
      <div className="blog-toolbar">
        <div className="category-filters">
          <button className={activeCategory === ALL ? 'active' : ''} onClick={() => handleCategoryClick(ALL)}>
            جميع المقالات
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={activeCategory === cat.name ? 'active' : ''}
              onClick={() => handleCategoryClick(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="ابحث في المقالات..."
            aria-label="ابحث في المقالات"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="blog-controls-row">
        <div className="view-toggle">
          <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')} aria-label="عرض قائمة">
            ☰
          </button>
          <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')} aria-label="عرض شبكي">
            ▦
          </button>
        </div>

        <div className="results-info">
          {hasActiveFilters && (
            <button className="clear-filters" onClick={clearFilters}>
              مسح الفلاتر ✕
            </button>
          )}
          <span>عرض {filteredPosts.length} مقالات</span>
        </div>
      </div>

      <div className={`posts-container ${viewMode}`} data-testid="posts">
        {paginatedPosts.map((post) => (
          <article key={post.id} className="post-card">
            <div className="post-card-image">
              <img src={post.image} alt={post.title} />
              <span className="category-badge">{post.category}</span>
            </div>
            <div className="post-card-content">
              <div className="post-meta-row">
                <span>{post.readTime}</span>
                <span>{post.date}</span>
              </div>
              <h3>
                <PostLink slug={post.slug}>{post.title}</PostLink>
              </h3>
              <p>{post.excerpt}</p>
              <AuthorLine author={post.author} subtitle={post.author.role} />
              <PostLink slug={post.slug} className="read-more">
                اقرأ المقال ←
              </PostLink>
            </div>
          </article>
        ))}

        {paginatedPosts.length === 0 && <p className="no-results">لا توجد مقالات تطابق بحثك.</p>}
      </div>

      {totalPages > 1 && (
        <>
          <nav className="pagination" aria-label="pagination">
            <button disabled={page === 1} onClick={() => setCurrentPage(page - 1)} aria-label="الصفحة السابقة">
              ›
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={num === page ? 'active' : ''}
                aria-current={num === page ? 'page' : undefined}
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setCurrentPage(page + 1)} aria-label="الصفحة التالية">
              ‹
            </button>
          </nav>
          <p className="pagination-info">
            صفحة {page} من {totalPages}
          </p>
        </>
      )}
    </>
  )
}

export default Blog
