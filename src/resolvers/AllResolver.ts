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
 * Used to allow functions/classes to specify resolution of all matches to a key.
 */
@resolver
export class AllResolver {
    /**
     * Creates an All Resolver for the supplied key.
     * @param key The key to resolve all instances for.
     * @return Returns an instance of All for the key.
     */
    public static of(key: Key) {
        return new AllResolver(key);
    }

    /** @internal */
    public _key: Key;

    /**
     * Creates an instance of the All class.
     * @param key The key to lazily resolve all matches for.
     */
    public constructor(key: Key) {
        this._key = key;
    }

    /**
     * Called by the container to resolve all matching dependencies as an array of instances.
     * @param container The container to resolve from.
     * @return Returns an array of all matching instances.
     */
    public get(container: Container) {
        return container.getAll(this._key);
    }
}
