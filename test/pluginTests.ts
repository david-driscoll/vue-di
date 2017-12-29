import { autoinject, singleton, transient } from 'aurelia-dependency-injection';
import { expect } from 'chai';
import { createLocalVue, mount } from 'vue-test-utils';

import VueContainer from '../src/plugin';

@autoinject
class Stuff {
    constructor() {}
    public value = 123;
}

@autoinject
class Item {
    constructor(public stuff: Stuff) {}
}

describe('pluginTests', () => {
    it('should set the container', () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer);

        expect(NewVue.container).to.not.be.null;
        NewVue.container.autoRegister.should.not.be.null;
    });

    it('should setup dependendcies', () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer);

        const vm: any = new NewVue({
            dependencies: {
                things: Item /*?*/,
            },
        });

        vm.things.should.not.be.null;
        vm.things.stuff.value.should.be.eq(123);
    });

    it('should work with child components (and use $parent)', () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer);

        const item = mount({
            template: '<div>test123 <child-vue></child-vue></div>',
            components: {
                'child-vue': {
                    dependencies: {
                        things: Item,
                    },
                    template: '<div>hello world</div>',
                }
            }
        }, { localVue: NewVue });

        (item.vm.$children[0] as any).things.stuff.value.should.be.eq(123);
    });
});
