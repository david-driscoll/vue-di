/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { Container } from '../container/Container';
import { containerResolver } from '../protocol/resolver';
import { FactoryMethod, Key, Resolver, Strategy } from '../types';

/**
 * Used to allow injecting dependencies but also passing data to the constructor.
 */
@containerResolver
export class FactoryResolver<F extends FactoryMethod<T>, T = any> implements Resolver<F> {
    /**
     * Creates a Factory Resolver for the supplied key.
     * @param key The key to resolve.
     * @return Returns an instance of Factory for the key.
     */
    public static of<F extends FactoryMethod<T>, T = any>(key: Key<T>) {
        return new FactoryResolver<F>(key);
    }

    /** @internal */
    public _key: Key<T>;

    /**
     * Creates an instance of the Factory class.
     * @param key The key to resolve from the parent container.
     */
    public constructor(key: Key<T>) {
        this._key = key;
    }

    /**
     * Called by the container to pass the dependencies to the constructor.
     * @param container The container to invoke the constructor with dependencies and other parameters.
     * @return Returns a function that can be invoked to resolve dependencies later, and the rest of the parameters.
     */
    public get(container: Container, key: Key<F>): F {
        let _key = this._key;
        let resolver = container.getResolver(_key as any);
        if (resolver && (resolver as any).strategy === Strategy.Function) {
            _key = (resolver as any).state;
        }
        // tslint:disable-next-line:only-arrow-functions
        return function(...rest: any[]) {
            return container.invoke(_key as any, rest);
        } as F;
    }
}
