import { Link } from 'react-router-dom'
import { usePosts } from '../hooks/usePosts'

function Footer() {
  const state = usePosts()
  const siteName = state.status === 'ready' ? state.data.siteInfo.name : 'عدسة'

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <h3>{siteName}</h3>
          {state.status === 'ready' && <p>{state.data.siteInfo.description}</p>}
        </div>

        <div className="footer-col">
          <h4>التصنيفات</h4>
          <ul>
            {state.status === 'ready' && state.data.categories.map((cat) => <li key={cat.name}>{cat.name}</li>)}
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
        <p>© 2026 {siteName}. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  )
}

export default Footer
