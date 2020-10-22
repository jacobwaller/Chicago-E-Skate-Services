const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CracoAntDesignPlugin = require('craco-antd');
const path = require('path');
const WebpackBar = require('webpackbar');

const developmentWebpackPlugins = [];
if (process.env.NODE_ENV === 'development') {
  developmentWebpackPlugins.push(
    // https://github.com/webpack-contrib/webpack-bundle-analyzer
    new BundleAnalyzerPlugin({ openAnalyzer: false }),
  );
}

module.exports = {
  webpack: {
    plugins: [
      // https://github.com/nuxt/webpackbar#readme
      new WebpackBar({ profile: true }),
      ...developmentWebpackPlugins,
    ],
  },
  plugins: [
    {
      // https://github.com/DocSpring/craco-antd#readme
      plugin: CracoAntDesignPlugin,
      options: {
        customizeThemeLessPath: path.join(
          __dirname,
          'src/antd.customize.less'
        ),
      },
    },
  ],
};
