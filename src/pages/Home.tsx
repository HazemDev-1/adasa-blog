import { Link } from 'react-router-dom'
import DataGate from '../components/DataGate'
import { AuthorLine, PostLink } from '../components/PostParts'

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <span className="hero-badge">مرحباً بك في عدسة</span>
        <h1>
          اكتشف <span className="highlight">فن</span>
          <br />
          التصوير الفوتوغرافي
        </h1>
        <p>انغمس في أسرار المحترفين ونصائح عملية لتطوير مهاراتك في التصوير.</p>
        <div className="hero-actions">
          <Link to="/blog" className="btn btn-primary">
            استكشف المقالات
          </Link>
        </div>
      </section>

      <DataGate>
        {({ posts, categories }) => {
          const featuredPosts = posts.filter((p) => p.featured)
          const authorsCount = new Set(posts.map((p) => p.author.name)).size

          return (
            <>
              <section className="stats-bar">
                <div className="stat-card">
                  <strong>{authorsCount}</strong>
                  <span>كاتب</span>
                </div>
                <div className="stat-card">
                  <strong>{categories.length}</strong>
                  <span>تصنيفات</span>
                </div>
                <div className="stat-card">
                  <strong>+10 ألف</strong>
                  <span>قارئ</span>
                </div>
                <div className="stat-card">
                  <strong>{posts.length}+</strong>
                  <span>مقالة</span>
                </div>
              </section>

              <section className="featured-section">
                <span className="section-badge">مميز</span>
                <h2>مقالات مختارة</h2>
                <p>محتوى منتقى ليبدء رحلة تعلمك</p>

                <div className="featured-list">
                  {featuredPosts.map((post, index) => (
                    <article key={post.id} className={`featured-card ${index % 2 === 1 ? 'reverse' : ''}`}>
                      <img src={post.image} alt={post.title} />
                      <div className="featured-content">
                        <span className="category-badge">{post.category}</span>
                        <h3>
                          <PostLink slug={post.slug}>{post.title}</PostLink>
                        </h3>
                        <p>{post.excerpt}</p>
                        <AuthorLine author={post.author} subtitle={post.date} />
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )
        }}
      </DataGate>
    </div>
  )
}

export default Home
