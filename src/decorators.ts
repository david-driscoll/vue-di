import {
    all as allDeco,
    autoinject,
    factory as factoryDeco,
    lazy as lazyDeco,
    newInstance as newInstanceDeco,
    optional as optionalDeco,
    parent as parentDeco,
    Registration,
    registration as registrationDeco,
    SingletonRegistration,
    TransientRegistration,
} from 'aurelia-dependency-injection';
import { metadata } from 'aurelia-metadata';

export { autoinject };

// tslint:disable:ban-types

/**
 * Decorator: Defines a specific registration for this class type
 *
 * @export
 */
export function registration(value: Registration): ClassDecorator {
    return registrationDeco(value);
}

/**
 * Decorator: Specifies to register the decorated item with a "transient" lifetime.
 *
 * @export
 */
export function transient(key: string | symbol): ClassDecorator;
export function transient<T extends Function>(ctor: T): T;
export function transient(key: string | symbol | Function): any {
    if (typeof key === 'function') {
        return registration(new TransientRegistration(key))(key);
    }

    return registration(new TransientRegistration(key));
}

/**
 * Decorator: Specifies to register the decorated item with a "singleton" lifetime.
 *
 * @export
 */
export function singleton(registerInChild: boolean): ClassDecorator;
export function singleton(key: string | symbol, registerInChild?: boolean): ClassDecorator;
export function singleton<T extends Function>(ctor: T): T;
export function singleton(
    keyOrRegisterInChild: string | symbol | Function | boolean,
    registerInChild = false
): any {
    if (typeof keyOrRegisterInChild === 'function') {
        return registration(new SingletonRegistration(keyOrRegisterInChild, registerInChild))(
            keyOrRegisterInChild
        );
    }

    return registration(new SingletonRegistration(keyOrRegisterInChild, registerInChild));
}

/**
 * Decorator: Specifies the dependency should be lazy loaded.
 *
 * @export
 */
export function lazy(keyValue: string | symbol | Function) {
    return lazyDeco(keyValue);
}

/**
 * Decorator: Specifies the dependency should load all instances of the given key.
 *
 * @export
 */
export function all(keyValue: string | symbol | Function) {
    return allDeco(keyValue);
}

/**
 * Decorator: Specifies the dependency as optional.
 *
 * @export
 */
export function optional(checkParentOrTarget: boolean): ParameterDecorator;
export function optional(target: Object, key: string | symbol, index: number): void;
export function optional(
    target: Object | boolean,
    key?: string | symbol,
    index?: number
): void | ParameterDecorator {
    if (typeof target === 'boolean') {
        return optionalDeco(target);
    }

    return optionalDeco(true)(target, key, index);
}

/**
 * Decorator: Specifies the dependency to look at the parent container for resolution.
 *
 * @export
 */
export function parent(target: Object, key: string | symbol, index: number) {
    return parentDeco(target, key, index);
}

/**
 * Decorator: Specifies the dependency as a new instance.
 *
 * @export
 */
export function newInstance(asKeyOrTarget?: string | symbol, ...dynamicDependencies: any[]): ParameterDecorator;
export function newInstance(target: Object, key: string | symbol, index: number) : void;
export function newInstance(asKeyOrTarget?: string | symbol | Function | Object, ...dynamicDependencies: any[]): void | ParameterDecorator {
    if (typeof asKeyOrTarget === 'function') {
        return newInstanceDeco()(asKeyOrTarget, dynamicDependencies[0], dynamicDependencies[1]);
    }

    return newInstanceDeco(asKeyOrTarget, ...dynamicDependencies);
}
