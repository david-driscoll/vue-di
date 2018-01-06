/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { Container } from '../container/Container';
import { resolver } from '../protocol/resolver';
import { Key, Resolver } from '../types';

/**
 * Used to allow functions/classes to specify an optional dependency, which will be resolved
 *      only if already registred with the container.
 */
@resolver
export class OptionalResolver<T = any> implements Resolver<T> {
    /**
     * Creates an Optional Resolver for the supplied key.
     * @param key The key to optionally resolve for.
     * @param [checkParent=true] Indicates whether or not the parent container hierarchy should be checked.
     * @return Returns an instance of Optional for the key.
     */
    public static of<T>(key: Key<T>, checkParent = true) {
        return new OptionalResolver(key, checkParent);
    }

    /** @internal */
    public _key: Key<T>;

    /** @internal */
    public _checkParent: boolean;

    /**
     * Creates an instance of the Optional class.
     * @param key The key to optionally resolve for.
     * @param checkParent Indicates whether or not the parent container hierarchy should be checked.
     */
    public constructor(key: Key<T>, checkParent = true) {
        this._key = key;
        this._checkParent = checkParent;
    }

    /**
     * Called by the container to provide optional resolution of the key.
     * @param container The container to resolve from.
     * @return Returns the instance if found; otherwise null.
     */
    public get(container: Container): any {
        if (container.hasHandler(this._key, this._checkParent)) {
            return container.get(this._key);
        }

        return null;
    }
}
