module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist/fem-readup-search-engine-ng',
    },
    assert: {
      preset: 'lighthouse:recommended',
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
