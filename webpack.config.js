const path = require('path');
const copyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    entry: {
        ServiceWorker: './src/background.js',
        contentScript: './src/contentScript.js',
        popup: './src/popup.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
      
    },
    mode: 'development',
    watch: true,
    devtool: 'inline-source-map',
    plugins: [
        new copyWebpackPlugin({
            patterns:[{from:'static'}]
        })
    ]
};