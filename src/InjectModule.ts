import { basename, dirname, join } from 'path';
import Vue from 'vue';
import { ActionContext, ActionTree, GetterTree, Module as Mod, ModuleTree, MutationTree, Store } from 'vuex';
import { getModule, VuexModule, Module } from 'vuex-module-decorators';
import { ModuleOptions } from 'vuex-module-decorators/dist/types/moduleoptions';
import { Container } from './container';
import { Registration } from './decorators';
import { IRegistration } from './registration/Registration';
import { ConstructorOf, Key, Resolver, TypedKey } from './types';
import './vue';

class VuexRegistration implements IRegistration<any> {
    private value: any;
    public name: string;
    public constructor(
        private readonly module: () => any,
        private readonly target: ConstructorOf<InjectVuexModule>,
        private readonly options: ModuleOptions
    ) {
        this.name = options.name!;
    }
    public registerResolver(container: Container, key: Key<any>, fn: TypedKey<any>): Resolver<any> {
        return {
            get: (container: Container, key: any) => {
                if (this.value) return this.value;
                const store = container.get(Store);
                const module = getModule(this.module() as any, store);
                staticStateGenerator(this.target as any, store, this.options.name!, module);
                this.value = module;
                // (module as any)._container = container;
                return module;
            },
        };
    }
}

function staticStateGenerator(
    module: { state(): any },
    store: Store<any>,
    name: string,
    statics: any
) {
    const state = module.state();
    Object.keys(state).forEach(function(key) {
        if (state.hasOwnProperty(key)) {
            // If not undefined or function means it is a state value
            if (['undefined', 'function'].indexOf(typeof state[key]) === -1) {
                Object.defineProperty(statics, key, {
                    get() {
                        return store.state[name][key];
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

    protected get container() {
        return Vue.container;
    }
    /*
     * To use with `extends Class` syntax along with decorators
     */
    private static namespaced?: boolean;
    private static state?: any | (() => any);
    private static getters?: GetterTree<any, any>;
    private static actions?: ActionTree<any, any>;
    private static mutations?: MutationTree<any>;
    private static modules?: ModuleTree<any>;
    protected context!: ActionContext<S, R>;

    /*
     * To use with `new VuexModule(<ModuleOptions>{})` syntax
     */

    private modules?: ModuleTree<any>;
    private namespaced?: boolean;
    private getters?: GetterTree<S, R>;
    private state?: S | (() => S);
    private mutations?: MutationTree<S>;
    private actions?: ActionTree<S, R>;

    constructor(module: Mod<S, any>) {
        this.actions = module.actions;
        this.mutations = module.mutations;
        this.state = module.state;
        this.getters = module.getters;
        this.namespaced = module.namespaced;
        this.modules = module.modules;
    }
}
