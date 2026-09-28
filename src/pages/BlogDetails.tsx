import { Link, useParams } from 'react-router-dom'
import DataGate from '../components/DataGate'
import { AuthorLine } from '../components/PostParts'
import { parseContent } from '../lib/posts'
import NotFound from './NotFound'

function BlogDetails() {
  const { slug } = useParams()

  return (
    <DataGate>
      {({ posts }) => {
        const post = posts.find((p) => p.slug === slug)
        if (!post) return <NotFound />

        const sections = parseContent(post.content)
        const tocSections = sections.filter((s) => s.heading)

        return (
          <div className="blog-details-page">
            <section className="details-hero" style={{ backgroundImage: `url(${post.image})` }}>
              <div className="details-hero-overlay">
                <div className="breadcrumb">
                  <Link to="/">الرئيسية</Link> ‹ <Link to="/blog">المدونة</Link> ‹ {post.category}
                </div>
                <div className="details-meta-row">
                  <span className="category-badge">{post.category}</span>
                  <span>{post.readTime}</span>
                  <span>{post.date}</span>
                </div>
                <h1>{post.title}</h1>
                <AuthorLine author={post.author} subtitle={post.author.role} />
              </div>
            </section>

            <div className="details-body">
              {tocSections.length > 0 && (
                <aside className="details-toc">
                  <h4>محتويات المقال</h4>
                  <ol>
                    {tocSections.map((section, i) => (
                      <li key={section.id}>
                        <a href={`#${section.id}`}>
                          {i + 1}. {section.heading}
                        </a>
                      </li>
                    ))}
                  </ol>
                </aside>
              )}

              <article className="details-content">
                {sections.map((section, i) => (
                  <div key={i} id={section.id ?? `intro-${i}`}>
                    {section.heading && <h2>{section.heading}</h2>}
                    {section.paragraphs.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                ))}
              </article>
            </div>
          </div>
        )
      }}
    </DataGate>
  )
}

export default BlogDetails
