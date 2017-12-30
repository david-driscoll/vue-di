import { Container } from 'aurelia-dependency-injection';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { DisposableBase, IDisposable } from 'ts-disposables';
import { createLocalVue, mount } from 'vue-test-utils';
// tslint:disable:max-classes-per-file

import VueContainer from '../src/plugin';
import { autoinject, Lazy } from './../src/decorators';

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

class Property {
    @Lazy('abcd') public value: string;
    @Lazy('abcd') public item: Item;
    @Lazy('abcd') public funcItem: () => Item;
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

    it('should register services', () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer);

        const vm: any = new NewVue({
            registerServices: sinon.spy(),
        });
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
                createChildContainer: true,
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
                        // createChildContainer: true,
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
});
