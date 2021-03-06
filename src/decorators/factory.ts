/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { FactoryResolver } from '../resolvers/FactoryResolver';
import { Key } from '../types';
import { decorateParameterOrProperty } from './decorateParameterOrProperty';

/**
 * Decorator: Specifies the dependency to create a factory method, that can accept optional arguments
 */
export function Factory(keyValue: Key<any>) {
    const resolver = FactoryResolver.of(keyValue);

    return decorateParameterOrProperty((x) => resolver, 'factory');
}
