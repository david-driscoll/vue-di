/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { Container } from '../container/Container';
import { Key } from '../types';

/**
 * Used to allow functions/classes to specify custom dependency resolution logic.
 */
export interface IResolver<T> {
    /**
     * Called by the container to allow custom resolution of dependencies for a function/class.
     * @param container The container to resolve from.
     * @param key The key that the resolver was registered as.
     * @return Returns the resolved object.
     */
    get(container: Container, key?: Key<T>): T;
}
