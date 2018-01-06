// tslint:disable:max-classes-per-file
import Component from 'vue-class-component';
import { createLocalVue, mount } from 'vue-test-utils';

import { all } from '../../src/decorators';
import VueContainer from '../../src/di';

describe('All property decorator', () => {
    it('should work with a singleton service', () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer);

        interface Item {
            prop: string;
        }
        const Item = Symbol.for('Item');
        NewVue.container.registerInstance(Item, { prop: 'abc' } as Item);
        NewVue.container.registerInstance(Item, { prop: 'def' } as Item);
        NewVue.container.registerInstance(Item, { prop: 'ghi' } as Item);

        @Component
        class MyComponent extends NewVue {
            @all(Item) public items: Item[];
        }

        const wrapper = mount<MyComponent>(MyComponent);
        wrapper.vm.items[0].should.be.deep.eq({ prop: 'abc' });
        wrapper.vm.items[1].should.be.deep.eq({ prop: 'def' });
        wrapper.vm.items[2].should.be.deep.eq({ prop: 'ghi' });
    });
});
