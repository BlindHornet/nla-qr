Write comprehensive unit tests for: $ARGUMENTS

Testing conventions:

- Use Vitest with React Testing Library
- Place test files in a **tests** directory in the same folder as the source file
- Name test files as [filename].test.ts(x)
- Use @/ prefix for imports

Test structure:

- Group tests using `describe` blocks per component/function
- Use clear test names: "should [expected behavior] when [condition]"
- Follow Arrange → Act → Assert pattern

Coverage requirements:

- Happy path
- Edge cases (empty, null, boundary values)
- Error states (failed API, invalid input)
- Conditional rendering branches

Testing principles:

- Focus on behavior and public APIs, not implementation details
- Do NOT test internal state or private functions
- Prefer user-centric queries (by role, label, text)
- Avoid class-based or test-id queries unless necessary

Mocking:

- Mock external dependencies (API calls, Supabase, network)
- Do NOT mock the unit under test
- Keep mocks minimal and behavior-focused

Async handling:

- Use async/await with `findBy` or `waitFor`
- Do NOT use arbitrary timeouts

Quality rules:

- Each test must include meaningful assertions
- Tests must fail if behavior breaks
- Avoid redundant or duplicate tests
- Do NOT use snapshot tests unless explicitly required
