// tslint:disable:max-classes-per-file
import { expect } from 'chai';
import { DisposableBase, IDisposable } from 'ts-disposables';
import Component from 'vue-class-component';
import { createLocalVue, mount } from 'vue-test-utils';

import { AutoInject, Optional, Singleton, Transient } from '../../src/decorators';
import VueContainer from '../../src/di';

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
            @Optional() public service: Service;
        }

        const wrapper = mount<MyComponent>(MyComponent);
        expect(wrapper.vm.service).to.be.null;
    });

    it('should work with a registered service', () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer);

        @Singleton
        class Service {
            public value = 1;
        }

        @Component({
            registerServices(container) {
                container.autoRegister(Service);
            },
        })
        class MyComponent extends NewVue {
            @Optional() public service: Service;
        }

        const wrapper = mount<MyComponent>(MyComponent);
        expect(wrapper.vm.service).to.be.not.null;
    });
});
