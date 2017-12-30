import {
    All as AllProvider,
    autoinject,
    getDecoratorDependencies,
    Lazy as LazyProvider,
    NewInstance as NewInstanceProvider,
    Optional as OptionalProvider,
    Parent as ParentProvider,
    registration as registrationDeco,
    Registration as RegistrationProvider,
    Resolver,
    SingletonRegistration,
    TransientRegistration,
} from 'aurelia-dependency-injection';
import Vue, { ComponentOptions } from 'vue';
import { createVueDecorator } from './shim-component-decorators';

const resolverKey = 'vue:resolver';
const paramTypesKey = 'design:paramtypes';
const propertyTypeKey = 'design:type';

export { autoinject };

// tslint:disable:ban-types

/**
 * Decorator: Defines a specific registration for this class type
 *
 * @export
 */
export function Registration(value: RegistrationProvider): ClassDecorator {
    return registrationDeco(value);
}

/**
 * Decorator: Specifies to register the decorated item with a "transient" lifetime.
 *
 * @export
 */
export function Transient(key: string | symbol): ClassDecorator;
export function Transient<T extends Function>(ctor: T): T;
export function Transient(key: string | symbol | Function): any {
    if (typeof key === 'function') {
        return Registration(new TransientRegistration(key))(key);
    }

    return Registration(new TransientRegistration(key));
}

/**
 * Decorator: Specifies to register the decorated item with a "singleton" lifetime.
 *
 * @export
 */
export function Singleton(registerInChild: boolean): ClassDecorator;
export function Singleton(key: string | symbol, registerInChild?: boolean): ClassDecorator;
export function Singleton<T extends Function>(ctor: T): T;
export function Singleton(
    keyOrRegisterInChild: string | symbol | Function | boolean,
    registerInChild = false
): any {
    if (typeof keyOrRegisterInChild === 'function') {
        return Registration(new SingletonRegistration(keyOrRegisterInChild, registerInChild))(
            keyOrRegisterInChild
        );
    }

    return Registration(new SingletonRegistration(keyOrRegisterInChild, registerInChild));
}

function decorateParameterOrProperty(resolver: (type: any) => Resolver, name: string) {
    return (target: Object, key: string | symbol, index?: number) => {
        if (typeof index === 'number') {
            const params = getDecoratorDependencies(target, name);
            params[index] = resolver(params[index]);
        } else {
            const propertyType = Reflect.getOwnMetadata(propertyTypeKey, target, key);
            const instance = resolver(propertyType);
            Reflect.defineMetadata(resolverKey, instance, target, key);

            return createVueDecorator((options: ComponentOptions<Vue>, key: string | symbol) => {
                if (!options.dependencies) {
                    options.dependencies = {};
                }
                options.dependencies[key] = instance;
            })(target, key);
        }
    };
}

/**
 * Decorator: Specifies the dependency should be lazy loaded.
 *
 * @export
 */
export function Lazy(keyValue: string | symbol | Function) {
    const resolver = LazyProvider.of(keyValue);

    return decorateParameterOrProperty(x => resolver, 'lazy');
}

/**
 * Decorator: Specifies the dependency should load all instances of the given key.
 *
 * @export
 */
export function All(keyValue: string | symbol | Function) {
    const resolver = AllProvider.of(keyValue);

    return decorateParameterOrProperty(x => resolver, 'all');
}

/**
 * Decorator: Specifies the dependency as optional.
 *
 * @export
 */
export function Optional(checkParent: boolean = true) {
    const resolver = (x: any) => OptionalProvider.of(x, checkParent);

    return decorateParameterOrProperty(resolver, 'optional');
}

/**
 * Decorator: Specifies the dependency to look at the parent container for resolution.
 *
 * @export
 */
export function Parent() {
    const resolver = (x: any) => ParentProvider.of(x);

    return decorateParameterOrProperty(resolver, 'parent');
}

/**
 * Decorator: Specifies the dependency as a new instance.
 *
 * @export
 */
export function NewInstance(asKey?: string | symbol, ...dynamicDeps: any[]) {
    const resolver = (x: any) => {
        const value = NewInstanceProvider.of(x, ...dynamicDeps);

        if (!!asKey) {
            value.as(asKey);
        }

        return value;
    };

    return decorateParameterOrProperty(resolver, 'newInstance');
}
