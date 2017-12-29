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
import Vue, { VueConstructor } from 'vue';
import { DisposableContainer } from './DisposableContainer';

import 'reflect-metadata';

export function install(Vue: VueConstructor, options: any) {
    const container = (Vue.container = new Container());
    container.makeGlobal();

    function getDependencies(
        instance: Vue & { container: Container },
        dependencies: { [key: string]: symbol | string | { new (...args: any[]): any } } | undefined
    ) {
        if (!dependencies) return;

        for (const key in dependencies) {
            if (dependencies.hasOwnProperty(key)) {
                Object.defineProperty(instance, key, {
                    enumerable: true,
                    configurable: false,
                    writable: false,
                    value: instance.container.get(dependencies[key]),
                });
            }
        }
    }

    Vue.mixin({
        beforeCreate() {
            this.container = DisposableContainer.wrap(
                (this.$parent && this.$parent.container || Vue.container).createChild()
            );
            getDependencies(this, (this as any).dependencies);
            getDependencies(this, this.$options.dependencies);
        },
        destroyed(this: { container: DisposableContainer }) {
            this.container.dispose();
        },
    });
}

export default { install };

declare module 'vue/types/vue' {
    interface VueConstructor {
        container: Container;
    }

    interface Vue {
        container: Container;
    }
}

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        dependencies?: { [key: string]: symbol | string | { new (...args: any[]): any } };
    }
}
