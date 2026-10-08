/** @type {import('jest').Config} */
const config = {
  displayName: "oros-ai",
  testEnvironment: "node",
  roots: ["<rootDir>"],
  testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  },
  collectCoverageFrom: [
    "lib/**/*.{ts,tsx}",
    "!lib/**/*.d.ts",
    "!lib/**/types.ts",
    "!**/__tests__/**"
  ],
  coveragePathIgnorePatterns: ["/node_modules/", "/.next/"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: { jsx: "react" } }]
  }
};

module.exports = config;
