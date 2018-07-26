import typescript from 'rollup-plugin-typescript2';

export default {
    input: './src/index.ts',
    output: [
        {
            name: 'index',
            file: './dist/index.esm.js',
            format: 'es',
            sourcemap: true,
        },
        {
            name: 'index',
            file: './dist/index.cjs.js',
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
                    'src/plugin.ts',
                    'src/vue.ts',
                    'src/decorators/invokeAsFactory.ts',
                    'src/decorators/invoker.ts',
                    'src/invokers/FactoryInvoker.ts',
                    'src/resolvers/index.ts',
                ],
            },
            typescript: require('typescript'),
        }),
    ],
};
