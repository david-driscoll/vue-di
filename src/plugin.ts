import 'reflect-metadata';
import { CompositeDisposable } from 'ts-disposables';
import Vue, { VueConstructor } from 'vue';
import { Container } from './container';
// tslint:disable: no-unsafe-any strict-boolean-expressions

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

    function findContainer(instance: Vue): Container {
        if (instance.$container) {
            return instance.$container;
        }

        if (instance.$parent) {
            return findContainer(instance.$parent);
        }

        return Vue.container || Container.instance;
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

            Object.defineProperty(this, '$container', {
                configurable: false,
                enumerable: true,
                value: container,
                writable: false,
            });

            if (createContainer) {
                disposable.add(container);
            }
        },
        destroyed(this: { $container: Container }) {
            (this as any).__$disposable.dispose();
        },
    });
}
