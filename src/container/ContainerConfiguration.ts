/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { InvocationHandler } from './InvocationHandler';
import { Resolver, Key } from '../types';

/**
 * Used to configure a Container instance.
 */
export interface IContainerConfiguration {
    name?: string;
    handlers?: Map<any, any>;
    throwOnMissingDependency?: boolean;
    /**
     * An optional callback which will be called when any function needs an InvocationHandler
     *  created (called once per Function).
     */
    onHandlerCreated?(handler: InvocationHandler): InvocationHandler;
    /**
     * An optional callback called just before a resolver is created and returned
     * Allows for interception of resolvers (perhaps for unit testing)
     * @param resolver
     */
    onRegisterResolver?(key: Key<any>, resolver: Resolver<any>): Resolver<any>;
}
