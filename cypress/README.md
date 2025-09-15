# Cypress E2E Tests

This directory contains end-to-end tests for the Real Estate Properties Management System using Cypress.

## Test Structure

```
cypress/
├── e2e/                    # Test files
│   ├── property-list.cy.ts     # Property listing tests
│   ├── property-details.cy.ts  # Property details tests
│   ├── property-crud.cy.ts     # CRUD operations tests
│   └── navigation.cy.ts        # Navigation tests
├── fixtures/               # Test data
│   └── properties.json         # Mock property data
├── support/                # Support files
│   ├── commands.ts             # Custom commands
│   ├── e2e.ts                  # E2E support
│   └── index.d.ts              # TypeScript definitions
└── README.md              # This file
```

## Running Tests

### Interactive Mode (Recommended for Development)

```bash
npm run e2e:open
```

### Headless Mode (CI/CD)

```bash
npm run e2e
```

### Specific Test Files

```bash
# Run only property list tests
npx cypress run --spec "cypress/e2e/property-list.cy.ts"

# Run only CRUD tests
npx cypress run --spec "cypress/e2e/property-crud.cy.ts"
```

## Test Data

Test fixtures are located in `cypress/fixtures/`:

- `properties.json`: Contains mock property data used across tests

## Custom Commands

Custom commands are defined in `cypress/support/commands.ts`:

- `cy.dataCy(value)`: Select elements by data-cy attribute
- `cy.login()`: Mock login for testing
- `cy.createTestProperty()`: Create test property data

## Configuration

- `cypress.config.ts`: Main configuration for local development
- `cypress.config.ci.ts`: Configuration optimized for CI/CD environments

## Best Practices

1. **Use data-cy attributes**: Add `data-cy` attributes to elements you want to test
2. **Mock API calls**: Use `cy.intercept()` to mock API responses
3. **Clean up**: Use `beforeEach()` and `afterEach()` for test setup/cleanup
4. **Wait for elements**: Use `cy.wait()` for API calls and `cy.should()` for assertions
5. **Page Object Model**: Consider using page objects for complex test scenarios

## Adding New Tests

1. Create a new `.cy.ts` file in `cypress/e2e/`
2. Follow the existing naming convention: `feature-name.cy.ts`
3. Use descriptive test names and group related tests with `describe()`
4. Add appropriate `data-cy` attributes to your components
5. Mock any API calls using `cy.intercept()`

## Debugging

- Use `cy.pause()` to pause test execution
- Use `cy.debug()` to log values
- Use `cy.log()` for custom logging
- Check the Cypress Test Runner for visual debugging
