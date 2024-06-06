const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const portfinder = require("portfinder");

module.exports = async (env, argv) => {
  const isDevelopment = argv.mode === "development";
  const defaultPort = 3000;

  const port = await portfinder.getPortPromise({
    port: defaultPort,
  });

  return {
    mode: isDevelopment ? 'development' : 'production',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    devServer: {
      port: port,
      hot: true,
      open: true,
      historyApiFallback: true, // Añadir esta línea
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.css$/,
          use: [
            "style-loader",
            "css-loader",
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
  };
};
