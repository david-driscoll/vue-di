/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { SingletonRegistration } from '../registration/SingletonRegistration';
import { registration } from './registration';

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
