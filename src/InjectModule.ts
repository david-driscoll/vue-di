import { basename, dirname, join } from 'path';
import { Store } from 'vuex';
import { getModule, Module, VuexModule } from 'vuex-module-decorators';
import { ModuleOptions } from 'vuex-module-decorators/dist/types/moduleoptions';
import { Container } from './container';
import { Registration } from './decorators';
import { IRegistration } from './registration/Registration';
import { ConstructorOf, Key, Resolver, TypedKey } from './types';

class VuexRegistration implements IRegistration<any> {
    private value: any;
    public constructor(
        private readonly module: () => any,
        private readonly target: ConstructorOf<VuexModule>,
        private readonly name: string
    ) {}
    public registerResolver(container: Container, key: Key<any>, fn: TypedKey<any>): Resolver<any> {
        return {
            get: (container: Container, key: any) => {
                if (this.value) return this.value;
                const store = container.get(Store);
                const module = getModule(this.module() as any, store);
                staticStateGenerator(this.target as any, store, this.name, module);
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
        const path = module.id.substring(module.id.indexOf('/store/') + 7);
        options.name = join(dirname(path), basename(basename(path, '.js'), '.ts')).replace(
            /[\\|\/]/g,
            '/'
        );
        options.namespaced = true;
    }
    return function(target: ConstructorOf<VuexModule>): any {
        Registration(new VuexRegistration(() => item as any, target, options.name!))(target);
        const item = Module(options)(target);
        return item;
    };
}
