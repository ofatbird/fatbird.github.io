// new tool for gitpages, also as a review for webpackcd 
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FreindlyErrors = require('friendly-errors-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const isProd = process.env.NODE_ENV === 'production'
console.log(process.env.NODE_ENV)
// const CleanWebpackPlugin = require('clean-webpack-plugin')
const plugins = isProd ? [
  new ExtractTextPlugin('css/[name].css'),
  new HtmlWebpackPlugin({
    template: 'index.html',
    filename: 'index.html',
    inject: false,
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      drop_console: true
    }
  })
] : [
  new webpack.HotModuleReplacementPlugin(),
  new FreindlyErrors(),
  new HtmlWebpackPlugin({
    template: 'index.html',
    filename: 'index.html',
  })
]
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'js/app.js',
    path: path.resolve(__dirname, '../')
  },
  devtool: !isProd ? 'inline-source-map' : undefined,
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: ['babel-preset-env'],
              plugins: ['babel-plugin-transform-runtime'],
            // You must run npm install babel-plugin-transform-runtime --save-dev to include this in your project and babel-runtime itself as a dependency with npm install babel-runtime --save.
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: !isProd ? [
          'style-loader',
          'css-loader'
        ] : ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: path.resolve(__dirname, '../medias/images')
            }
          }
        ]
      }
    ]
  },
  plugins,
  // in development
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, '../'),
    host: '0.0.0.0',
    disableHostCheck: true,
    port: 3000,
    quiet: true
  }
}
