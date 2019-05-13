// strange bug

require('ts-node').register({
    project: 'tsconfig.json',
    transpileOnly: true,
    compilerOptions: {
        target: 'es5',
        module: 'commonjs',
        allowJs: true
    },
});
require('jsdom-global')();

const vueFull = require('vue/dist/vue.common.js');
vueFull.default = vueFull;
vueFull.full = 'full';

const vue = require('vue');
Object.assign(vue, vueFull);

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var sinonChai = require('sinon-chai');

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();
