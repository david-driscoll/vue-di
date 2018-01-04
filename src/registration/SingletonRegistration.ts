/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { Container } from '../container/Container';
import { IResolver } from '../resolvers/Resolver';
import { Key } from '../types';
import { IRegistration } from './Registration';

/**
 * Used to allow functions/classes to indicate that they should be registered as singletons with the container.
 */
export class SingletonRegistration<T = any> implements IRegistration<T> {
    /** @internal */
    public _registerInChild: any;

    /** @internal */
    public _key: Key<T>;

    /**
     * Creates an instance of SingletonRegistration.
     * @param key The key to register as.
     */
    public constructor(keyOrRegisterInChild?: any, registerInChild = false) {
        if (typeof keyOrRegisterInChild === 'boolean') {
            this._registerInChild = keyOrRegisterInChild;
        } else {
            this._key = keyOrRegisterInChild;
            this._registerInChild = registerInChild;
        }
    }

    /**
     * Called by the container to register the resolver.
     * @param container The container the resolver is being registered with.
     * @param key The key the resolver should be registered as.
     * @param fn The function to create the resolver for.
     * @return The resolver that was registered.
     */
    public registerResolver(container: Container, key: Key<T>, fn: Function): IResolver<T> {
        const targetContainer = this._registerInChild ? container : container.root;
        const existingResolver = targetContainer.getResolver(this._key || key);

        return existingResolver === undefined
            ? targetContainer.registerSingleton(this._key || key, fn)
            : existingResolver;
    }
}
