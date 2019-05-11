import { Context } from '@nuxt/vue-app';
import { Container } from './src/container/Container';
import { resolve } from 'path';
// tslint:disable no-unsafe-any

export default async function VueDiModule(this: { options: any; nuxt: any }) {
    if (!this.options.build) this.options.build = {};
    if (!this.options.build.optimization) this.options.build.optimization = {};
    this.options.build.optimization.namedModules = true;
    this.options.build.optimization.moduleIds = 'named';

    (this as any).addPlugin({
        src: resolve(__dirname, 'src/nuxtPlugin.js'),
        fileName: 'vue-di.js',
        options: {},
    });
}
VueDiModule.meta = require('./package.json');

declare module '@nuxt/vue-app' {
    interface Context {
        container: Container;
    }
}

declare module 'vue/types/vue' {
    interface Vue {
        $container: Container;
    }
}
