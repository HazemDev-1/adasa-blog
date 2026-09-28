import { useParams, Link } from "react-router-dom";
import postsData from "../data/posts.json";
import NotFound from "./NotFound";

function slugifyHeading(text) {
  return text.trim().replace(/\s+/g, "-");
}

// Splits the post "content" string (markdown-ish, sections separated by
// "## Heading") into an array of { heading, id, paragraphs } sections.
function parseContent(content) {
  const lines = content.split("\n");
  const sections = [];
  let current = { heading: null, id: null, paragraphs: [] };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) {
      if (current.heading || current.paragraphs.length) sections.push(current);
      const heading = trimmed.replace("## ", "");
      current = { heading, id: slugifyHeading(heading), paragraphs: [] };
    } else if (trimmed !== "") {
      current.paragraphs.push(trimmed);
    }
  });
  if (current.heading || current.paragraphs.length) sections.push(current);
  return sections;
}

function BlogDetails() {
  const { slug } = useParams();
  const post = postsData.posts.find((p) => p.slug === slug);

  if (!post) return <NotFound />;

  const sections = parseContent(post.content);
  const tocSections = sections.filter((s) => s.heading);

  return (
    <div className="blog-details-page">
      <section
        className="details-hero"
        style={{ backgroundImage: `url(${post.image})` }}
      >
        <div className="details-hero-overlay">
          <div className="breadcrumb">
            <Link to="/">الرئيسية</Link> ‹ <Link to="/blog">المدونة</Link> ‹{" "}
            {post.category}
          </div>
          <div className="details-meta-row">
            <span className="category-badge">{post.category}</span>
            <span>{post.readTime}</span>
            <span>{post.date}</span>
          </div>
          <h1>{post.title}</h1>
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
            <div key={i} id={section.id || `intro-${i}`}>
              {section.heading && <h2>{section.heading}</h2>}
              {section.paragraphs.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          ))}
        </article>
      </div>
    </div>
  );
}

export default BlogDetails;
