import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">◎</span>
          <div className="logo-text">
            <strong>عدسة</strong>
            <small>عالم التصوير الفوتوغرافي</small>
          </div>
        </Link>
        <ul className="navbar-links">
          <li>
            <Link to="/">الرئيسية</Link>
          </li>
          <li>
            <Link to="/blog">المدونة</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
