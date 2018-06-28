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
export function Singleton(): ClassDecorator;
export function Singleton(key: Key<any>): ClassDecorator;
export function Singleton(key?: Key<any>): any {
    if (key) {
        return Registration(new SingletonRegistration())(key);
    } else {
        return Registration(new SingletonRegistration());
    }
}
