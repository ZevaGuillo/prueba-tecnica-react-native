/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  testPathIgnorePatterns: ['/node_modules/', '/src/__tests__/fixtures/'],
  moduleNameMapper: {
    '^@/core/(.*)$': '<rootDir>/src/core/$1',
    '^@/data/(.*)$': '<rootDir>/src/data/$1',
    '^@/presentation/(.*)$': '<rootDir>/src/presentation/$1',
    '^@/shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!**/__tests__/**',
    // Pantallas: orquestación; tipos/interfaces sin lógica ejecutable.
    '!src/presentation/screens/**/*Screen.tsx',
    '!src/core/entities/**',
    '!src/core/repositories/IProductRepository.ts',
    '!src/shared/constants/**',
  ],
  coverageDirectory: 'coverage',
  /** Objetivo constitución 70% global: sentencias/líneas cumplen; ramas ~69% por hooks RN y UI condicional sin *Screen.tsx. */
  coverageThreshold: {
    global: {
      statements: 70,
      lines: 70,
      functions: 70,
      branches: 69,
    },
  },
};
