const path = require('path');
const copyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    entry: {
        ServiceWorker: './src/background.js',
        contentScript: './src/contentScript.js',
        popup: './src/popup.bundle.js'
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
            patterns: [{ from: 'static' }]
        })
    ],
    module: {
        rules: [
            {
                test: /\.png$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'images',
                        },
                    },
                ],
            },
            {
            
            test: /\.css$/,
            // include: path.resolve(__dirname, 'src'),
            use: [
                'style-loader',
                { loader: 'css-loader', options: { importLoaders: 1 } },
                'postcss-loader'
            ],
          },
        ],

},
    devServer: {
    watchContentBase: true,
        contentBase: path.join(__dirname, 'dist'),
            open: true,
      },
};