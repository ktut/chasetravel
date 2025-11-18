#!/bin/bash

# This hook runs e2e tests whenever Claude makes changes to the codebase
# It checks if any files were modified and runs the appropriate tests

# Get the list of modified files from git
MODIFIED_FILES=$(git diff --name-only HEAD 2>/dev/null || echo "")

# If no git changes, check if we should still run tests based on the user's message
# This catches cases where Claude is about to make changes

# Check if any Vue components, TypeScript files, or test files were modified
if echo "$MODIFIED_FILES" | grep -qE '\.(vue|ts|tsx|spec\.ts)$'; then
    echo "🧪 Changes detected in codebase. Running e2e tests..."

    # Determine which tests to run based on modified files
    RUN_FLIGHT_TESTS=false
    RUN_HOTEL_TESTS=false

    # Check for flight-related changes
    if echo "$MODIFIED_FILES" | grep -qE '(Flight|flight|Results|Confirmation|SearchWidget)'; then
        RUN_FLIGHT_TESTS=true
    fi

    # Check for hotel-related changes
    if echo "$MODIFIED_FILES" | grep -qE '(Hotel|hotel|Results|Confirmation|SearchWidget)'; then
        RUN_HOTEL_TESTS=true
    fi

    # If we can't determine specifically, run all tests
    if [ "$RUN_FLIGHT_TESTS" = false ] && [ "$RUN_HOTEL_TESTS" = false ]; then
        echo "Running all e2e tests..."
        npx playwright test --reporter=line 2>&1 | head -50
    else
        # Run specific tests
        if [ "$RUN_FLIGHT_TESTS" = true ]; then
            echo "Running flight booking e2e test..."
            npx playwright test e2e/flight-booking.spec.ts --reporter=line 2>&1 | head -50
        fi

        if [ "$RUN_HOTEL_TESTS" = true ]; then
            echo "Running hotel booking e2e test..."
            npx playwright test e2e/hotel-booking.spec.ts --reporter=line 2>&1 | head -50
        fi
    fi

    # Check exit code
    TEST_EXIT_CODE=$?
    if [ $TEST_EXIT_CODE -ne 0 ]; then
        echo "⚠️  E2E tests failed. Please review and fix the issues."
        echo "Run 'npx playwright test' to see full test output."
    else
        echo "✅ E2E tests passed!"
    fi
fi

# Always allow the prompt to continue
exit 0
