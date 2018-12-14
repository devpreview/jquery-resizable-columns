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
 * Webpack configuration
 *
 * See: https://webpack.js.org/configuration/
 */
module.exports = (options = {}) => {
    return {
        /**
         * Instructs webpack to target a specific environment.
         *
         * See: https://webpack.js.org/concepts/targets/
         */
        target: "web",

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
            'index': helpers.root('src', 'index.js')
        },
    };
};
