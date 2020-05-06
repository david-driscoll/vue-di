import { basename, dirname, join } from 'path';
import Vue from 'vue';
import { ActionContext, Store, Module as Mod } from 'vuex';
import { getModule, Module } from 'vuex-module-decorators';
import { ModuleOptions } from 'vuex-module-decorators/dist/types/moduleoptions';
import constants from './constants';
import { Container } from './container';
import { Registration } from './decorators';
import { IRegistration } from './registration/Registration';
import { ConstructorOf, Resolver, Strategy, TypedKey, Key } from './types';
import { StrategyResolver } from './resolvers';

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
    public registerResolver(container: Container, key: Key<any>): Resolver<any> {
        const existingResolver = container.getResolver(key, false);

        if (!existingResolver) {
            const createModule = this.createModule.bind(this);
            const resolver = new StrategyResolver<any>(Strategy.Singleton, function () {
                return createModule(container);
            });
            return container.registerResolver(key, resolver);
        }

        return existingResolver;
    }

    private createModule(container: Container) {
        const store = container.get(Store);
        (this.options as any).store = store;
        const module = (() => {
            const moduleItem = this.module();
            const m = getModule(moduleItem as any);
            const proxyModule: any = {};
            moduleItem._statics = proxyModule;
            staticStateGenerator(this.target, store, this.getPath, proxyModule);
            for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(m))) {
                if (Object.getOwnPropertyDescriptor(proxyModule, key)) {
                    continue;
                }
                Object.defineProperty(proxyModule, key, descriptor);
            }
            return proxyModule;
        })();
        Object.defineProperties(module, {
            store: {
                configurable: false,
                enumerable: false,
                value: store,
                writable: false,
            },
            container: {
                configurable: false,
                enumerable: false,
                value: container,
                writable: false,
            },
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
            if ((module as any)[key] || Object.getOwnPropertyDescriptor(module, key)) {
                continue;
            }
            Object.defineProperty(module, key, prop);
        }
        return module;
    }
}

function staticStateGenerator<S>(
    module: Function & Mod<S, any>,
    store: Store<any>,
    getPath: (obj: any) => any,
    statics: any
) {
    const state =
        typeof module.state === 'function' ? ((module.state as any)() as S) : (module.state as S);
    Object.keys(state).forEach((key) => {
        if ((state as any).hasOwnProperty(key)) {
            // If not undefined or function means it is a state value
            if (['undefined', 'function'].indexOf(typeof (state as any)[key]) === -1) {
                Object.defineProperty(statics, key, {
                    enumerable: true,
                    configurable: false,
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
    return function (target: ConstructorOf<InjectVuexModule>): any {
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
