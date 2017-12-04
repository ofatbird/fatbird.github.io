// new tool for gitpages, also as a review for webpackcd 
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FreindlyErrors = require('friendly-errors-webpack-plugin')
// const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'app.js',
		path: path.resolve(__dirname, '../js')
	},
	devtool: 'inline-source-map',
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
				exclude:/node_modules/,
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
				]
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					{
						loader:'file-loader',
						options: {
							outputPath: path.resolve(__dirname,'../medias/images')
						}
					}
				]
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new FreindlyErrors(),
		new HtmlWebpackPlugin({
			template: 'index.html',
			filename: 'index.html'
		}),
	],
	// in development
	devServer: {
		hot: true,
		contentBase: path.resolve(__dirname, '../'),
		host: '0.0.0.0',
		disableHostCheck: true,
		port: 3000,
		quiet: true,
	},
}