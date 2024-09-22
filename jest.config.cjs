module.exports = {
  moduleNameMapper: {
    "^@/(.*)": "<rootDir>/src/$1"
  },
  modulePaths: ["<rootDir>"],
  transform: { "^.+\\.ts$": "ts-jest" },
  transformIgnorePatterns: ["!node_modules/"]
};
