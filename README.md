# Playwright API Testing

REST API test automation with Playwright's `APIRequestContext` — status codes, schema validation, CRUD, search/query params, auth tokens and negative cases against the DummyJSON API.

![Playwright Tests](https://github.com/OShalaby/playwright-api-testing/actions/workflows/playwright.yml/badge.svg)

## What this demonstrates

- Pure API testing with Playwright's `request` fixture (`APIRequestContext`) — no browser, no page objects.
- Validation of HTTP **status codes** (200, 201, 404) and the `response.ok()` helper.
- **Response body and schema validation** via small, reusable TypeScript type guards, including **deep nested-object** validation.
- Full **CRUD** coverage: GET, POST, PUT, PATCH, DELETE — with correct expectations for an API that simulates writes.
- **Search and query parameter** filtering (the `params` option) and **nested-resource** traversal (a post's comments).
- **Authentication**: log in for a bearer token, then call a protected endpoint with an `Authorization` header.
- **Negative testing** (requesting a non-existent resource returns 404).
- **Header assertions** (`content-type`) at the transport layer.
- Soft assertions (`expect.soft`) for grouping independent field checks so all failures report at once.
- Clean separation of validation logic (`utils/`) from specs (`tests/`).

## Tech stack

- [Playwright Test](https://playwright.dev/) `^1.60.0`
- TypeScript `^5.4.0`
- Node.js `20`
- GitHub Actions (CI)
- Target API: [DummyJSON](https://dummyjson.com)

> Note: DummyJSON is a fake REST API. It accepts writes and returns realistic responses but **does not persist** them — `POST /products/add` returns `201` echoing the body with a generated id, and PUT/PATCH/DELETE return `200` (DELETE flags the resource with `isDeleted`/`deletedOn`). The tests assert against this documented contract, not real database state.

## Test coverage

- **`tests/products.get.spec.ts`** — `GET /products` returns 200 with a paginated envelope (`limit === 30`, `total > 0`) where every product matches the Product schema; `GET /products/1` returns 200 with `id === 1`; `GET /products/9999` returns 404.
- **`tests/products.search.spec.ts`** — `GET /products/search?q=phone` returns 200 with schema-valid matches; `GET /products/categories` returns a non-empty array; `GET /products/category/smartphones` returns a non-empty product list.
- **`tests/products.crud.spec.ts`** — `POST /products/add` returns 201 echoing the body with a generated numeric id; `PUT`/`PATCH /products/1` return 200 with the updated field; `DELETE /products/1` returns 200 with `isDeleted === true` and a `deletedOn` timestamp.
- **`tests/users.spec.ts`** — `GET /users` returns 200 with a paginated envelope each item matching the User schema; `GET /users/1` validates nested `address.coordinates.lat/lng` and `company.name`.
- **`tests/auth.spec.ts`** — `POST /auth/login` returns 200 with a non-empty `accessToken`; the token is then used against `GET /auth/me` to retrieve the authenticated profile.
- **`tests/posts.spec.ts`** — `GET /posts` returns 200 with schema-valid posts; `GET /posts/1` returns `id === 1`; `GET /posts/1/comments` returns comments scoped to post 1, each matching the Comment schema.
- **`tests/headers.spec.ts`** — asserts `response.ok()` and the `content-type` (`application/json`) header on a 200, and that `response.ok()` is false with a 404 status on a missing resource.

## Project structure

```
playwright-api-testing/
├── .github/
│   └── workflows/
│       └── playwright.yml       # CI pipeline
├── tests/
│   ├── products.get.spec.ts     # GET collection / single / 404
│   ├── products.search.spec.ts  # search + categories
│   ├── products.crud.spec.ts    # POST / PUT / PATCH / DELETE (simulated)
│   ├── users.spec.ts            # users + nested object validation
│   ├── auth.spec.ts             # login + bearer-token protected request
│   ├── posts.spec.ts            # posts + nested comments
│   └── headers.spec.ts          # content-type / response.ok()
├── utils/
│   └── schema.ts                # reusable type-guard validators
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── .gitignore
└── README.md
```

## Running locally

```bash
git clone https://github.com/OShalaby/playwright-api-testing.git
cd playwright-api-testing
npm install
npx playwright install --with-deps chromium
npm test
npm run report
```

Useful scripts:

- `npm test` — run the full suite headless.
- `npm run test:headed` — run with a headed browser context.
- `npm run test:ui` — open the Playwright UI mode.
- `npm run report` — open the last HTML report.

## CI

Every push and pull request to `main` triggers the **Playwright Tests** workflow (`.github/workflows/playwright.yml`) on `ubuntu-latest` (30-minute timeout). The pipeline checks out the code, sets up Node 20, installs dependencies (`npm ci || npm install`), installs the Chromium browser with system dependencies, and runs `npx playwright test`. The HTML report is uploaded as a `playwright-report` artifact (retained 14 days) on every run, regardless of pass or fail, so failures can be triaged from the Actions tab.

## Author

Omar Shalaby — SDET / QA Automation Engineer. Hire me on Upwork: https://www.upwork.com/freelancers/~01b3032fe5e6492806
