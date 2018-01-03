import Vue, { ComponentOptions } from 'vue';

export type VueClass<V extends Vue> = { new (...args: any[]): V } & typeof Vue;

export type DecoratedClass = VueClass<Vue> & {
    // Property, method and parameter decorators created by `createDecorator` helper
    // will enqueue functions that update component options for lazy processing.
    // They will be executed just before creating component constructor.
    __decorators__?: Array<(options: ComponentOptions<Vue>) => void>;
};

export function createVueDecorator(
    factory: (options: ComponentOptions<Vue>) => void
): ClassDecorator;
export function createVueDecorator(
    factory: (options: ComponentOptions<Vue>, key: string | symbol) => void
): PropertyDecorator;
export function createVueDecorator(factory: Function): ClassDecorator | PropertyDecorator {
    return (target: any, key?: string | symbol) => {
        const Ctor =
            typeof target === 'function'
                ? (target as DecoratedClass)
                : (target.constructor as DecoratedClass);
        if (!Ctor.__decorators__) {
            Ctor.__decorators__ = [];
        }
        Ctor.__decorators__.push(options => factory(options, key));
    };
}
