import {
    all,
    autoinject,
    Container,
    factory,
    inject,
    invoker,
    lazy,
    newInstance,
    optional,
    parent,
    registration,
    singleton,
    transient,
} from 'aurelia-dependency-injection';
import { VueConstructor } from 'vue';

export function install(Vue: VueConstructor, options: any) {
    const container = (Vue.container = new Container());
    container.makeGlobal();
}

export default { install };

declare module 'vue/types/vue' {
    interface VueConstructor {
        container: Container;
    }
}
