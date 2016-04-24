/**
 * Created by blake on 4/17/16.
 */
var rucksack = require('rucksack-css')
var path = require('path')
var webpack = require('webpack')

module.exports = {
    context: path.resolve(__dirname, './src'),
    entry: {
        index: './index.js',
        html: './index.html',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'file?name=[name].[ext]'
            }, {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            },
            {
                test: /\.scss$/,
                include: /style/,
                loaders: ['style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader']
            },
            {
                test: /\.css$/,
                include: /style/,
                loaders: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                //loader: 'file?name=assets/[name][hash:8].[ext]'
                loader: 'file?name=assets/[name].[ext]'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    postcss: [
        rucksack({
            autoprefixer: true
        })
    ],
    plugins: [
        new webpack.DefinePlugin({
            __DEV__: process.env.DEBUG || 'false'
        })
    ],
    devServer: {
        contentBase: './src',
        hot: true
    },
    //devtool: 'source-map'
}