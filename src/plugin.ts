import 'reflect-metadata';
import { CompositeDisposable, isDisposable } from 'ts-disposables';
import Vue, { VueConstructor } from 'vue';
import { InjectOptions } from 'vue/types/options';
import { Container } from './container';
import { Key } from './types';

function isVdiInjection(value: any): value is { key: Key<any> } {
    return value && value.key;
}

export interface IOptions {
    container: Container;
}

export function install(outerVue: any, outerOptions: any = {}) {
    // tslint:disable-next-line:variable-name no-shadowed-variable
    const Vue: VueConstructor = outerVue;
    const options: Partial<IOptions> = outerOptions;

    return innerInstall(Vue, options);
}
// tslint:disable-next-line:no-shadowed-variable variable-name
function innerInstall(Vue: VueConstructor, options: Partial<IOptions>) {
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
        key: Key<any>
    ) {
        const value = container.get(key);

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
            if (isVdiInjection(dep)) {
                resolveValue(instance, container, disposable, key, dep.key);
                delete dependencies[key];
                continue;
            }
            if ( typeof dep === 'object' && dep.from) {
                // tslint:disable-next-line: strict-type-predicates
                if (isVdiInjection(dep.from)) {
                    resolveValue(instance, container, disposable, key, dep.from.key);
                    delete dependencies[key];
                    continue;
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

            const disposable = (this as any).__$disposable || new CompositeDisposable();
            (this as any).__$disposable = disposable;

            const container = createContainer
                ? findContainer(this).createChild()
                : findContainer(this);

            if (this.$options.registerServices) this.$options.registerServices(container);

            Object.defineProperty(this, 'container', {
                enumerable: true,
                configurable: false,
                writable: false,
                value: container,
            });

            if (createContainer) {
                disposable.add(container);
            }

            // if (this.$options.dependencies) {
            //     getDependencies(this, container, disposable, this.$options.dependencies);
            // }
            if (this.$options.inject) {
                getInjections(this, container, disposable, this.$options.inject);
            }
        },
        destroyed(this: { container: Container }) {
            (this as any).__$disposable.dispose();
        },
    });
}
