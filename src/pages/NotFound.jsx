import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <div className="not-found-icon">☹</div>
      <h2>عفواً! الصفحة غير موجودة</h2>
      <p>الصفحة التي تبحث عنها غير موجودة أو تم نقلها. دعنا نعيدك إلى المسار الصحيح.</p>
      <div className="not-found-actions">
        <Link to="/blog" className="btn btn-outline">
          تصفح المقالات
        </Link>
        <Link to="/" className="btn btn-primary">
          الذهاب للرئيسية
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
