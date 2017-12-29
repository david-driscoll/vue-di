import { autoinject, singleton, transient } from 'aurelia-dependency-injection';
import { expect } from 'chai';
import { DisposableBase, IDisposable } from 'ts-disposables';
import { createLocalVue, mount } from 'vue-test-utils';
// tslint:disable:max-classes-per-file

import VueContainer from '../src/plugin';

@autoinject
class Stuff {
    public constructor() {}
    public value = 123;
}

@autoinject
class Item {
    public constructor(public stuff: Stuff) {}
}

@autoinject
class DisposableItem implements IDisposable {
    public _disposed = false;
    public constructor(public stuff: Stuff) {}

    public dispose() {
        this._disposed = true;
    }
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

        const item = mount(
            {
                template: '<div>test123 <child-vue></child-vue></div>',
                dependencies: {
                    things: DisposableItem,
                },
                components: {
                    'child-vue': {
                        dependencies: {
                            things: Item,
                        },
                        template: '<div>hello world</div>',
                    },
                },
            },
            { localVue: NewVue }
        );

        (item.vm.$children[0] as any).things.stuff.value.should.be.eq(123);
    });

    it('should dispose of items', () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer);

        const item = mount(
            {
                template: '<div>test123 <child-vue></child-vue></div>',
                dependencies: {
                    things: DisposableItem,
                },
                components: {
                    'child-vue': {
                        dependencies: {
                            things: DisposableItem,
                        },
                        template: '<div>hello world</div>',
                    },
                },
            },
            { localVue: NewVue }
        );

        let things: DisposableItem = (item.vm.$children[0] as any).things;
        things.stuff.value.should.be.eq(123);

        item.destroy();

        things._disposed.should.be.true;
    });

    it('should only have a container on an instance that has dependencies', () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer);

        const item = mount(
            {
                template: '<div>test123 <child-vue></child-vue></div>',
                components: {
                    'child-vue': {
                        dependencies: {
                            things: DisposableItem,
                        },
                        template: '<div>hello world</div>',
                    },
                },
            },
            { localVue: NewVue }
        );

        item.html()
        item.text() /*?*/
        item.vm.$children[0] /*?*/
        let things: DisposableItem = (item.vm.$children[0] /*?*/ as any).things;
        things.stuff.value.should.be.eq(123);

        item.destroy();

        things._disposed.should.be.true;
    });
});
