import Vue from 'vue';
import { createLocalVue } from 'vue-test-utils';
import * as Vuex from 'vuex';
// tslint:disable-next-line: no-duplicate-imports
import { Store } from 'vuex';
import { getModule, Mutation, VuexModule, Action } from 'vuex-module-decorators';
import { Container } from '../src/container/Container';
import { InjectModule, InjectVuexModule } from '../src/InjectModule';
import VueContainer from '../vue';
import { AutoInject, Resolve, Wrap } from '../src';
Vue.use(Vuex);

describe('vuexTests', () => {
    it('standard store based injection...', () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer, { container: new Container() });

        @InjectModule({ stateFactory: true, name: 'layout' })
        class LayoutModule extends InjectVuexModule {
            public title = 'default';

            @Mutation
            public setTitle(title: string) {
                this.title = title;
            }

            public getValue() {
                return this.title;
            }

            @Action({})
            public async setValues(value: string) {
                this.setTitle(this.getValue());
            }
        }

        const store = new Store({});
        NewVue.container.registerInstance(Store, store);
        store.registerModule('layout', LayoutModule as any);

        const m = NewVue.container.get(LayoutModule);

        m.title.should.be.eq('default');
    });

    it('standard store based injection... with children...', () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer, { container: new Container() });

        @InjectModule({ stateFactory: true, name: 'app/layout' })
        class LayoutModule extends InjectVuexModule {
            public title = 'default';

            @Mutation
            public setTitle(title: string) {
                this.title = title;
            }

            public getValue() {
                return this.title;
            }

            @Action({})
            public async setValues(value: string) {
                this.setTitle(this.getValue());
            }
        }

        const store = new Store({});
        NewVue.container.registerInstance(Store, store);
        store.registerModule('app', {});
        store.registerModule(['app','layout'], LayoutModule as any);

        const m = NewVue.container.get(LayoutModule);

        m.title.should.be.eq('default');
    });

    it('standard nuxt based injection...', () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer, { container: new Container() });

        @InjectModule({ stateFactory: true }, { id: './store/layout.ts' })
        class LayoutModule extends InjectVuexModule {
            public title = 'default';

            @Mutation
            public setTitle(title: string) {
                this.title = title;
            }

            public getValue() {
                return this.title;
            }

            @Action({})
            public async setValues(value: string) {
                this.setTitle(this.getValue());
            }
        }

        const store = new Store({});
        NewVue.container.registerInstance(Store, store);
        store.registerModule('layout', LayoutModule as any);

        const m = NewVue.container.get(LayoutModule);

        m.title.should.be.eq('default');
    });

    it('should support helper methods', async () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer, { container: new Container() });

        @InjectModule({ stateFactory: true }, { id: './store/layout.ts' })
        class LayoutModule extends InjectVuexModule {
            public title = 'default';

            @Mutation
            public setTitle(title: string) {
                this.title = title;
            }

            public getValue() {
                return this.title;
            }

            @Action({})
            public async setValues(value: string) {
                this.setTitle(value);
            }
        }

        const store = new Store({});
        NewVue.container.registerInstance(Store, store);
        store.registerModule('layout', LayoutModule as any);

        const m = NewVue.container.get(LayoutModule);

        m.setTitle('some title');

        m.getValue().should.be.eq('some title');
    });

    it('should support actions', async () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer, { container: new Container() });

        @InjectModule({ stateFactory: true }, { id: './store/layout.ts' })
        class LayoutModule extends InjectVuexModule {
            public title = 'default';

            @Mutation
            public setTitle(title: string) {
                this.title = title;
            }

            public getValue() {
                return this.title;
            }

            @Action({})
            public async setValues(value: string) {
                this.setTitle(value);
            }
        }

        const store = new Store({});
        NewVue.container.registerInstance(Store, store);
        store.registerModule('layout', LayoutModule as any);

        const m = NewVue.container.get(LayoutModule);

        await m.setValues('some title');

        m.title.should.be.eq('some title');
    });

    it('should resolve and attach resolved values as getters (but not state)', async () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer, { container: new Container() });

        @AutoInject
        class Thing {
            value = 'one';
        }

        @InjectModule({ stateFactory: true }, { id: './store/layout.ts' })
        class LayoutModule extends InjectVuexModule {
            @Resolve()
            public thing!: Thing;

            public title = 'default';

            @Mutation
            public setTitle(title: string) {
                this.title = title;
            }
        }

        const store = new Store({});
        NewVue.container.registerInstance(Store, store);
        store.registerModule('layout', LayoutModule as any);

        const m = NewVue.container.get(LayoutModule);

        m.thing.value.should.be.eq('one');
    });

    it('should resolve and attach resolved values as getters (but not state)', async () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer, { container: new Container() });

        @AutoInject
        class Thing {
            value = 'one';
        }

        @InjectModule({ stateFactory: true }, { id: './store/layout.ts' })
        class LayoutModule extends InjectVuexModule {
            @Resolve()
            public thing!: Thing;

            public title = 'default';

            @Mutation
            public setTitle(title: string) {
                this.title = title;
            }
        }

        const store = new Store({});
        NewVue.container.registerInstance(Store, store);
        store.registerModule('layout', LayoutModule as any);

        const m = NewVue.container.get(LayoutModule);

        m.thing.value.should.be.eq('one');
    });

    it('should resolve and attach resolved values as getters (but not state) with internal usage', async () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer, { container: new Container() });

        @AutoInject
        class Thing {
            value = 'one';
        }

        @InjectModule({ stateFactory: true }, { id: './store/layout.ts' })
        class LayoutModule extends InjectVuexModule {
            @Resolve()
            public thing!: Thing;

            public title = 'default';

            @Mutation
            public setTitle(title: string) {
                this.title = title;
            }

            @Action({})
            public doStuff() {
                this.setTitle(this.thing.value);
            }
        }

        const store = new Store({});
        NewVue.container.registerInstance(Store, store);
        store.registerModule('layout', LayoutModule as any);

        const m = NewVue.container.get(LayoutModule);

        m.doStuff();

        m.title.should.be.eq('one');
    });

    it('should work with wrap semantics', async () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer, { container: new Container() });

        @AutoInject
        class Thing {
            value = 'one';
        }

        @Wrap({
            get(value) {
                Object.defineProperty(value, 'extravalue', {
                    enumerable: true,
                    configurable: false,
                    value: '123456',
                });
                return value;
            },
        })
        @InjectModule({ stateFactory: true }, { id: './store/layout.ts' })
        class LayoutModule extends InjectVuexModule {
            @Resolve()
            public thing!: Thing;

            public title = 'default';

            @Mutation
            public setTitle(title: string) {
                this.title = title;
            }

            @Action({})
            public doStuff() {
                this.setTitle(this.thing.value);
            }
        }

        const store = new Store({});
        NewVue.container.registerInstance(Store, store);
        store.registerModule('layout', LayoutModule as any);

        const m = NewVue.container.get(LayoutModule);
        m; //?

        m.doStuff();

        m.title.should.be.eq('one');
        (m as any).extravalue.should.be.eq('123456');
    });
});
