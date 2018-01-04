// tslint:disable:max-classes-per-file
import { expect } from 'chai';
import { DisposableBase, IDisposable } from 'ts-disposables';
import Component from 'vue-class-component';
import { createLocalVue, mount } from 'vue-test-utils';

import VueContainer from '../../src/di';
import { lazy, singleton, transient } from '../../src/decorators';

describe('Lazy property decorator', () => {
    it('should work with a singleton service', () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer);

        @singleton()
        class Service {
            public value = 1;
        }

        @Component
        class MyComponent extends NewVue {
            @lazy(Service) public service: () => Service;
        }

        const wrapper = mount<MyComponent>(MyComponent);
        wrapper.vm.service().should.be.eq(wrapper.vm.service());
    });

    it('should work with a transient service', () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer);

        @transient
        class Service {
            public value = 1;
        }

        @Component
        class MyComponent extends NewVue {
            @lazy(Service) public service: () => Service;
        }

        const wrapper = mount<MyComponent>(MyComponent);
        wrapper.vm.service().should.not.be.eq(wrapper.vm.service());
    });
});
