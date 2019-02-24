import typescript from 'rollup-plugin-typescript2';

export default {
    input: './src/vuex.ts',
    output: [
        {
            name: 'vue-di',
            file: './dist/vuex.esm.js',
            format: 'es',
            sourcemap: true,
        },
        {
            name: 'vue-di',
            file: './dist/vuex.cjs.js',
            format: 'cjs',
            sourcemap: true,
        },
    ],
    plugins: [
        typescript({
            tsconfigOverride: {
                compilerOptions: {
                    module: 'es2015',
                    declaration: true,
                },
                exclude: [
                    'test/**/*.ts',
                    'src/vue.ts',
                ],
            },
            typescript: require('typescript'),
        }),
    ],
};
