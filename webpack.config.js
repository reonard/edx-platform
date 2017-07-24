/* eslint-env node */

'use strict';

var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var StringReplace = require('string-replace-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var isProd = process.env.NODE_ENV === 'production';

var namespacedRequireFiles = [
    path.resolve(__dirname, 'common/static/common/js/components/views/feedback_notification.js'),
    path.resolve(__dirname, 'common/static/common/js/components/views/feedback.js')
];

var extractSass = new ExtractTextPlugin({
    filename: 'css/[name].[contenthash].css',
    disable: !isProd
});

var wpconfig = {
    context: __dirname,

    entry: {
        CourseOutline: './openedx/features/course_experience/static/course_experience/js/CourseOutline.js',
        CourseSock: './openedx/features/course_experience/static/course_experience/js/CourseSock.js',
        WelcomeMessage: './openedx/features/course_experience/static/course_experience/js/WelcomeMessage.js',
        DropdownRenderer: './cms/static/js/features/header/DropdownRenderer.jsx',
        Import: './cms/static/js/features/import/factories/import.js',
        UserMenu: './cms/static/js/features/header/UserMenu.jsx'
    },

    output: {
        path: path.resolve(__dirname, 'common/static/bundles'),
        filename: isProd ? '[name].[chunkhash].js' : '[name].js',
        libraryTarget: 'window'
    },

    devtool: isProd ? false : 'source-map',

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        new webpack.LoaderOptionsPlugin({
            debug: !isProd
        }),
        new BundleTracker({
            path: process.env.STATIC_ROOT_CMS,
            filename: 'webpack-stats.json'
        }),
        new BundleTracker({
            path: process.env.STATIC_ROOT_LMS,
            filename: 'webpack-stats.json'
        }),
        new webpack.ProvidePlugin({
            _: 'underscore',
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),

        // Note: Until karma-webpack releases v3, it doesn't play well with
        // the CommonsChunkPlugin. We have a kludge in karma.common.conf.js
        // that dynamically removes this plugin from webpack config when
        // running those tests (the details are in that file). This is a
        // recommended workaround, as this plugin is just an optimization. But
        // because of this, we really don't want to get too fancy with how we
        // invoke this plugin until we can upgrade karma-webpack.
        new webpack.optimize.CommonsChunkPlugin({
            // If the value below changes, update the render_bundle call in
            // common/djangoapps/pipeline_mako/templates/static_content.html
            name: 'commons',
            filename: 'commons.js',
            minChunks: 2
        }),

        extractSass
    ],

    module: {
        rules: [
            {
                test: namespacedRequireFiles,
                loader: StringReplace.replace(
                    ['babel-loader'],
                    {
                        replacements: [
                            {
                                pattern: /\(function ?\(define\) ?\{/,
                                replacement: function() { return ''; }
                            },
                            {
                                pattern: /\}\)\.call\(this, define \|\| RequireJS\.define\);/,
                                replacement: function() { return ''; }
                            }
                        ]
                    }
                )
            },
            {
                test: /\.(js|jsx)$/,
                exclude: [
                    /node_modules\/(?!(paragon)\/).*/,
                    namespacedRequireFiles
                ],
                use: 'babel-loader'
            },
            {
                test: /\.coffee$/,
                exclude: /node_modules/,
                use: 'coffee-loader'
            },
            {
                test: /\.underscore$/,
                use: 'raw-loader'
            },
            {
                // This file is used by both RequireJS and Webpack and depends on window globals
                // This is a dirty hack and shouldn't be replicated for other files.
                test: path.resolve(__dirname, 'cms/static/cms/js/main.js'),
                use: {
                    loader: 'imports-loader',
                    options: {
                        AjaxPrefix:
                            'exports-loader?this.AjaxPrefix!../../../../common/static/coffee/src/ajax_prefix.coffee'
                    }
                }
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[name]__[local]___[hash:base64:5]'
                        }
                    }, {
                        loader: 'sass-loader',
                        options: {
                            data: '$base-rem-size: 0.625; @import "paragon-reset";',
                            includePaths: [
                                path.join(__dirname, 'node_modules/paragon/src/utils')
                            ],
                            sourceMap: true
                        }
                    }],
                    // use style-loader in development
                    fallback: 'style-loader'
                })
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.jsx', '.json', '.coffee'],
        alias: {
            'edx-ui-toolkit': 'edx-ui-toolkit/src/',  // @TODO: some paths in toolkit are not valid relative paths
            'jquery.ui': 'jQuery-File-Upload/js/vendor/jquery.ui.widget.js',
            jquery: 'jquery/src/jquery'  // Use the non-dist form of jQuery for better debugging + optimization
        },
        modules: [
            'node_modules',
            'common/static/js/vendor/'
        ]
    },

    resolveLoader: {
        alias: {
            text: 'raw-loader'  // Compatibility with RequireJSText's text! loader, uses raw-loader under the hood
        }
    },

    externals: {
        backbone: 'Backbone',
        coursetalk: 'CourseTalk',
        gettext: 'gettext',
        jquery: 'jQuery',
        logger: 'Logger',
        underscore: '_',
        URI: 'URI',
        'react/lib/ExecutionEnvironment': 'react',
        'react/lib/ReactContext': 'react',
        'react/addons': 'react'
    },

    watchOptions: {
        poll: true
    }
};

if (isProd) {
    wpconfig.plugins = wpconfig.plugins.concat([
        new webpack.LoaderOptionsPlugin({  // This may not be needed; legacy option for loaders written for webpack 1
            minimize: true
        }),
        new webpack.optimize.UglifyJsPlugin()
    ]);
}

module.exports = wpconfig;
