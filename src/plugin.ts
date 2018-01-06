import 'reflect-metadata';
import { _emptyParameters } from "./container/Container";
import { CompositeDisposable, Disposable, isDisposable } from 'ts-disposables';
import Vue, { VueConstructor } from 'vue';
import { InjectOptions } from 'vue/types/options';
import { Container } from './container';
import { isResolver, Resolver } from './types';

export interface IOptions {
    container: Container
}

export function install(innerVue: any, options: Partial<IOptions> = {}) {
    const Vue: VueConstructor = innerVue;
    if (!options.container) {
        (Vue.container = new Container()).makeGlobal();
    } else {
        Vue.container = options.container;
        Vue.container.makeGlobal();
    }

    function resolveValue(
        instance: Vue,
        container: Container,
        disposable: CompositeDisposable,
        name: string | symbol,
        resolverOrType: any
    ) {
        let value: any;
        if (isResolver(resolverOrType)) {
            value = resolverOrType.get(container, undefined as any);
        } else {
            value = container.get(resolverOrType);
        }

        if (value && isDisposable(value)) {
            disposable.add(value);
        }

        Object.defineProperty(instance, name, {
            enumerable: true,
            configurable: false,
            writable: false,
            value,
        });
    }

    function getDependencies(
        instance: Vue,
        container: Container,
        disposable: CompositeDisposable,
        dependencies:
            | { [key: string]: symbol | string | { new(...args: any[]): any } | Resolver<any> }
    ) {
        for (const key in dependencies) {
            if (dependencies.hasOwnProperty(key)) {
                // tslint:disable-next-line:no-non-null-assertion
                const resolverOrType = dependencies[key];
                resolveValue(instance, container, disposable, key, resolverOrType);
            }
        }
    }

    function getInjections(
        instance: Vue,
        container: Container,
        disposable: CompositeDisposable,
        dependencies: InjectOptions
    ) {
        if (Array.isArray(dependencies)) {
            return;
        }

        // tslint:disable-next-line:forin
        for (const key in dependencies) {
            const dep = dependencies[key];
            if (typeof dep !== 'symbol' && typeof dep !== 'string') {
                if (dep.from) {
                    if (container.hasHandler(dep.from) || typeof dep.from === 'function') {
                        resolveValue(instance, container, disposable, key, dep.from);
                        delete dependencies[key];
                        continue;
                    }
                }
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
            const createContainer = this.$options.createChildContainer;

            const disposable = (this as any)['__$disposable'] || new CompositeDisposable();
            (this as any)['__$disposable'] = disposable;

            const container = createContainer
                ? findContainer(this).createChild()
                : findContainer(this);

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

            if (this.$options.dependencies) {
                getDependencies(this, container, disposable, this.$options.dependencies);
            }
            if (this.$options.inject) {
                getInjections(this, container, disposable, this.$options.inject);
            }
        },
        destroyed(this: { container: Container }) {
            (this as any)['__$disposable'].dispose();
        },
    });
}
