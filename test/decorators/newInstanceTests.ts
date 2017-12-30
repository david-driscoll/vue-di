// tslint:disable:max-classes-per-file
import { expect } from 'chai';
import { DisposableBase, IDisposable } from 'ts-disposables';
import Component from 'vue-class-component';
import { createLocalVue, mount } from 'vue-test-utils';

import { autoinject, NewInstance, Singleton, Transient } from '../../src/decorators';
import VueContainer from '../../src/plugin';

describe('NewInstance property decorator', () => {
    it('should work with a singleton service', () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer);

        @Singleton
        class Service {
            public value = 1;
        }

        @Component
        class MyComponent extends NewVue {
            @NewInstance() public service: Service;
        }

        const wrapper = mount<MyComponent>(MyComponent);
        const wrapper2 = mount<MyComponent>(MyComponent);

        // wrapper.vm.$options /*?*/
        // wrapper2.vm.$options /*?*/

        wrapper.vm.service.should.not.be.eq(wrapper2.vm.service);
    });
});
