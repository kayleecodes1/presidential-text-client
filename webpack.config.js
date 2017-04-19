var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    node:{
        fs: "empty"
    },
    devtool: 'eval',
    entry: isProduction ? [
        './src/index'
    ] : [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        './src/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: isProduction ? 'bundle.min.js' : 'bundle.js'
    },
    plugins: isProduction ? [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/index.tpl.html')
        }),
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(false)
        })
    ] : [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/index.tpl.html')
        }),
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(true),
            __API_URL__: JSON.stringify('http://ec2-54-209-229-214.compute-1.amazonaws.com:8081')
        })
    ],
    resolve: {
        extensions: ['.scss', '.js', '.jsx'],
        modules: [
            path.join(__dirname, 'node_modules')
        ]
    },
    module: {
        rules: [{
            test: /\.png$/,
            loader: 'url-loader?mimetype=image/png'
        }, {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader?limit=10000&mimetype=application/font-woff'
        }, {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'file-loader'
        }, {
            test: /\.html$/,
            loader: 'html-loader'
        }, {
            test: /\.css$/,
            loaders: ['style-loader', 'css-loader']
        }, {
            test: /\.scss$/,
            loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
        }, {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loaders: ['babel-loader'],
            include: path.join(__dirname, 'src')
        }]
    }
};
