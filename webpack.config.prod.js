const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const dotenv = require('dotenv');
const WorkboxPlugin = require('workbox-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require("path");

// call dotenv and it will return an Object with a parsed key 
const env = dotenv.config().parsed;

// reduce it to a nice object, the same as before
const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
}, {});

const AppName = "PWA";

module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            optipng: {
                                enabled: true,
                                optimizationLevel: 5
                            },
                            pngquant: {
                                quality: '35-50',
                                speed: 11,
                                strip: true
                            },
                            svgo: {
                                enabled: false
                            }
                        }
                    }
                ]
            }
        ]
    },
    entry: ['babel-polyfill', './src/index.js'],
    output: {
        filename: "[name].[hash].bundle.js",
        path: __dirname + "/dist"
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
            favicon: "./src/assets/favicon.ico"
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[hash].css",
            chunkFilename: "[id].[hash].css"
        }),
        new webpack.DefinePlugin(envKeys),
        new WebpackPwaManifest({
            name: AppName,
            short_name: AppName,
            description: AppName,
            background_color: '#0072FF',
            theme_color: '#0072FF',
            inject: true,
            ios: {
                'apple-mobile-web-app-title': AppName,
                'apple-mobile-web-app-status-bar-style': 'white'
            },
            crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
            icons: [
                {
                    src: path.resolve('src/assets/icon.png'),
                    sizes: [96, 128, 192, 256, 384, 512], // multiple sizes
                    destination: path.join('icons', 'ios'),
                    ios: true
                },
                {
                    src: path.resolve('src/assets/icon.png'),
                    size: 512,
                    destination: path.join('icons', 'ios'),
                    ios: 'startup'
                },
                {
                  src: path.resolve('src/assets/icon.png'),
                  sizes: [36, 48, 72, 96, 144, 192, 512],
                  destination: path.join('icons', 'android')
                }
            ]
        }),
        new WorkboxPlugin.GenerateSW({
            // these options encourage the ServiceWorkers to get in there fast
            // and not allow any straggling "old" SWs to hang around
            swDest: 'sw.js',
            clientsClaim: true,
            skipWaiting: true,
            cleanupOutdatedCaches: true
        })
    ],
    optimization: {
        splitChunks: {
            chunks: "all",
            minSize: 0
        },
        minimize: true,
        minimizer: [
            new UglifyJsPlugin({
                cache: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    mode: "production"
};
console.log('Running production build...');