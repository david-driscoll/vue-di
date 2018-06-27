// tslint:disable:max-classes-per-file
import Component from 'vue-class-component';
import { createLocalVue, mount } from 'vue-test-utils';

import { Lazy, Singleton, Transient } from '../../src/decorators';
import VueContainer from '../../src/vue';

describe('Lazy property decorator', () => {
    it('should work with a singleton service', () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer);

        @Singleton()
        class Service {
            public value = 1;
        }

        @Component
        class MyComponent extends NewVue {
            @Lazy(Service) public service!: () => Service;
        }

        const wrapper = mount<MyComponent>(MyComponent);
        wrapper.vm.service().should.be.eq(wrapper.vm.service());
    });

    it('should work with a transient service', () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer);

        @Transient
        class Service {
            public value = 1;
        }

        @Component
        class MyComponent extends NewVue {
            @Lazy(Service) public service!: () => Service;
        }

        const wrapper = mount<MyComponent>(MyComponent);
        wrapper.vm.service().should.not.be.eq(wrapper.vm.service());
    });

    it('should work with a transient service /2', () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer);

        @Transient()
        class Service {
            public value = 1;
        }

        @Component
        class MyComponent extends NewVue {
            @Lazy(Service) public service!: () => Service;
        }

        const wrapper = mount<MyComponent>(MyComponent);
        wrapper.vm.service().should.not.be.eq(wrapper.vm.service());
    });
});
