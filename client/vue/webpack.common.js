const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = env => {
    const buildPath = "/public/build";

    return {
        entry: {
            main: "./src/index.jsx",
        },
        plugins: [
            new CleanWebpackPlugin({cleanStaleWebpackAssets: false}),
            new HtmlWebpackPlugin({
                title: "Warrant Demo App",
                filename: "index.html",
                template: "public/index.html",
                chunks: ["vendor", "main"],
            }),
        ],
        output: {
            filename: "[name].[contenthash].js",
            path: __dirname + buildPath,
            publicPath: '/',
        },

        // Configure webpack-dev-server
        devServer: {
            compress: true,
            hot: true,
            historyApiFallback: true,
            port: 5050,

            devMiddleware: {
                publicPath: "/",
            }
        },

        resolve: {
            // Add '.js' and '.jsx' as resolvable extensions.
            extensions: [".js", ".jsx", ".js", ".json"],

            alias: {
                "vue$": "vue/dist/vue.esm.js"
            }
        },

        module: {
            rules: [
                // All files with a '.js' or '.jsx' extension will be handled by 'babel-loader'.
                {
                    test: /\.(js|jsx)?$/,
                    exclude: /node_modules/,
                    loader: "babel-loader",
                },
            ]
        },
    }
};
