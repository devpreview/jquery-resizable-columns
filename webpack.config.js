const path = require('path');
const _root = path.resolve(__dirname, '.');

const helpers = {
    /**
     * Get root project path
     */
    root: function (args) {
        args = Array.prototype.slice.call(arguments, 0);
        return path.join.apply(path, [_root].concat(args));
    },

    /**
     * Get app version
     */
    appVersion: require("./package.json").version
};

/**
 * Webpack Plugins
 */
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/**
 * Webpack configuration
 *
 * See: https://webpack.js.org/configuration/
 */
module.exports = (options = {}, argv = {}) => {
    options.mode = argv.mode !== 'development' ? 'production' : 'development';

    return {
        /**
         * Instructs webpack to target a specific environment.
         *
         * See: https://webpack.js.org/concepts/targets/
         */
        target: "web",

        /**
         * Providing the mode configuration option tells webpack to use its built-in optimizations accordingly.
         *
         * See: https://webpack.js.org/concepts/mode/
         */
        mode: options.mode,

        /**
         * These options change how modules are resolved.
         *
         * See: https://webpack.js.org/configuration/resolve/
         */
        resolve: {
            /**
             * Automatically resolve certain extensions.
             *
             * See: https://webpack.js.org/configuration/resolve/#resolve-extensions
             */
            extensions: ['.js', '.json'],

            /**
             * Tell webpack what directories should be searched when resolving modules.
             *
             * See: https://webpack.js.org/configuration/resolve/#resolve-modules
             */
            modules: [
                helpers.root("src"), helpers.root("node_modules")
            ]
        },

        /*
        * The entry point for the bundle
        *
        * See: http://webpack.github.io/docs/configuration.html#entry
        */
        entry: {
            'resizableColumns': helpers.root('src', 'index.js')
        },

        /**
         * Options affecting the output of the compilation.
         *
         * See: https://webpack.js.org/concepts/output/
         * See: https://webpack.js.org/configuration/output/
         */
        output: {
            /**
             * Specifies the name of each output file on disk.
             * IMPORTANT: You must not specify an absolute path here!
             *
             * See: https://webpack.js.org/configuration/output/#output-filename
             */
            filename: options.mode == 'development' ? 'jquery.[name].dev.js' : 'jquery.[name].min.js',

            /**
             * The output directory as absolute path (required).
             *
             * See: https://webpack.js.org/configuration/output/#output-path
             */
            path: helpers.root('dist')
        },

        /**
         * The externals configuration option provides a way of excluding dependencies from the output bundles.
         *
         * See: https://webpack.js.org/configuration/externals/
         */
        externals: {
            jquery: 'jQuery'
        },

        /**
         * Configuration regarding modules.
         *
         * See: https://webpack.js.org/configuration/module/
         */
        module: {
            /**
             * Rules for modules (configure loaders, parser options, etc.)
             *
             * See: https://webpack.js.org/configuration/module/#module-rules
             */
            rules: [
                /**
                 * SASS Loader.
                 *
                 * See: https://github.com/webpack-contrib/sass-loader
                 */
                {
                    test: /\.s?[ac]ss$/,
                    use: [
                        /*options.mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',*/
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader', // Run post css actions
                            options: {
                                sourceMap: true,
                                plugins: (loader) => {
                                    let plugins = [ // post css plugins, can be exported to postcss.config.js
                                        require('precss')
                                    ];
                                    if (options.mode === 'production') {
                                        plugins.push(require('cssnano')({
                                            preset: 'default'
                                        }));
                                    }
                                    return plugins;
                                }
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                }
            ]
        },

        /**
         * Add additional plugins to the compiler.
         *
         * See: http://webpack.github.io/docs/configuration.html#plugins
         */
        plugins: [
            /**
             * This plugin extract CSS into separate files.
             * It creates a CSS file per JS file which contains CSS.
             *
             * See: https://github.com/webpack-contrib/mini-css-extract-plugin
             */
            new MiniCssExtractPlugin({
                filename: options.mode == 'development' ? 'jquery.[name].dev.css' : 'jquery.[name].min.css',
            })
        ],

        /**
         * Choose a style of source mapping to enhance the debugging process.
         * These values can affect build and rebuild speed dramatically.
         *
         * See: https://webpack.js.org/configuration/devtool/
         */
        devtool: 'cheap-module-source-map'

    };
};
