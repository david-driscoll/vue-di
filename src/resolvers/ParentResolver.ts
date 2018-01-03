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
 * Used to inject the dependency from the parent container instead of the current one.
 */
@resolver
export class ParentResolver {
    /**
     * Creates a Parent Resolver for the supplied key.
     * @param key The key to resolve.
     * @return Returns an instance of Parent for the key.
     */
    public static of(key: Key) {
        return new ParentResolver(key);
    }

    /** @internal */
    public _key: Key;

    /**
     * Creates an instance of the Parent class.
     * @param key The key to resolve from the parent container.
     */
    public constructor(key: Key) {
        this._key = key;
    }

    /**
     * Called by the container to load the dependency from the parent container
     * @param container The container to resolve the parent from.
     * @return Returns the matching instance from the parent container
     */
    public get(container: Container): any {
        return container.parent ? container.parent.get(this._key) : null;
    }
}
