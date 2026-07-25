// Registers @testing-library/jest-dom's custom matchers (toBeInTheDocument,
// toHaveAttribute, …) with TypeScript so the test files type-check — and so
// `next build`'s type-check (which includes __tests__) doesn't fail on push.
import '@testing-library/jest-dom'
