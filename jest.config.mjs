import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Path to the Next.js app to load next.config and .env files in the test environment
  dir: './',
})

/** @type {import('jest').Config} */
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // Only run our explicit test files; never treat app route files as tests.
  testMatch: ['<rootDir>/__tests__/**/*.test.{ts,tsx}'],
}

export default createJestConfig(config)
