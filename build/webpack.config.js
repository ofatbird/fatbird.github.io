const webpack = require('webpack')
const path = require('path')

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'app.js',
		path: path.resolve(__dirname, '../js')
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['babel-preset-env'],
							plugins: ['babel-plugin-transform-runtime'],
							// You must run npm install babel-plugin-transform-runtime --save-dev to include this in your project and babel-runtime itself as a dependency with npm install babel-runtime --save.
						}
					}
				]
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
}