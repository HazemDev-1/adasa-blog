import { Link } from "react-router-dom";
import postsData from "../data/posts.json";

function Footer() {
  const { siteInfo, categories } = postsData;

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <h3>{siteInfo.name}</h3>
          <p>{siteInfo.description}</p>
        </div>

        <div className="footer-col">
          <h4>التصنيفات</h4>
          <ul>
            {categories.map((cat) => (
              <li key={cat.name}>{cat.name}</li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>روابط سريعة</h4>
          <ul>
            <li>
              <Link to="/">الرئيسية</Link>
            </li>
            <li>
              <Link to="/blog">المدونة</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 {siteInfo.name}. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
}

export default Footer;
