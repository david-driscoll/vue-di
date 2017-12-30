import { Container, Resolver } from 'aurelia-dependency-injection';
import Vue, { VueConstructor } from 'vue';
import './DisposableContainer';

import 'reflect-metadata';
import { CompositeDisposable, Disposable, isDisposable } from 'ts-disposables';

function isResolver(value: any): value is Resolver {
    return value.get && typeof value.get === 'function';
}

export function install(Vue: VueConstructor, options: any) {
    (Vue.container = new Container()).makeGlobal();

    function getDependencies(
        instance: Vue,
        container: Container,
        disposable: CompositeDisposable,
        dependencies:
            | { [key: string]: symbol | string | { new (...args: any[]): any } | Resolver }
            | undefined
    ) {
        if (!dependencies) return;

        for (const key in dependencies) {
            if (dependencies.hasOwnProperty(key)) {
                // tslint:disable-next-line:no-non-null-assertion
                const resolverOrType = dependencies[key];
                let value: any;
                if (isResolver(resolverOrType)) {
                    value = resolverOrType.get(container, undefined);
                } else {
                    value = container.get(dependencies[key]);
                }

                if (value && isDisposable(value)) {
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
            const createContainer = (this.$options.createChildContainer);

            const disposable = (this as any)['__$disposable'] || new CompositeDisposable();
            (this as any)['__$disposable'] = disposable;

            const container = createContainer ? findContainer(this).createChild() : findContainer(this);

            if (this.$options.registerServices) this.$options.registerServices(container);

            if (createContainer) {
                Object.defineProperty(this, 'container', {
                    enumerable: true,
                    configurable: false,
                    writable: false,
                    value: container,
                });

                disposable.add(container);
            }

            getDependencies(this, container, disposable, this.$options.dependencies);
        },
        destroyed(this: { container: Container }) {
            (this as any)['__$disposable'].dispose();
        },
    });
}

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
        dependencies?: {
            [key: string]: symbol | string | { new (...args: any[]): any } | Resolver;
        };
        createChildContainer?: boolean;
        registerServices?(container: Container): void;
    }
}
