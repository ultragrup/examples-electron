import WebPack from 'webpack'
import MinifyPlugin from 'babel-minify-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

export default (env) => {
  const MAIN = env && env.main
  const PROD = !!(env && env.prod)

  return {
    target: MAIN ? 'electron-main' : 'web',
    entry: MAIN ? './src/js/main/App.js' : './src/js/renderer/App.js',
    output: {
      path: PROD ? `${__dirname}/dist/src/assets` : `${__dirname}/src/assets`,
      filename: MAIN ? 'main.js' : 'renderer.js'
    },
    devtool: PROD ? '' : 'source-map',
    node: {
      __dirname: false,
      __filename: false
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract([
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: PROD ? '[hash:base64]' : '[name]-[local]-[hash:base64:5]',
                url: false,
                importLoaders: 1,
                sourceMap: !(PROD),
                minimize: PROD ? { autoprefixer: false } : false
              }
            },
            {
              loader: 'sass-loader',
              options: {
                outputStyle: PROD ? 'compressed' : 'expanded',
                sourceMap: !(PROD)
              }
            }
          ])
        }
      ]
    },
    plugins: PROD ? [
      new MinifyPlugin({
        replace: {
          'replacements': [
            {
              'identifierName': 'DEBUG',
              'replacement': {
                'type': 'numericLiteral',
                'value': 0
              }
            }
          ]
        }
      }, {}),
      new WebPack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new ExtractTextPlugin({ filename: 'bundle.css' })
    ] : [
      new ExtractTextPlugin({ filename: 'bundle.css' })
    ]
  }
}
