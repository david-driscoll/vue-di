// tslint:disable:max-classes-per-file
import { expect } from 'chai';
import { DisposableBase, IDisposable } from 'ts-disposables';
import Component from 'vue-class-component';
import { createLocalVue, mount } from 'vue-test-utils';

import { AutoInject, NewInstance, Singleton, Transient, Resolve } from '../../src/decorators';
import VueContainer from '../../src/di';

describe('NewInstance property decorator', () => {
    it('should work with a singleton service', () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer);

        @Singleton
        class Service {
            public value = 1;
        }

        @Component
        class MyComponent2 extends NewVue {
            @Resolve() public service: Service;
        }

        @Component
        class MyComponent extends NewVue {
            @NewInstance() public service: Service;
        }

        const wrapper = mount<MyComponent>(MyComponent);
        const wrapper2 = mount<MyComponent>(MyComponent);
        const wrapper2a = mount<MyComponent2>(MyComponent2);
        const wrapper2b = mount<MyComponent2>(MyComponent2);

        wrapper2b.vm.service.should.be.eq(wrapper2a.vm.service);
        wrapper.vm.service.should.not.be.eq(wrapper2.vm.service);
    });
});
