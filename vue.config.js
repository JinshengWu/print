const path = require("path");

const isProduction = process.env.NODE_ENV === "production";

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: "/",
  lintOnSave: true,
  productionSourceMap: false,
  parallel: require("os").cpus().length > 1,

  css: {
    extract: isProduction,
    sourceMap: false,
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/css/common.scss";`,
      },
    },
  },

  devServer: {
    port: 9000,
    open: false,
    compress: false,
    overlay: {
      warnings: false,
      errors: true,
    },

    proxy: {
      // "/my/file": {
      // 	target: "http://27.188.72.129:15481/group1/upload",
      // 	changeOrigin: true,
      // 	pathRewrite: {
      // 		"/my/file": ""
      // 	}
      // },
      "/dev": {
        target: "http://www.powhole.com:1886",
        // target: "http://27.188.72.129:17003",
        changeOrigin: true,
        pathRewrite: {
          "/dev": "",
        },
      },
      "/v1/query": {
        target: "http://www.powhole.com:1885/v1/query",
        changeOrigin: true,
        pathRewrite: {
          "/v1/query": "",
        },
      },
      "/v1/graphql": {
        target: "http://www.powhole.com:1885/v1/graphql",
        changeOrigin: true,
        pathRewrite: {
          "/v1/graphql": "",
        },
      },
      //授权  请求数据格式:{"deviceKey","code":"00005","name":"张三","threshold":"70"}
      //取消授权  请求数据格式:{"deviceKey","code":"00005"}
      // "/employee/": {
      // 	target: "http://27.188.72.129:19901/",
      // 	changeOrigin: true,
      // 	pathRewrite: {
      // 		"/employee/": ""
      // 	}
      // }
      // //请求数据格式:{"deviceKey","code":"00005"}
      // "/Employee/": {
      // 	target: "http://94.191.106.35:9901/delEmployee",
      // 	changeOrigin: true,
      // 	pathRewrite: {
      // 		"/delEmployee": ""
      // 	}
      // }
    },
  },

  chainWebpack: (config) => {
    // svg
    config.module.rule("svg").uses.clear();

    config.module
      .rule("svg-sprite-loader")
      .test(/.svg$/)
      .exclude.add(/node_modules/)
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "[name]",
      });

    // 去掉元素之间空格
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap((options) => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    if (isProduction) {
      config.performance.set("hints", false);

      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial",
          },
          commons: {
            name: "chunk-cool",
            test: resolve("src/cool"),
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
    }
  },
};
