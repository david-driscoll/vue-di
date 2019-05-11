import Vue from 'vue';
import { createLocalVue } from 'vue-test-utils';
import * as Vuex from 'vuex';
// tslint:disable-next-line: no-duplicate-imports
import { Store } from 'vuex';
import { getModule, Mutation, VuexModule } from 'vuex-module-decorators';
import { Container } from '../src/container/Container';
import { InjectModule, InjectVuexModule } from '../src/InjectModule';
import VueContainer from '../vue';
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
        }

        const store = new Store({});
        NewVue.container.registerInstance(Store, store);
        store.registerModule('layout', LayoutModule as any);

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
        }

        const store = new Store({});
        NewVue.container.registerInstance(Store, store);
        store.registerModule('layout', LayoutModule as any);

        const m = NewVue.container.get(LayoutModule);

        m.title.should.be.eq('default');
    });
});
