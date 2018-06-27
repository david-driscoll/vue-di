// Simulates the vue decotrator without needing to make one.

export function createVueDecorator(
    factory: (options: any /*ComponentOptions<Vue>*/) => void
): ClassDecorator;
export function createVueDecorator(
    factory: (options: any /*ComponentOptions<Vue>*/, key: string | symbol) => void
): PropertyDecorator;
export function createVueDecorator(factory: Function): ClassDecorator | PropertyDecorator {
    return (target: any, key?: string | symbol) => {
        const ctor = typeof target === 'function' ? target : target.constructor;
        if (!ctor.__decorators__) {
            ctor.__decorators__ = [];
        }
        ctor.__decorators__.push((options: any) => factory(options, key));
    };
}
