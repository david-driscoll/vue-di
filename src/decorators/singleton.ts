/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { SingletonRegistration } from '../registration/SingletonRegistration';
import { Key } from '../types';
import { Registration } from './registration';

/**
 * Decorator: Specifies to register the decorated item with a "singleton" lifetime.
 *
 * @export
 */
export function Singleton<T extends Function>(ctor: T): void;
export function Singleton(registerInChild?: boolean): ClassDecorator;
export function Singleton(key: Key<any>, registerInChild?: boolean): ClassDecorator;
export function Singleton(
    keyOrRegisterInChild: Key<any> | boolean = false,
    registerInChild = false
): any {
    if (typeof keyOrRegisterInChild === 'boolean') {
        return Registration(new SingletonRegistration(keyOrRegisterInChild));
    }

    return Registration(new SingletonRegistration(keyOrRegisterInChild, registerInChild))(
        keyOrRegisterInChild
    );
}
