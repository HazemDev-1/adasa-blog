# عدسة | Adasa — Photography Blog

An Arabic (RTL) photography blog built with **React 18**, **TypeScript**, **React Router 7** and **Vite**, with tests in **Vitest** and **React Testing Library**.

![tests](https://github.com/HazemDev-1/adasa-blog/actions/workflows/tests.yml/badge.svg)

<!-- Add a screenshot: save it as docs/screenshot.png and uncomment the next line -->
<!-- ![Adasa screenshot](docs/screenshot.png) -->

## Features

- Home page with live stats and featured articles
- Blog page with **live search**, **category filters**, **grid/list view** and **pagination**
- Article page with an auto-generated **table of contents**
- Custom **404** page for unknown routes and unknown articles
- Loading and error states while data is fetched
- Fully right-to-left layout with the Tajawal font

## How it works

| Part | What it does |
|---|---|
| `public/data/posts.json` | The blog content (28 articles, categories, site info) |
| `hooks/usePosts.tsx` | Fetches the JSON **once** over HTTP and shares it through React Context. The request is cancelled with `AbortController` if the component unmounts. |
| `components/DataGate.tsx` | Shows loading / error UI, then renders the page with the data |
| `lib/posts.ts` | Pure functions: `filterPosts`, `paginate`, `parseContent`. No React, so they are easy to test. |
| `pages/` | Home, Blog, BlogDetails, NotFound |

The data is fetched instead of imported, so switching to a real backend later only means changing one URL.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 17 tests
npm run build      # type-check + production build
```

## Tests

- `lib/posts.test.ts`: filtering, search, pagination edge cases, content parsing
- `pages/Blog.test.tsx`: the real app rendered with a fake `fetch`: loading state, paging, category filter resetting to page 1, search + clear, error state, article page and 404

## History

Built as Assignment 14 of the Route Academy front-end diploma in plain JSX, then upgraded to TypeScript with tests and data fetching for this portfolio.
