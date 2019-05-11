import { expect } from 'chai';
import * as sinon from 'sinon';
import { IDisposable } from 'ts-disposables';
import Component from 'vue-class-component';
import { createLocalVue, mount } from 'vue-test-utils';
import { AutoInject, Inject, Lazy, Resolve, Singleton } from '../src/decorators';
import VueContainer from '../vue';
import { defaultInjectable } from '../src/decorators/decorateParameterOrProperty';
import { Container } from '../src/container';

// tslint:disable:max-classes-per-file
@AutoInject
class Stuff {
    public value = 123;
    public constructor() {}
}

@AutoInject
class Item {
    public constructor(public stuff: Stuff) {}
}

@AutoInject
class DisposableItem implements IDisposable {
    public _disposed = false;
    public constructor(public stuff: Stuff) {}

    public dispose() {
        this._disposed = true;
    }
}

class Property {
    @Lazy('abcd') public value!: string;
    @Lazy('abcd') public item!: Item;
    @Lazy('abcd') public funcItem!: () => Item;
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

            @Component
            class Test extends NewVue {
                @Inject()
                public things!: Item;
            }

            const vm: any = new Test({});

            vm.things.should.not.be.null;
            vm.things.stuff.value.should.be.eq(123);
        });

        it('should setup dependendcies w/string', () => {
            const NewVue = createLocalVue();
            NewVue.use(VueContainer);
            NewVue.container.registerInstance('item', new Item(new Stuff()));

            @Component
            class Test extends NewVue {
                @Inject('item')
                public things!: Item;
            }

            const vm: any = new Test({});

            vm.things.should.not.be.null;
            vm.things.stuff.value.should.be.eq(123);
            vm.things.should.be.eq(NewVue.container.get('item'));
        });
        it('should setup dependendcies w/symbol', () => {
            const NewVue = createLocalVue();
            NewVue.use(VueContainer);
            NewVue.container.registerInstance(Symbol.for('item'), new Item(new Stuff()));

            @Component
            class Test extends NewVue {
                @Inject(Symbol.for('item'))
                public things!: Item;
            }

            const vm: any = new Test({});

            vm.things.should.not.be.null;
            vm.things.stuff.value.should.be.eq(123);
            vm.things.should.be.eq(NewVue.container.get(Symbol.for('item')));
        });

        it('should work with child components (and use $parent)', () => {
            const NewVue = createLocalVue();
            NewVue.use(VueContainer);

            const item = mount(
                {
                    template: '<div>test123 <child-vue></child-vue></div>',
                    inject: {
                        things: {
                            from: Symbol(),
                            default(this: import('vue').VueConstructor) {
                                return this.container.get(DisposableItem);
                            },
                        },
                    },
                    provide: {
                        provided: 'here is a value',
                    },
                    components: {
                        'child-vue': {
                            inject: {
                                things: {
                                    from: Symbol(),
                                    default(this: import('vue').VueConstructor) {
                                        return this.container.get(Item);
                                    },
                                },
                                provided: { from: 'provided' },
                            },
                            template: '<div>hello world</div>',
                        },
                    },
                },
                { localVue: NewVue }
            );

            (item.vm.$children[0] as any).things.stuff.value.should.be.eq(123);
            (item.vm.$children[0] as any).provided.should.be.eq('here is a value');
        });

        it('should dispose of items', () => {
            const NewVue = createLocalVue();
            NewVue.use(VueContainer);

            const item = mount(
                {
                    template: '<div>test123 <child-vue></child-vue></div>',
                    createChildContainer: true,
                    inject: {
                        things: defaultInjectable(DisposableItem)
                    },
                    components: {
                        'child-vue': {
                            inject: {
                                things: defaultInjectable(DisposableItem)
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
                                things: defaultInjectable(DisposableItem),
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

            @Singleton
            class Service {
                public value = 1;
            }

            @Component
            class MyComponent2 extends NewVue {
                @Resolve() public service!: Service;
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
                    things: defaultInjectable(Item) /*?*/,
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
                        things: defaultInjectable(DisposableItem),
                    },
                    components: {
                        'child-vue': {
                            inject: {
                                things: defaultInjectable(Item),
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
                        things: defaultInjectable(DisposableItem),
                    },
                    components: {
                        'child-vue': {
                            inject: {
                                things: defaultInjectable(DisposableItem),
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
                                things: defaultInjectable(DisposableItem),
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

        it('use the given container instead of creating a new one', () => {
            const NewVue = createLocalVue();
            const container = new Container();
            NewVue.use(VueContainer, { container });

            NewVue.container.should.be.equal(container);
        });
    });
});
