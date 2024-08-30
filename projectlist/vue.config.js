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
  // chainWebpack: (config) => {
  //   config
  //     .plugin("obsolete")
  //     .use(
  //       new ObsoleteWebpackPlugin({
  //         // browsers: ["ie 11"],
  //         name: "obsolete",
  //         position: "beforeend",
  //         template:
  //           '<div class="fixed-full bg-white fullscreen z-max"><div class="absolute-center text-center"><h4>Sorry, Your browser is not supported</h4></div></div>',
  //         promptOnNonTargetBrowser: true,
  //       })
  //     )
  //     .end()
  //     .plugin("scriptext")
  //     .use(
  //       new ScriptExtHtmlWebpackPlugin({
  //         async: "obsolete",
  //       })
  //     )
  //     .end();
  // },
  pluginOptions: {
    quasar: {
      // importStrategy: "kebab",
      rtlSupport: true,
      // //   iconSet: "svg-material-icons",
      framework: {
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
