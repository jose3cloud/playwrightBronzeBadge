# Playwright Bronze Badge - Contact Form Testing

A comprehensive Playwright test automation suite for validating contact form error messages on the 3Cloud Solutions website, featuring advanced iframe handling, cross-browser testing, and performance optimizations.

## 🎯 Project Overview

This project demonstrates enterprise-level Playwright testing techniques including:

- **Page Object Model (POM)** with clean architecture
- **Dynamic iframe handling** for HubSpot forms with browser-specific optimizations
- **Cross-browser testing** (Chromium, Firefox, WebKit) with performance tuning
- **Error message validation** with robust assertions and fallback strategies
- **Multi-step navigation flows** through website menus
- **Custom fixtures** and reusable test components
- **Code quality tools** (ESLint, Prettier) for maintainable code
- **Performance optimization** for different browser engines

## 🏗️ Project Structure

```
playwrightBronzeBadge/
├── uitests/                          # Test automation suite
│   ├── data/                         # Test data management
│   │   └── contactForm.ts           # Form data interfaces and test data
│   ├── fixtures/                     # Playwright fixtures
│   │   └── testFixtures.ts          # Custom test fixtures and page objects
│   ├── pages/                        # Page Object Model classes
│   │   ├── homePage.ts              # Homepage navigation and interactions
│   │   ├── financialServicesPage.ts # Financial services page actions
│   │   └── letsTalkPage.ts          # Contact form handling with iframe logic
│   ├── sections/                     # Reusable UI components
│   │   └── letsTalkFormSection.ts   # Form section with advanced iframe handling
│   └── tests/                        # Test specifications
│       └── contact-form.spec.ts     # Main test specification
├── playwright.config.ts              # Playwright configuration with browser optimizations
├── package.json                      # Dependencies and scripts
├── .eslintrc.json                    # ESLint configuration
├── .prettierrc                       # Prettier configuration
├── .prettierignore                   # Prettier ignore patterns
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd playwrightBronzeBadge

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

```bash
# Run all tests across all browsers
npm test

# Run specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run with UI mode (interactive)
npm run test:ui

# Run in headed mode (see browser)
npm run test:headed

# Run with debug mode
npm run test:debug

# Run with HTML report
npx playwright test --reporter=html
```

### Code Quality

```bash
# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

## 🧪 Test Description

### Contact Form Error Validation Test

**Test Flow:**

1. Navigate to https://3cloudsolutions.com
2. Hover over "Who We Serve" dropdown
3. Click "Financial Services"
4. Click "Let's Talk" button (opens new page)
5. Fill form with incomplete data (leaving required fields blank)
6. Submit form
7. Validate error messages are displayed correctly

**Key Features:**

- **Dynamic iframe detection** - Automatically finds the correct HubSpot form iframe
- **Browser-specific optimizations** - Different strategies for Chromium, Firefox, and WebKit
- **Robust error validation** - Checks for specific error message content
- **Page Object Model** - Clean, maintainable test structure
- **Performance monitoring** - Tracks execution times across browsers

## 🔧 Technical Implementation

### Dynamic Iframe Handling

The `LetsTalkFormSection` class provides sophisticated iframe detection with browser-specific optimizations:

```typescript
async getIframe(): Promise<FrameLocator> {
  if (!this._iframe) {
    for (const selector of this.iFrameSelectors) {
      try {
        await this.page.waitForSelector(selector, { state: 'attached' });
        const iframe = this.page.frameLocator(selector);
        
        // Wait for iframe content to load
        await iframe.locator('input[name="firstname"]').waitFor({ 
          state: 'visible', 
          timeout: 1000 
        });
        return this._iframe = iframe;
      } catch {
        continue;
      }
    }
  }
  if (!this._iframe) {
    throw new Error('Could not find a valid iframe for the form.');
  }
  return this._iframe;
}
```

### Browser-Specific Optimizations

The project includes performance optimizations for different browsers:

```typescript
// Common settings shared across all browsers
const commonSettings = {
  headless: true,
  screenshot: 'only-on-failure' as const,
  video: 'retain-on-failure' as const,
  baseURL: 'https://3cloudsolutions.com',
};

// Common launch arguments for Chromium and WebKit
const commonLaunchArgs = [
  '--disable-web-security', 
  '--disable-features=VizDisplayCompositor',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding'
];
```

### Form Field Mapping

Clean, maintainable field handling with TypeScript interfaces:

```typescript
export interface ContactFormData {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  jobTitle: string;
  phoneNumber: string;
  comments: string;
}

// Usage in page objects
async fillForm(formData: ContactFormData) {
  await Promise.all([
    formData.firstName && this.letsTalkFormSection.fillField('First Name', formData.firstName),
    formData.lastName && this.letsTalkFormSection.fillField('Last Name', formData.lastName),
    // ... other fields
  ]);
}
```

## 📊 Test Results & Performance

### Current Performance Metrics

| Browser | Execution Time | Status | Notes |
|---------|---------------|--------|-------|
| **Chromium** | ~5.1s | ✅ Optimized | Fastest execution |
| **Firefox** | ~7.9s | ✅ Good | Reliable performance |
| **WebKit** | ~11.7s | ✅ Acceptable | Expected slower due to iframe limitations |

### Test Validation

