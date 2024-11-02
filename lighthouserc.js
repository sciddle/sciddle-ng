module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
    },
    assert: {
      preset: 'lighthouse:recommended',
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
