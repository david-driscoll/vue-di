/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { Container } from '../container/Container';
import { resolver } from '../decorators/resolver';
import { Key } from '../types';

/**
 * Used to allow functions/classes to specify lazy resolution logic.
 */
@resolver
export class LazyResolver<T = any> {
    /**
     * Creates a Lazy Resolver for the supplied key.
     * @param key The key to lazily resolve.
     * @return Returns an instance of Lazy for the key.
     */
    public static of<T>(key: Key<T>) {
        return new LazyResolver(key);
    }
    /** @internal */
    public _key: Key<T>;

    /**
     * Creates an instance of the Lazy class.
     * @param key The key to lazily resolve.
     */
    public constructor(key: Key<T>) {
        this._key = key;
    }

    /**
     * Called by the container to lazily resolve the dependency into a lazy locator function.
     * @param container The container to resolve from.
     * @return Returns a function which can be invoked at a later time to obtain the actual dependency.
     */
    public get(container: Container): any {
        return () => container.get(this._key);
    }
}
