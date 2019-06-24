const { resolve } = require('path');
const { writeFileSync, readFileSync } = require('fs');
const _ = require('lodash');

module.exports = {
    mode: 'production',
    entry: {
        di: './src/index.ts',
        nuxt: './nuxt.ts',
        vue: './vue.ts',
        vuex: './vuex.ts',
    },
    output: {
        path: resolve(__dirname, 'dist'),
        filename: '[name].umd.js',
        library: 'VueDI',
        libraryTarget: 'umd',
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    targets: {
                                        ie: '9',
                                    },
                                },
                            ],
                        ],
                    },
                },
            },
            {
                test: /\.tsx?$/,
                use: { loader: 'ts-loader', options: { compilerOptions: { target: 'es5' } } },
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.wasm', '.mjs', '.js', '.jsx', '.json'],
    },
    plugins: [new DtsBundlePlugin()],
    externals: {
        'reflect-metadata': {
            commonjs: 'reflect-metadata',
            commonjs2: 'reflect-metadata',
            amd: 'reflect-metadata',
            root: 'Reflect',
        },
        tslib: {
            commonjs: 'tslib',
            commonjs2: 'tslib',
            amd: 'tslib',
            root: 'tslib',
        },
    },
};

function DtsBundlePlugin() {}
DtsBundlePlugin.prototype.apply = function(compiler) {
    compiler.hooks.afterEmit.tap('DtsBundlePlugin', function(...args) {
        var dts = require('dts-bundle');

        for (const [key, value] of Object.entries(module.exports.entry)) {
            const name = key === 'di' ? 'VueDI' : 'VueDI' + _.upperFirst(key);
            var path = resolve(module.exports.output.path, module.exports.output.filename)
                .replace('[name]', key)
                .replace(/\.(j|t)s$/, '.d.ts');
            dts.bundle({
                name: 'VueDI',
                main: value.replace(/\.(j|t)s$/, '.d.ts'),
                out: path,
                outputAsModuleFolder: true, // to use npm in-package typings
                referenceExternals: true,
            });

            writeFileSync(path, readFileSync(path).toString() + `\nexport as namespace ${name};`);
        }
    });
};
