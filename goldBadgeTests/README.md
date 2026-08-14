# Gold Badge Tests – Game Plan

This directory contains the **Gold Badge** test framework: a modular, scalable suite that supports **both UI and API testing** with custom fixtures, test data management, tagging, reporting, and CI/CD integration.

---

## Objective

Showcase mastery in building **scalable, maintainable, and integrated** test frameworks using Playwright, including:

- Advanced API usage for test data setup and validation  
- Test data management strategies  
- CI/CD integration with quality gates and artifacts  

---

## Prerequisites

- Silver badge completion  
- Familiarity with Playwright fixtures, hooks, and request context  

---

## Learning Resources

| Topic | Purpose |
|-------|--------|
| [Playwright Test Runner Configuration](https://playwright.dev/docs/test-configuration) | Projects, timeouts, reporters, parallel execution |
| [Playwright Fixtures and Hooks](https://playwright.dev/docs/test-fixtures) | Custom fixtures, `beforeAll`/`afterAll`, dependency injection |
| Test Data Management Strategies | Centralized data, factories, API-created data |
| CI/CD Best Practices for Test Automation | Pipelines, artifacts, quality gates, parallel runs |

---

## Suggested Websites for Testing

Use any public site that offers **both UI and API** interactions. Recommended:

| Site | URL | Features |
|------|-----|----------|
| **Thinking Tester Contact List** | https://thinking-tester-contact-list.herokuapp.com | Login, contact management, CRUD API |
| **Expand Testing Practice** | https://practice.expandtesting.com | Auth, form submissions, dynamic UI, API |

---

## Game Plan Overview

### Phase 1: Framework Design & Structure

1. **Folder structure** (aligned with Silver, extended for Gold)
   - `api/` – API client/service layer for CRUD and test data setup  
   - `data/` – Test data (fixtures, factories, env-driven config)  
   - `fixtures/` – Custom Playwright fixtures and hooks  
   - `pages/` – Page Object Model for UI flows  
   - `services/` – Optional service layer (e.g., auth, contact lifecycle)  
   - `tests/` – Specs with tags (e.g. `@smoke`, `@regression`)  
   - `utils/` – Helpers, constants, types  

2. **Custom fixtures and hooks**
   - Authenticated context (e.g. pre-login via API or UI)  
   - API request context + base URL  
   - Test data factories (e.g. create user/contact via API and inject into test)  
   - Hooks for setup/teardown (create data in `beforeAll`, cleanup in `afterAll`)  

3. **Modularity**
   - Page Object Model for all UI flows  
   - Service layer for API and shared business flows  
   - Shared assertions and response validation in `utils` or `asserts`  

### Phase 2: Required Scenario – End-to-End Flow

1. **API-driven test data**
   - Use API to create data (e.g. user, contact, or form submission).  
   - Use same base URL and auth as UI where applicable.  

2. **UI automation**
   - Navigate to the app, perform actions that use or display the created data.  
   - Validate that UI shows the same data as returned by the API (dynamic data).  

3. **Resilience**
   - Retries (config-level or per test).  
   - Fallback UI validation (e.g. if API creation fails, skip or degrade gracefully).  
   - Stable selectors and waits.  

### Phase 3: Test Tagging & Reporting

1. **Tags**
   - Tag specs or tests (e.g. `@smoke`, `@regression`, `@e2e`).  
   - Use Playwright `grep` / `--grep` to run by tag (e.g. smoke-only in CI).  

2. **Reporting**
   - HTML reporter (built-in).  
   - Allure (or similar) for richer reports.  
   - Configure in `playwright.config.ts` (e.g. multiple reporters).  

### Phase 4: CI/CD Integration

1. **Pipeline**
   - Add/update workflow (e.g. GitHub Actions or Azure DevOps) to run Gold badge tests.  
   - Separate job or project for Gold (e.g. `gold-badge-chromium`, `gold-badge-firefox`, `gold-badge-webkit`).  

2. **Execution**
   - Run in parallel across browsers.  
   - Optional: run smoke vs full suite (using tags).  

3. **Artifacts**
   - Publish test results, screenshots, videos, traces (e.g. `playwright-report`, `test-results`).  

4. **Quality gates**
   - Fail the build on test failure (or on critical/smoke failures only).  
   - Optional: fail when flaky rate exceeds threshold.  

### Phase 5: Extra Credit (Optional)

- Use **Playwright Codegen** to capture flows and refactor into POM/service layer.  
- Integrate with **Azure Test Plans** or **TestRail** (e.g. report results via API).  
- **Email reports** (e.g. attach HTML/Allure report and send after run).  

### Phase 6: Evaluation

- Prepare a short **presentation** (structure, design choices, demo flow).  
- **Demo** to higher badge holders (run E2E flow, show CI, reports).  
- Get **sign-off** from the designated badge approver.  

---

## Target Folder Structure

```
goldBadgeTests/
├── api/                    # API service layer (request context, CRUD)
│   └── (e.g. contactApi.ts, authApi.ts)
├── data/                   # Test data management
│   └── (e.g. testData.ts, factories, env config)
├── fixtures/               # Custom fixtures and hooks
│   └── goldBadgeFixtures.ts
├── pages/                  # Page Object Model
│   └── (e.g. LoginPage, ContactListPage, AddContactPage)
├── services/               # Optional: high-level flows (auth, contact lifecycle)
│   └── (e.g. authService.ts, contactService.ts)
├── tests/                  # Specs (with @smoke, @regression tags)
│   ├── e2e-api-then-ui.spec.ts
│   └── (other specs)
├── utils/                  # Helpers, constants, types
│   └── (e.g. constants.ts, helpers.ts, types.ts)
├── asserts/                # Optional: shared assertion helpers
│   └── (e.g. assertResponse.ts)
└── README.md               # This file
```

---

## Running Gold Badge Tests

```bash
# All Gold browsers
npm run test:gold

# Smoke only (Chromium)
npm run test:gold:smoke

# UI mode / report
npx playwright test --project=gold-badge-chromium --ui
npx playwright show-report
```

## CI/CD

Workflow: `.github/workflows/gold-badge-tests.yml`

1. **Quality gate** — `npm run test:gold:smoke` (fails build early)
2. **Full suite** — `npm run test:gold` (Chromium + Firefox + WebKit in parallel)
3. **Artifacts** — HTML report always; screenshots/videos/traces on failure

Triggers: push, pull_request, `workflow_dispatch`

## Current layout (lean)

```
goldBadgeTests/
├── api/           # HTTP only (userApi, contactApi)
├── data/          # Factories (buildUser, buildContact)
├── fixtures/      # POM + seededContact hook fixture
├── pages/         # LoginPage, ContactListPage
├── services/      # createUserWithContact orchestration
├── tests/         # AAA E2E with @smoke @regression
└── utils/         # constants, helpers, types
```

Design: **AAA** in specs · **SOLID** via thin layers · no assert/Allure extras unless needed.

---

## Environment Variables (Planned)

Example `.env` (or CI secrets) for Thinking Tester Contact List:

```env
CONTACT_LIST_BASE_URL=https://thinking-tester-contact-list.herokuapp.com
CONTACT_LIST_EMAIL=your-email@example.com
CONTACT_LIST_PASSWORD=your-password
```

For Expand Testing or other sites, add corresponding variables and use them in `utils/constants.ts` and fixtures.

---

## Success Criteria Summary

| Area | Criteria |
|------|----------|
| **E2E flow** | API creates data → UI uses and validates that data; resilience (retries/fallback) |
| **Framework** | Custom fixtures & hooks; tags (smoke/regression); reporting (HTML + optional Allure) |
| **Design** | POM + service layer; modular and maintainable |
| **CI/CD** | Pipeline runs Gold tests; parallel browsers; artifacts; quality gates |
| **Evaluation** | Present and demo; sign-off from badge approver |

Use the root-level **GOLD_BADGE_CHECKLIST.md** to track progress against these criteria.
