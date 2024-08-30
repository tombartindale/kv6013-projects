// const ObsoleteWebpackPlugin = require("obsolete-webpack-plugin");
// const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
// const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");
const webpack = require("webpack");
const fs = require("fs");
const packageJson = fs.readFileSync("./package.json");
const version = JSON.parse(packageJson).version;

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          PACKAGE_VERSION: '"' + version + '"',
        },
      }),
      // new ImageminWebpWebpackPlugin(),
    ],
  },
  publicPath: process.env.NODE_ENV === "production" ? "/kv6013-projects/" : "/",
  pluginOptions: {
    quasar: {
      extras: ["material-icons"],
      // importStrategy: "kebab",
      // rtlSupport: true,
      framework: {
        iconSet: "svg-material-icons",
        cssAddon: true,
      },
    },
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true,
    },
  },
  transpileDependencies: ["quasar", "firebase"],
};
