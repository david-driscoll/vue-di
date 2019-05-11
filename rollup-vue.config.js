import typescript from 'rollup-plugin-typescript2';

export default {
    input: './vue.ts',
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
                    'vuex.ts',
                ],
            },
            typescript: require('typescript'),
        }),
    ],
};
