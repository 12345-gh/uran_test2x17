'use strict';

const webpack = require("webpack");
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const app = __dirname + "/src"; // __dirname - it is root of project
const dist = __dirname + "/dist";
const publicDistPath = "/";

module.exports = {
	context: app, // Folder with project

	entry: { // What files will use for start project
		app: "./index.bootstrap.js",
		// app: ["./some.js", "./next.js"],
		// vendor: "./vendor.js", // If need more than one output file: dist/app.bundle.js, dist/vendor.bundle.js
	},

	output: { // Output folder prod
		path: dist,
		publicPath: publicDistPath,
		filename: "[name].bundle.js", //[name] - is name in entry: {app: ...} object
		// library: 'myClassName',  // add global name like window.myClassName
	},

	resolve: { // Where find import modules in project
		modules: [path.resolve(__dirname, "src"), "node_modules"]
	},

	module: { // *-loader by file type
		rules: [
			{
				test: /\.html$/,
				loaders: [
					{
						loader: 'ngtemplate-loader',
						query: {
							relativeTo: app
						}
					}, {
						loader: 'html-loader',
						query: {
							attrs: ['img:src', 'img:data-src']
						}
					}
				]
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/, // ignore all files in the node_modules folder
				use: [
					{
						loader: "babel-loader", // Babel + ES6
						// options: {presets: ["es2015"]} // in .babelrc
						query: {
							cacheDirectory: false
						}
					},
					'baggage-loader?[file].html&[file].css',
					{
						loader: 'jshint-loader'
					}
				]
			},
			{
				test: /\.(sass|scss|css)$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'postcss-loader', 'sass-loader']
				})
			},
			{
				test: /\.(woff2|woff|ttf|eot|svg)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loaders: [
					{
						loader: 'url-loader',
						query: {
							name: 'fonts/[name]_[hash].[ext]'
						}
					}
				]
			},
			{
				test: /\.(jpe?g|png|gif)$/i,
				loaders: [
					{
						loader: 'url-loader',
						query: {
							name: 'img/[name]_[hash].[ext]',
							limit: 10000
						}
					}
				]
			},

		],
	},

	plugins: [
		// new webpack.optimize.CommonsChunkPlugin({ // The output files will not have modules loaded 2 or more times
		// 	name: "commons",                        // it will be located in commons.js
		// 	filename: "./js/commons.js",
		// 	// async: true,
		// 	// children: true,
		// 	minChunks: Infinity
		// }),
		new ExtractTextPlugin('./css/style.css'),
	],

	//watch: true,

	devtool: 'source-map',

	devServer: { // What must be run webpack-dev-sever
		contentBase: app,
	}
};