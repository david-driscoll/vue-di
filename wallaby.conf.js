module.exports = function(wallaby) {
    return {
        files: ['src/**/*.ts'],

        tests: ['test/**/*.spec.ts'],

        env: {
            type: 'node',
        },

        testFramework: 'mocha',

        compilers: {
            '**/*.ts': wallaby.compilers.typeScript({
                // TypeScript compiler specific options
                // https://github.com/Microsoft/TypeScript/wiki/Compiler-Options
                // (no need to duplicate tsconfig.json, if you have it, it'll be automatically used)
            }),
        },

        setup: function(wallaby) {
            require(wallaby.localProjectDir  + '/test/env.js');
            // wallaby.testFramework is jasmine/QUnit/mocha object
            // you can access 'window' object in a browser environment,
            // 'global' object or require(...) something in node environment
        },
    };
};
