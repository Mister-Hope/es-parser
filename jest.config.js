const { resolve } = require("path");

module.exports = {
  rootDir: resolve(__dirname),
  preset: "ts-jest",
  collectCoverage: true,
  testEnvironment: "node",
  moduleFileExtensions: ["js", "json", "jsx", "ts", "d.ts", "tsx", "node"],
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.json",
    },
  },
  testMatch: ["<rootDir>/__tests__/**/*.spec.ts"],
};
