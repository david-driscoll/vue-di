/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { Container } from '../container/Container';
import { Key, Resolver } from '../types';

/**
 * Used to allow functions/classes to indicate that they should be registered as scoped with the container.
 */
export class ScopedRegistration<T = any> {
    /**
     * Creates an instance of ScopedRegistration.
     * @param key The key to register as.
     */
    public constructor(private readonly _key?: Key<T>) {}

    /**
     * Called by the container to register the resolver.
     * @param container The container the resolver is being registered with.
     * @param key The key the resolver should be registered as.
     * @param fn The function to create the resolver for.
     * @return The resolver that was registered.
     */
    public registerResolver(container: Container, key: Key<T>, fn: () => T): Resolver<T> {
        const existingResolver = container.getResolver(this._key || key, false);

        return existingResolver === undefined
            ? container.registerScoped(this._key || key, fn)
            : existingResolver;
    }
}
