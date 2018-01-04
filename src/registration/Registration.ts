/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { Container } from '../container/Container';
import { Key } from '../types';
import { IResolver } from '../resolvers/Resolver';

/**
* Customizes how a particular function is resolved by the Container.
*/
export interface Registration {
    /**
    * Called by the container to register the resolver.
    * @param container The container the resolver is being registered with.
    * @param key The key the resolver should be registered as.
    * @param fn The function to create the resolver for.
    * @return The resolver that was registered.
    */
    registerResolver<T>(container: Container, key: Key<T>, fn: Function): IResolver<T>;
  }
