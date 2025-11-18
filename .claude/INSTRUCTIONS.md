# Claude Code Instructions for Chase Travel Project

## CRITICAL: Automated Testing Requirements

**ALWAYS run E2E tests after making ANY code changes to this application.**

### Mandatory Workflow

Every time you make changes to the application code:

1. **Make your code changes**
2. **Build the project** to check for TypeScript errors:
   ```bash
   npm run build
   ```
3. **Run E2E tests** to verify functionality:
   ```bash
   npm run test
   ```
4. **If tests fail**:
   - Review the test output, screenshots, and traces
   - Fix the code OR update the tests if the change is intentional
   - Re-run tests until they pass
5. **If your changes modify the UI or user flow**:
   - Update `e2e/flight-booking.spec.ts` accordingly
   - Update `TESTING.md` documentation

### Test Update Scenarios

**You MUST update tests when:**
- Changing UI selectors or element structure
- Modifying the search form or navigation flow
- Changing flight card display or selection behavior
- Updating confirmation page layout
- Modifying sessionStorage data structure
- Changing points redemption functionality
- Adding/removing form fields or validation

### Current Test Coverage

The E2E test suite (`e2e/flight-booking.spec.ts`) validates:
1. Homepage loads correctly
2. Search form accepts New York → Chicago input
3. Navigation to results page with query parameters
4. Flight results display correctly
5. Flight selection and navigation to confirmation
6. Confirmation page displays correct flight details
7. Points redemption functionality works

### Quick Reference

**Run tests (headless):**
```bash
npm run test
```

**Run tests in headed mode (see browser):**
```bash
npm run test:headed
```

**Run tests with UI (interactive debugging):**
```bash
npm run test:ui
```

**Run tests in debug mode (step through):**
```bash
npm run test:debug
```

**View last test report:**
```bash
npx playwright show-report
```

## Git Hooks

A pre-commit hook is installed at `.git/hooks/pre-commit` that automatically runs `npm run test` before every commit. This ensures broken code is never committed.

**To bypass the hook (NOT RECOMMENDED):**
```bash
git commit --no-verify
```

## Documentation

Refer to [TESTING.md](../TESTING.md) for comprehensive testing documentation including:
- Complete test coverage details
- Expected user flow
- Debugging failed tests
- Test maintenance guidelines

## Important Notes

- Tests use Playwright with Chromium browser
- Tests run real browser interactions (true E2E testing)
- Web server starts automatically when running tests
- Screenshots, videos, and traces are captured on failure
- Tests typically take 10-30 seconds to run
- All tests must pass before committing code
- Never skip running tests after making changes

## Debugging Test Failures

When tests fail:

1. Check the console output for error messages
2. Look at screenshots in `test-results/` directory
3. View the trace file: `npx playwright show-trace test-results/.../trace.zip`
4. Run in headed mode to see what's happening: `npm run test:headed`
5. Use debug mode to step through: `npm run test:debug`
