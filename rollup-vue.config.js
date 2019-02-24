import typescript from 'rollup-plugin-typescript2';

export default {
    input: './src/vue.ts',
    output: [
        {
            name: 'vue-di',
            file: './dist/vue.esm.js',
            format: 'es',
            sourcemap: true,
        },
        {
            name: 'vue-di',
            file: './dist/vue.cjs.js',
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
                    'src/vuex.ts',
                ],
            },
            typescript: require('typescript'),
        }),
    ],
};
