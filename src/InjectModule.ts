import { basename, dirname, join } from 'path';
import Vue from 'vue';
import { ActionContext, Store. Module as Mod } from 'vuex';
import { getModule, Module } from 'vuex-module-decorators';
import { ModuleOptions } from 'vuex-module-decorators/dist/types/moduleoptions';
import constants from './constants';
import { Container } from './container';
import { Registration } from './decorators';
import { IRegistration } from './registration/Registration';
import { ConstructorOf, Resolver } from './types';

// tslint:disable: no-unsafe-any strict-boolean-expressions
function getPath<T>(path: string, defaultValue?: T) {
    if (path.indexOf('/') === -1) {
        return (obj: any) => obj[path];
    }

    const pathItems = path.split('/');
    return (obj: any) => pathItems.reduce((a, c) => (a && a[c] ? a[c] : defaultValue || null), obj);
}

function hasDecorators(value: any): value is { __decorators__: Array<(obj: any) => void> } {
    return !!value.__decorators__;
}
// tslint:enable: no-unsafe-any strict-boolean-expressions

class VuexRegistration implements IRegistration<any> {
    private value: any;
    public name: string;
    private getPath: (obj: any) => any;
    public constructor(
        private readonly module: () => any,
        private readonly target: ConstructorOf<InjectVuexModule>,
        private readonly options: ModuleOptions
    ) {
        this.name = options.name!;
        this.getPath = getPath(this.name);
    }
    public registerResolver(): Resolver<any> {
        return {
            get: (container: Container) => {
                if (this.value) return this.value;
                const store = container.get(Store);
                const module = getModule(this.module() as any, store);
                staticStateGenerator(this.target as any, store, this.getPath, module);
                Object.defineProperty(module, 'store', {
                    configurable: false,
                    enumerable: false,
                    value: store,
                    writable: false,
                });
                Object.defineProperty(module, 'container', {
                    configurable: false,
                    enumerable: false,
                    value: container,
                    writable: false,
                });
                if (hasDecorators(this.target)) {
                    const { inject } = this.target.__decorators__.reduce(
                        (acc, value) => {
                            value(acc);
                            return acc;
                        },
                        { inject: {} as any }
                    );
                    for (const key of Object.keys(inject)) {
                        const type = Reflect.getOwnMetadata(
                            constants.propertyType,
                            this.target.prototype,
                            key
                        );
                        if (!type) continue;
                        Object.defineProperty(module, key, {
                            configurable: false,
                            enumerable: false,
                            value: container.get(type),
                            writable: false,
                        });
                    }
                }
                for (const [key, prop] of Object.entries(
                    Object.getOwnPropertyDescriptors(this.target.prototype)
                )) {
                    if ((module as any)[key] || Object.getOwnPropertyDescriptor(module, key))
                        continue;
                    Object.defineProperty(module, key, prop);
                }
                this.value = module;
                // (module as any)._container = container;
                return module;
            },
        };
    }
}

function staticStateGenerator<S>(
    module: Function & Mod<S, any>,
    store: Store<any>,
    getPath: (obj: any) => any,
    statics: any
) {
    const state = typeof module.state === 'function' ? (module.state as any)() as S : module.state as S;
    Object.keys(state).forEach(key => {
        if (state.hasOwnProperty(key)) {
            // If not undefined or function means it is a state value
            if (['undefined', 'function'].indexOf(typeof (state as any)[key]) === -1) {
                Object.defineProperty(statics, key, {
                    get() {
                        return getPath(store.state)[key];
                    },
                });
            }
        }
    });
}

export function InjectModule(
    options: ModuleOptions,
    module?: {
        id: string;
    }
) {
    if (module && !options.name) {
        const id = module.id.replace(/[\\|\/]/g, '/');
        const path = id.substring(id.indexOf('/store/') + 7);
        options.name = join(dirname(path), basename(basename(path, '.js'), '.ts')).replace(
            /[\\|\/]/g,
            '/'
        );
        options.namespaced = true;
    }
    return function(target: ConstructorOf<InjectVuexModule>): any {
        Registration(new VuexRegistration(() => item as any, target, options))(target);
        const item = Module(options)(target);
        return item;
    };
}

export class InjectVuexModule<S = ThisType<any>, R = any> {
    protected context!: ActionContext<S, R>;
    protected container!: Container;
    protected store!: Store<R>;

    public constructor() {}

    protected getContainer() {
        return Vue.container;
    }
}
