/// <reference path="node_modules/webpack-dev-server/types/lib/Server.d.ts"/>
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import { Configuration, DefinePlugin } from 'webpack'

const SRC_ROOT = path.resolve(__dirname, 'src')
const DEST = path.resolve(__dirname, 'dist')

const config: Configuration = {
    entry: {
        main: path.resolve(SRC_ROOT, 'index.tsx')
    },
    output: {
        path: DEST,
        filename: '[name].[contenthash].bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    compilerOptions: {
                        module: 'es2015'
                    }
                }
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                loader: 'file-loader',
            }
        ]
    },
    devServer: {
        host: 'localhost',
        port: 3000,
        open: true,
        historyApiFallback: true,
        proxy: [{
            context: ['/oauth2', '/login/oauth2', '/logout', '/api'],
            target: 'http://localhost:8080'
        }],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(SRC_ROOT, 'public', 'index.html'),
            favicon: path.resolve(SRC_ROOT, 'public', 'favicon.ico')
        }),
        new DefinePlugin({
            VERSION: JSON.stringify(process.env.npm_package_version)
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        },
        extensions: ['.tsx', '.ts', '.js'],
        modules: ['node_modules']
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: true
    }
}

export default config
