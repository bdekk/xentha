module.exports = {
    entry: "./server.js",
    output: {
        filename: "bundle.js",
    },
    mode: 'development',
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            {
                test: /\.js$/,
                enforce: "pre",
                loader: "source-map-loader"
            }
        ]
    },
    //https://github.com/webpack-contrib/css-loader/issues/447
    node: {
        console: false,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    //https://github.com/sequelize/sequelize/issues/7509
    externals: ['pg', 'sqlite3', 'tedious', 'pg-hstore', 'node-gyp-build', 'sequelize', 'bindings', 'express']
};