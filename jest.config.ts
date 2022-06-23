module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).js'],
  collectCoverage: false,
  coverageDirectory: 'coverage',
};
