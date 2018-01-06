import { expect } from 'chai';
import * as sinon from 'sinon';
import { DisposableBase, IDisposable } from 'ts-disposables';
import Component from 'vue-class-component';
import { Inject } from 'vue-property-decorator';
import { createLocalVue, mount } from 'vue-test-utils';
import { autoinject, lazy, resolve, singleton } from '../src/decorators';
// tslint:disable:max-classes-per-file

import VueContainer, { Container } from '../src/di';

@autoinject
class Stuff {
    public value = 123;
    public constructor() { }
}

@autoinject
class Item {
    public constructor(public stuff: Stuff) { }
}

@autoinject
class DisposableItem implements IDisposable {
    public _disposed = false;
    public constructor(public stuff: Stuff) { }

    public dispose() {
        this._disposed = true;
    }
}

class Property {
    @lazy('abcd') public value: string;
    @lazy('abcd') public item: Item;
    @lazy('abcd') public funcItem: () => Item;
}

describe('pluginTests', () => {
    it('should set the container', () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer);

        expect(NewVue.container).to.not.be.null;
        NewVue.container.autoRegister.should.not.be.null;
    });

    it('should register services', () => {
        const NewVue = createLocalVue();
        NewVue.use(VueContainer);

        const vm: any = new NewVue({
            registerServices: sinon.spy(),
        });
    });

    describe('using dependencies', () => {
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

            const things: DisposableItem = (item.vm.$children[0] as any).things;
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

            const things: DisposableItem = (item.vm.$children[0] as any).things;
            things.stuff.value.should.be.eq(123);

            item.destroy();

            things._disposed.should.be.true;
        });

        it('should work with resolve attributes', () => {
            const NewVue = createLocalVue();
            NewVue.use(VueContainer);

            @singleton
            class Service {
                public value = 1;
            }

            @Component
            class MyComponent2 extends NewVue {
                @resolve() public service: Service;
            }

            const wrapper2a = mount<MyComponent2>(MyComponent2);
            const wrapper2b = mount<MyComponent2>(MyComponent2);

            wrapper2b.vm.service.should.be.eq(wrapper2a.vm.service);
        });
    });

    describe('using inject', () => {
        it('should setup dependendcies', () => {
            const NewVue = createLocalVue();
            NewVue.use(VueContainer);

            const vm: any = new NewVue({
                inject: {
                    things: <any>Item /*?*/,
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
                    inject: {
                        things: <any>DisposableItem,
                    },
                    components: {
                        'child-vue': {
                            inject: {
                                things: <any>Item,
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
                    inject: {
                        things: <any>DisposableItem,
                    },
                    components: {
                        'child-vue': {
                            inject: {
                                things: <any>DisposableItem,
                            },
                            template: '<div>hello world</div>',
                        },
                    },
                },
                { localVue: NewVue }
            );

            const things: DisposableItem = (item.vm.$children[0] as any).things;
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
                            inject: {
                                things: <any>DisposableItem,
                            },
                            template: '<div>hello world</div>',
                        },
                    },
                },
                { localVue: NewVue }
            );

            const things: DisposableItem = (item.vm.$children[0] as any).things;
            things.stuff.value.should.be.eq(123);

            item.destroy();

            things._disposed.should.be.true;
        });

        it('should work with resolve attributes', () => {
            const NewVue = createLocalVue();
            NewVue.use(VueContainer);

            @singleton
            class Service {
                public value = 1;
            }

            @Component
            class MyComponent2 extends NewVue {
                @Inject(Service as any) public service: Service;
            }

            const wrapper2a = mount<MyComponent2>(MyComponent2);
            const wrapper2b = mount<MyComponent2>(MyComponent2);

            wrapper2b.vm.service.should.be.eq(wrapper2a.vm.service);
        });

        it('should work with resolve attributes and symbol', () => {
            const NewVue = createLocalVue();
            NewVue.use(VueContainer);

            class Service {
                public value = 1;
            }

            const symbol = Symbol(Service.toString());
            NewVue.container.registerSingleton(symbol, Service);

            @Component
            class MyComponent2 extends NewVue {
                @Inject(symbol) public service: Service;
            }

            const wrapper2a = mount<MyComponent2>(MyComponent2);
            const wrapper2b = mount<MyComponent2>(MyComponent2);

            wrapper2b.vm.service.should.be.eq(wrapper2a.vm.service);
        });

        it('use the given container instead of creating a new one', () => {
            const NewVue = createLocalVue();
            const container = new Container();
            NewVue.use(VueContainer, { container });

            NewVue.container.should.be.equal(container);
        });
    });
});
