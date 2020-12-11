import Reflect from './localReflect';
import { basename, dirname, join } from 'path';
import Vue from 'vue';
import { ActionContext, Store } from 'vuex';
import { getModule, Module } from 'vuex-module-decorators';
import { ModuleOptions } from 'vuex-module-decorators/dist/types/moduleoptions';
import constants from './constants';
import { Container } from './container';
import { Registration } from './decorators';
import { IRegistration } from './registration/Registration';
import { ConstructorOf, Resolver, Strategy, Key } from './types';
import { StrategyResolver } from './resolvers';

function hasDecorators(value: any): value is { __decorators__: Array<(obj: any) => void> } {
    return !!value.__decorators__;
}
// tslint:enable: no-unsafe-any strict-boolean-expressions

class VuexRegistration implements IRegistration<any> {
    public constructor(
        private readonly module: () => any,
        private readonly target: ConstructorOf<InjectVuexModule>,
        private readonly options: ModuleOptions
    ) {
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

        const moduleItem = this.module();
        const module = getModule(moduleItem as any);
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

export function InjectModule(
    options: ModuleOptions,
    module?: {
        id: string;
    }
) {
    if (module && !options.name) {
        let id = module.id.replace(/[\\|\/]/g, '/');
        const idx = id.indexOf('/store/');
        if (idx > -1 && idx < 10) { // ensure the store is part of the first section only.
            id = id.substring(id.indexOf('/store/') + 7);
        }
        options.name = join(dirname(id), basename(basename(id, '.js'), '.ts')).replace(
            /[\\|\/]/g,
            '/'
        );
        options.namespaced = true;
    }
    return function (target: ConstructorOf<InjectVuexModule>): any {
        const item = Module(options)(target);
        Registration(new VuexRegistration(() => item, target, options))(target);
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
