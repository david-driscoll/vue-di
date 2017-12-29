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
import './DisposableContainer';

import 'reflect-metadata';
import { isDisposable, Disposable, CompositeDisposable } from 'ts-disposables';

export function install(Vue: VueConstructor, options: any) {
    (Vue.container = new Container()).makeGlobal();

    function getDependencies(
        instance: Vue & { container: Container },
        disposable: CompositeDisposable,
        dependencies:
            | { [key: string]: symbol | string | { new (...args: any[]): any } }
            | undefined
    ) {
        if (!dependencies) return;

        for (const key in dependencies) {
            if (dependencies.hasOwnProperty(key)) {
                const value = instance.container.get(dependencies[key]);
                if (isDisposable(value)) {
                    disposable.add(value);
                }
                Object.defineProperty(instance, key, {
                    enumerable: true,
                    configurable: false,
                    writable: false,
                    value,
                });
            }
        }
    }

    Vue.mixin({
        beforeCreate() {
            const container =
                this.$parent && this.$parent.container
                    ? this.$parent.container
                    : Vue.container;
            const containerInstance =
                (this as any).dependencies || this.$options.dependencies
                    ? container.createChild()
                    : container;

            Object.defineProperty(this, 'container', {
                enumerable: true,
                configurable: false,
                writable: false,
                value: containerInstance,
            });

            const disposable = new CompositeDisposable();
            (this as any)['__$disposable'] = disposable;
            getDependencies(this, disposable, (this as any).dependencies);
            getDependencies(this, disposable, this.$options.dependencies);
        },
        destroyed(this: { container: Container }) {
            this.container.dispose();
            (this as any)['__$disposable'].dispose();
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
