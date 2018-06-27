import typescript from 'rollup-plugin-typescript2';

export default {
    input: './src/di.ts',
    output: [
        {
            name: 'di',
            file: './dist/di.esm.js',
            format: 'es',
            sourcemap: true,
        },
        {
            name: 'di',
            file: './dist/di.cjs.js',
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
