const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        vanilla: [
            'webpack-hot-middleware/client',
            './example/vanilla/index.js'
        ],
        react: [
            'webpack-hot-middleware/client',
            './example/react/index.js'
        ]
    },
    output: {
        path: path.join(__dirname, 'example'),
        filename: '[name]/bundle.[name].js',
        publicPath: '/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            { test: /\.js/, loader: 'babel', exclude: /node_modules/ }
        ]
    }
};