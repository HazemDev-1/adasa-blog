# مذكرة مراجعة - Adasa (Assignment 14)

## 1. بنية المشروع (Routing)

`src/main.jsx` بيلف الـ `<App />` بـ `<BrowserRouter>` — ده اللي بيخلي React
Router يقدر يقرا ويغيّر الـ URL من غير ما الصفحة تعمل reload كامل.

`src/App.jsx` فيه `<Routes>` و `<Route>`:
```jsx
<Route path="/" element={<Home />} />
<Route path="/blog" element={<Blog />} />
<Route path="/blog/:slug" element={<BlogDetails />} />
<Route path="*" element={<NotFound />} />
```
- `:slug` معناها "باراميتر ديناميكي" — أي حاجة تيجي بعد `/blog/` هتتحط في
  متغير اسمه `slug`.
- `*` معناها "أي مسار تاني مش متعرّف" → يودّي لصفحة 404.

## 2. إزاي البيانات بتتقرا

مفيش API حقيقي. `src/data/posts.json` هو الـ "backend المزيف". بنعمله
import عادي زي أي ملف JS:
```jsx
import postsData from "../data/posts.json";
const { posts, categories, siteInfo } = postsData;
```

## 3. صفحة Blog — الأهم في التاسك

فيها 4 حالات (state) بـ `useState`:
- `activeCategory` — التصنيف المختار
- `searchQuery` — نص البحث
- `viewMode` — "grid" أو "list"
- `currentPage` — رقم الصفحة الحالية

### الفلترة
```jsx
const filteredPosts = useMemo(() => {
  return posts.filter((post) => {
    const matchesCategory = activeCategory === "الكل" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(query) || ...;
    return matchesCategory && matchesSearch;
  });
}, [posts, activeCategory, searchQuery]);
```
`useMemo` بيمنع إعادة حساب الفلترة في كل render لو الداتا اللي بتأثر
فيها (posts, activeCategory, searchQuery) متغيرتش.

كل ما تدوس على زرار تصنيف أو تكتب في الـ search، بننادي
`setActiveCategory` أو `setSearchQuery`، وده بيخلي React يعيد الـ render
تلقائي ويحسب `filteredPosts` من جديد.

### الـ Pagination
```jsx
const POSTS_PER_PAGE = 6;
const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
const paginatedPosts = filteredPosts.slice(
  (currentPage - 1) * POSTS_PER_PAGE,
  currentPage * POSTS_PER_PAGE
);
```
بناخد بس الـ 6 مقالات اللي بتخص الصفحة الحالية من الـ array الكامل
باستخدام `.slice()`.

### الـ Grid/List toggle
بس متغير `viewMode` بيتحط كـ className على الـ container:
```jsx
<div className={`posts-container ${viewMode}`}>
```
والـ CSS هو اللي بيغيّر الشكل (`display: grid` أو `display: flex; flex-direction: column`).

## 4. صفحة BlogDetails

```jsx
const { slug } = useParams(); // بياخد الـ slug من الـ URL
const post = postsData.posts.find((p) => p.slug === slug);
```
لو مفيش post بالـ slug ده، بنرجّع `<NotFound />` مباشرة.

المحتوى (`post.content`) نص فيه عناوين تبدأ بـ `## `. دالة `parseContent`
بتقسم النص ده لأقسام (كل قسم = عنوان + فقرات)، عشان نقدر:
1. نعرض قائمة المحتويات (TOC) في الشريط الجانبي
2. نعرض كل قسم بعنوانه في المحتوى الرئيسي

## 5. الأسئلة المتوقعة وإجاباتها السريعة

**ليه استخدمنا useMemo مش مجرد const عادي؟**
عشان الفلترة عملية حسابية، ولو الكومبوننت اتعمله re-render لسبب تاني
(مش متعلق بالفلاتر)، useMemo بيمنع إننا نعيد حساب الفلترة من غير داعي.

**إزاي الـ routing شغال من غير reload للصفحة؟**
`<Link>` من react-router-dom بيستخدم History API بتاع المتصفح
(pushState) بدل ما يعمل navigation حقيقي زي `<a href>`.

**إيه الفرق بين useState و useParams؟**
`useState` بيدير حالة داخلية جوه الكومبوننت (زي البحث والفلتر).
`useParams` بيقرا قيم جاية من الـ URL نفسه (زي الـ slug).

**إزاي الـ 404 شغالة لأي مسار غير معروف؟**
الـ `<Route path="*" />` هي آخر route، وReact Router بيطابق المسارات
بالترتيب، فلو مفيش مسار قبلها اتطابق، دي هي اللي بتشتغل.
