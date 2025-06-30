module.exports = {
    testEnvironment: 'node',
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.js$',
    moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    testPathIgnorePatterns: ['/node_modules/'],
    modulePathIgnorePatterns: [
        '<rootDir>/Auth/package.json',
        '<rootDir>/Data/package.json',
        '<rootDir>/Video/package.json'],
    // setupFilesAfterEnv: ['./jest.setup.js']
};
