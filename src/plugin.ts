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
        instance: Vue & { container?: Container },
        disposable: CompositeDisposable,
        dependencies: { [key: string]: symbol | string | { new (...args: any[]): any } } | undefined
    ) {
        if (!dependencies) return;

        for (const key in dependencies) {
            if (dependencies.hasOwnProperty(key)) {
                // tslint:disable-next-line:no-non-null-assertion
                const value = instance.container!.get(dependencies[key]);
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

    function findContainer(instance: Vue): Container {
        if (instance.container) {
            return instance.container;
        }

        if (instance.$parent) {
            return findContainer(instance.$parent);
        }

        return Vue.container;
    }

    Vue.mixin({
        beforeCreate() {
            const createContainer = !!((this as any).dependencies || this.$options.dependencies);
            const container = findContainer(this);

            if (createContainer) {
                const containerInstance = createContainer ? container.createChild() : container;

                Object.defineProperty(this, 'container', {
                    enumerable: true,
                    configurable: false,
                    writable: false,
                    value: containerInstance,
                });

                const disposable = new CompositeDisposable();
                (this as any)['__$disposable'] = disposable;
                if (createContainer) {
                    disposable.add(containerInstance);
                }
                getDependencies(this, disposable, (this as any).dependencies);
                getDependencies(this, disposable, this.$options.dependencies);
            }
        },
        destroyed(this: { container: Container }) {
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
        container?: Container;
    }
}

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        dependencies?: { [key: string]: symbol | string | { new (...args: any[]): any } };
    }
}
