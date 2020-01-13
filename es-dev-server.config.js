module.exports = {
  port: 8080,
  watch: true,
  nodeResolve: true,
  babelConfig: {
    plugins: ['transform-node-env-inline'],
  },
};
