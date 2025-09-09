# Playwright Bronze Badge - Contact Form Testing

A Playwright test suite for validating contact form error messages on the 3Cloud Solutions website.

## 🎯 Project Overview

This project demonstrates advanced Playwright testing techniques including:
- **Page Object Model (POM)** implementation
- **Dynamic iframe handling** for HubSpot forms
- **Error message validation** with robust assertions
- **Multi-step navigation flows** through website menus
- **Custom fixtures** and reusable test components

## 🏗️ Project Structure

```
playwrightBronzeBadge/
├── tests/
│   ├── pages/                    # Page Object Model classes
│   │   ├── HomePage.ts          # Homepage navigation and interactions
│   │   ├── FinancialServicesPage.ts  # Financial services page actions
│   │   └── LetsTalkPage.ts      # Contact form handling with iframe logic
│   └── contact-form.spec.ts     # Main test specification
├── playwright.config.ts         # Playwright configuration
├── package.json                 # Dependencies and scripts
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests
```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/contact-form.spec.ts

# Run with UI mode
npx playwright test --ui

# Run in headed mode (see browser)
npx playwright test --headed

# Run with debug mode
npx playwright test --debug
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
- **Robust error validation** - Checks for specific error message content
- **Page Object Model** - Clean, maintainable test structure
- **Error logging** - Displays all error messages for debugging

## 🔧 Technical Implementation

### Dynamic Iframe Handling
The `LetsTalkPage` class intelligently handles multiple iframe scenarios:

```typescript
private async getContactFormIframe(): Promise<FrameLocator> {
    if (this.iframe) return this.iframe;

    const iframes = ['iframe[id="hs-form-iframe-1"]', 'iframe[id="hs-form-iframe-0"]'];
    
    for (const selector of iframes) {
        try {
            const iframe = this.page.frameLocator(selector);
            await iframe.locator('input[name="firstname"]').waitFor({ state: 'visible', timeout: 100 });
            return this.iframe = iframe;
        } catch {
            continue;
        }
    }
    
    throw new Error('No contact form iframe found');
}
```

### Form Field Mapping
Clean, maintainable field handling:

```typescript
const fieldMap = {
    firstName: 'input[name="firstname"]',
    lastName: 'input[name="lastname"]',
    company: 'input[name="company"]',
    email: 'input[name="email"]'
};

for (const [key, selector] of Object.entries(fieldMap)) {
    const value = formData[key as keyof typeof formData];
    if (value) await iframe.locator(selector).fill(value);
}
```

## 📊 Test Results

The test validates the following error messages:
- "Please complete this required field" (for individual fields)
- "Please complete all required fields" (general validation)

**Sample Output:**
```
✓ 3Cloud Contact Form Error Validation (9.3s)
Error 1: Please complete this required field.
Error 2: Please complete this required field.
Error 3: Please complete this required field.
Error 4: Please complete this required field.
Error 5: Please complete all required fields.
```

## 🛠️ Configuration

### Playwright Config
- **Browser:** Chromium (default)
- **Viewport:** 1280x720
- **Timeout:** 30 seconds
- **Retries:** 2 on failure

### Test Data
The test uses the following form data:
- **First Name:** "John"
- **Last Name:** "" (empty - triggers validation)
- **Company:** "TestCo"
- **Email:** "a@a.com"

## 🎓 Learning Objectives

This project demonstrates:
1. **Advanced Playwright techniques** for complex web applications
2. **Iframe interaction** with dynamic content
3. **Page Object Model** best practices
4. **Error handling** and validation strategies
5. **Test maintainability** through clean code structure

## 🔍 Debugging

### Common Issues
- **Iframe not found:** Check if HubSpot form is loaded correctly
- **Timeout errors:** Verify network connectivity and page load times
- **Element not visible:** Ensure proper wait strategies are implemented

### Debug Commands
```bash
# Run with verbose output
npx playwright test --reporter=line

# Debug specific test
npx playwright test --debug tests/contact-form.spec.ts

# Generate test report
npx playwright show-report
```

## 📝 Notes

- The test handles dynamic iframe IDs that may change between page loads
- Error message validation is flexible and checks for partial matches
- The Page Object Model makes tests maintainable and reusable
- All interactions include proper wait strategies for reliability

## 🤝 Contributing

When adding new tests or modifying existing ones:
1. Follow the Page Object Model pattern
2. Include proper error handling
3. Add meaningful test descriptions
4. Ensure tests are deterministic and reliable

---

**Playwright Bronze Badge Project** - Demonstrating advanced web automation testing techniques.