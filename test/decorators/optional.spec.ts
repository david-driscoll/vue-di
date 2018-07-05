// tslint:disable:max-classes-per-file
import { expect } from 'chai';
import Component from 'vue-class-component';
import { createLocalVue, mount } from 'vue-test-utils';

import { Optional, Singleton } from '../../src/decorators';
import VueContainer from '../../src/vue';

describe('Optional property decorator', () => {
    it('should work with no registered service', () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer);

        @Singleton
        class Service {
            public value = 1;
        }

        @Component
        class MyComponent extends NewVue {
            @Optional() public service!: Service;
        }

        const wrapper = mount<MyComponent>(MyComponent);
        expect(wrapper.vm.service).to.be.null;
    });

    it('should work with a registered service', () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer);

        @Singleton.key(Service)
        class Service {
            public value = 1;
        }

        @Component({
            registerServices(container) {
                container.autoRegister(Service);
            },
        })
        class MyComponent extends NewVue {
            @Optional public service!: Service;
        }

        const wrapper = mount<MyComponent>(MyComponent);
        expect(wrapper.vm.service).to.be.not.null;
    });
});
