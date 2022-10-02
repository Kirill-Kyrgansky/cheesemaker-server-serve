const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  // publicPath: 'cheesemaker-server-serve'
  configureWebpack: {
    devServer: {
      headers: { 'Access-Control-Allow-Origin': '*' },
    },
  },
  transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          data: '@import "/src/styles/styles";',
        },
      },
    },
  },
});
