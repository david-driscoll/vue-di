/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { Container } from '../container/Container';
import { Key, Resolver } from '../types';
import { IRegistration } from './Registration';

/**
 * Used to allow functions/classes to indicate that they should be registered as transients with the container.
 */
export class TransientRegistration<T = any> implements IRegistration<T> {
    /** @internal */
    public _key: Key<T>;

    /**
     * Creates an instance of TransientRegistration.
     * @param key The key to register as.
     */
    public constructor(key?: any) {
        this._key = key;
    }

    /**
     * Called by the container to register the resolver.
     * @param container The container the resolver is being registered with.
     * @param key The key the resolver should be registered as.
     * @param fn The function to create the resolver for.
     * @return The resolver that was registered.
     */
    public registerResolver(container: Container, key: Key<T>, fn: Function): Resolver<T> {
        const existingResolver = container.getResolver(this._key || key);

        return existingResolver === undefined
            ? container.registerTransient(this._key || key, fn)
            : existingResolver;
    }
}
