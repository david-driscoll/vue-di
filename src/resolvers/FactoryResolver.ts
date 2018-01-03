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
 * Used to allow injecting dependencies but also passing data to the constructor.
 */
@resolver
export class FactoryResolver {
    /**
     * Creates a Factory Resolver for the supplied key.
     * @param key The key to resolve.
     * @return Returns an instance of Factory for the key.
     */
    public static of(key: Function) {
        return new FactoryResolver(key);
    }

    /** @internal */
    public _key: Function;

    /**
     * Creates an instance of the Factory class.
     * @param key The key to resolve from the parent container.
     */
    public constructor(key: Function) {
        this._key = key;
    }

    /**
     * Called by the container to pass the dependencies to the constructor.
     * @param container The container to invoke the constructor with dependencies and other parameters.
     * @return Returns a function that can be invoked to resolve dependencies later, and the rest of the parameters.
     */
    public get(container: Container): any {
        return (...rest: any[]) => container.invoke(this._key, rest);
    }
}
