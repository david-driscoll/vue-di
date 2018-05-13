/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { TransientRegistration } from '../registration/TransientRegistration';
import { Key } from '../types';
import { Registration } from './registration';

/**
 * Decorator: Specifies to register the decorated item with a "transient" lifetime.
 *
 * @export
 */
export function Transient<T extends Function>(ctor: T): T;
export function Transient(key?: Key<any>): ClassDecorator;
export function Transient(key?: Key<any> | Function): any {
    if (typeof key === 'function') {
        return Registration(new TransientRegistration(key))(key);
    }

    return Registration(new TransientRegistration(key));
}
