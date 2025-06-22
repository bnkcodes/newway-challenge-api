module.exports = {
  rootDir: '.',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/modules/*/application/**/*.(t|j)s',
    'src/modules/*/domain/**/*.(t|j)s',
    'src/shared/domain/**/*.(t|j)s',
    'src/shared/application/**/*.(t|j)s',
  ],
  coveragePathIgnorePatterns: [
    'infrastructure',
    'presentation',
    'providers',
    'config',
    'dist',
    'node_modules',
    'test',
    'coverage',
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/tasks/(.*)$': '<rootDir>/src/modules/tasks/$1',
    '^@/users/(.*)$': '<rootDir>/src/modules/users/$1',
    '^@/shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
