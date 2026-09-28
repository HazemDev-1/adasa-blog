import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import postsData from "../data/posts.json";

const POSTS_PER_PAGE = 6;

function Blog() {
  const { posts, categories } = postsData;

  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === "الكل" || post.category === activeCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  );
  const safePage = Math.min(currentPage, totalPages);
  const paginatedPosts = filteredPosts.slice(
    (safePage - 1) * POSTS_PER_PAGE,
    safePage * POSTS_PER_PAGE
  );

  function handleCategoryClick(name) {
    setActiveCategory(name);
    setCurrentPage(1);
  }

  function handleSearchChange(e) {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }

  function clearFilters() {
    setActiveCategory("الكل");
    setSearchQuery("");
    setCurrentPage(1);
  }

  const hasActiveFilters = activeCategory !== "الكل" || searchQuery !== "";

  return (
    <div className="blog-page">
      <section className="blog-hero">
        <span className="hero-badge">مدونتنا</span>
        <h1>استكشف مقالاتنا</h1>
        <p>اكتشف الدروس والرؤى وأفضل الممارسات للتطوير الحديث</p>
      </section>

      <div className="blog-toolbar">
        <div className="category-filters">
          <button
            className={activeCategory === "الكل" ? "active" : ""}
            onClick={() => handleCategoryClick("الكل")}
          >
            جميع المقالات
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={activeCategory === cat.name ? "active" : ""}
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
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="blog-controls-row">
        <div className="view-toggle">
          <button
            className={viewMode === "list" ? "active" : ""}
            onClick={() => setViewMode("list")}
            aria-label="عرض قائمة"
          >
            ☰
          </button>
          <button
            className={viewMode === "grid" ? "active" : ""}
            onClick={() => setViewMode("grid")}
            aria-label="عرض شبكي"
          >
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

      <div className={`posts-container ${viewMode}`}>
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
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              <p>{post.excerpt}</p>
              <div className="post-meta">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="author-avatar"
                />
                <div>
                  <strong>{post.author.name}</strong>
                  <small>{post.author.role}</small>
                </div>
              </div>
              <Link to={`/blog/${post.slug}`} className="read-more">
                اقرأ المقال ←
              </Link>
            </div>
          </article>
        ))}

        {paginatedPosts.length === 0 && (
          <p className="no-results">لا توجد مقالات تطابق بحثك.</p>
        )}
      </div>

      {totalPages > 1 && (
        <nav className="pagination" aria-label="pagination">
          <button
            disabled={safePage === 1}
            onClick={() => setCurrentPage(safePage - 1)}
          >
            ›
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={num === safePage ? "active" : ""}
              onClick={() => setCurrentPage(num)}
            >
              {num}
            </button>
          ))}
          <button
            disabled={safePage === totalPages}
            onClick={() => setCurrentPage(safePage + 1)}
          >
            ‹
          </button>
        </nav>
      )}
      {totalPages > 1 && (
        <p className="pagination-info">
          صفحة {safePage} من {totalPages}
        </p>
      )}
    </div>
  );
}

export default Blog;