The test validates the following error messages:

- "Please complete this required field" (for individual fields)
- Field-specific validation errors
- Form submission error handling

**Sample Output:**

```
✓ 3Cloud Contact Form Error Validation (5.1s) [chromium]
✓ 3Cloud Contact Form Error Validation (7.9s) [firefox]  
✓ 3Cloud Contact Form Error Validation (11.7s) [webkit]

3 passed (12.7s)
```

## 🛠️ Configuration

### Playwright Configuration

- **Browsers:** Chromium, Firefox, WebKit
- **Viewport:** 1280x720 (default)
- **Timeout:** 30 seconds (configurable per browser)
- **Retries:** 2 on failure
- **Screenshots:** Only on failure
- **Video:** Retained on failure

### Browser-Specific Settings

Each browser has optimized launch arguments and timeouts:

```typescript
projects: [
  { 
    name: 'chromium', 
    use: { 
      ...commonSettings,
      browserName: 'chromium',
      launchOptions: { args: commonLaunchArgs }
    } 
  },
  { 
    name: 'firefox', 
    use: { 
      ...commonSettings,
      browserName: 'firefox'
    } 
  },
  { 
    name: 'webkit', 
    use: { 
      ...commonSettings,
      browserName: 'webkit',
      launchOptions: { args: commonLaunchArgs }
    } 
  }
]
```

### Test Data

The test uses structured data for form validation:

```typescript
export const CONTACT_FORM_DATA = {
  incomplete: {
    firstName: 'John',
    lastName: 'Doe',
    company: 'TestCo',
    email: 'john@test.com',
    jobTitle: '',        // Empty - triggers validation
    phoneNumber: '',     // Empty - triggers validation
    comments: ''         // Empty - triggers validation
  }
};
```

## 🎓 Learning Objectives

This project demonstrates:

1. **Advanced Playwright techniques** for complex web applications
2. **Iframe interaction** with dynamic content and cross-browser compatibility
3. **Page Object Model** best practices with TypeScript
4. **Error handling** and validation strategies
5. **Test maintainability** through clean code structure
6. **Performance optimization** for different browser engines
7. **Code quality** with ESLint and Prettier integration
8. **Cross-browser testing** strategies and browser-specific optimizations

## 🔍 Debugging & Troubleshooting

### Common Issues

- **Iframe not found:** Check if HubSpot form is loaded correctly
- **Timeout errors:** Verify network connectivity and page load times
- **Element not visible:** Ensure proper wait strategies are implemented
- **WebKit performance:** Expected slower execution due to iframe limitations

### Debug Commands

```bash
# Run with verbose output
npx playwright test --reporter=line

# Debug specific test
npx playwright test --debug uitests/tests/contact-form.spec.ts

# Generate test report
npx playwright show-report

# Run specific browser with debug
npx playwright test --project=webkit --debug
```

### Performance Analysis

```bash
# Run with performance timing
npx playwright test --reporter=html

# Check test results
npx playwright show-report
```

## 📝 Code Quality

### ESLint Configuration

- **TypeScript support** with proper type checking
- **Prettier integration** for consistent formatting
- **Custom rules** for Playwright best practices
- **Auto-fix** capabilities for common issues

### Prettier Configuration

- **Consistent formatting** across all files
- **Single quotes** for strings
- **2-space indentation**
- **Trailing commas** for better diffs

## 🚀 Advanced Features

### Custom Fixtures

The project uses Playwright fixtures for dependency injection:

```typescript
type TestFixtures = {
  homePage: HomePage;
  financialServicesPage: FinancialServicesPage;
  letsTalkPage: LetsTalkPage;
  letsTalkPageFactory: (page: Page) => LetsTalkPage;
};

export const test = baseTest.extend<TestFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  // ... other fixtures
});
```

### Error Handling

Robust error handling with fallback strategies:

```typescript
async getFieldError(fieldName: FormField): Promise<string | null> {
  try {
    const fieldError = await this.letsTalkFormSection.getFieldError(fieldName);
    await fieldError.waitFor({ state: 'visible', timeout: 3000 });
    const errorText = await fieldError.textContent();
    return errorText?.trim() || null;
  } catch {
    return null;
  }
}
```

## 🤝 Contributing

When adding new tests or modifying existing ones:

1. Follow the Page Object Model pattern
2. Include proper error handling and TypeScript types
3. Add meaningful test descriptions
4. Ensure tests are deterministic and reliable
5. Run linting and formatting before committing
6. Test across all browsers (Chromium, Firefox, WebKit)
7. Update documentation for new features

### Development Workflow

```bash
# 1. Make changes
# 2. Run linting
npm run lint:fix

# 3. Format code
npm run format

# 4. Run tests
npm test

# 5. Commit changes
git add .
git commit -m "feat: add new feature"
```

## 📈 Future Enhancements

- [ ] Add more test scenarios (happy path, edge cases)
- [ ] Implement visual regression testing
- [ ] Add API testing integration
- [ ] Expand cross-browser compatibility testing
- [ ] Add performance benchmarking
- [ ] Implement test data externalization
- [ ] Add accessibility testing

---

**Playwright Bronze Badge Project** - Demonstrating enterprise-level web automation testing techniques with advanced iframe handling, cross-browser optimization, and code quality best practices.