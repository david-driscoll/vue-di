/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { SingletonRegistration } from '../registration/SingletonRegistration';
import { registration } from './registration';
import { Key } from '../types';

/**
 * Decorator: Specifies to register the decorated item with a "singleton" lifetime.
 *
 * @export
 */
export function singleton<T extends Function>(ctor: T): void;
export function singleton(registerInChild?: boolean): ClassDecorator;
export function singleton(key: Key<any>, registerInChild?: boolean): ClassDecorator;
export function singleton(
    keyOrRegisterInChild: Key<any> | boolean = false,
    registerInChild = false
): any {
    if (typeof keyOrRegisterInChild === 'boolean') {
        return registration(new SingletonRegistration(keyOrRegisterInChild));
    }

    return registration(new SingletonRegistration(keyOrRegisterInChild, registerInChild))(
        keyOrRegisterInChild
    );
}
