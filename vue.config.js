const {
  defineConfig,
} = require('@vue/cli-service');

module.exports = defineConfig({
  configureWebpack: {
    devServer: {
      headers: { "Access-Control-Allow-Origin": "*" },
      proxy: 'http://172.16.0.179/api/'
    }
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
