/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import 'reflect-metadata';
import constants from '../constants';
import { getInjectDependencies } from '../container/getInjectDependencies';
import { ConstructorOf, Key, Resolver } from '../types';
import { decorateParameterOrProperty } from './decorateParameterOrProperty';

/**
 * Decorator: Specifies the dependencies that should be injected by the DI Container
 *      into the decoratored class/function.
 */

export function Inject(): (target: Object, name: string | symbol, index?: number) => void;
export function Inject(target: Object, propertyKey: string | symbol): void;
export function Inject(key?: Key<any>): ParameterDecorator & PropertyDecorator;
export function Inject(
    targetOrKey?: Object | Key<any>,
    propertyKey?: string | symbol,
    index?: number
): any {
    const deco = (k?: Key<any>) => decorateParameterOrProperty(x => k || x, 'resolve');
    if (propertyKey == null) {
        return deco(targetOrKey as any);
    }

    // tslint:disable-next-line:no-non-null-assertion
    return deco()(targetOrKey!, propertyKey, index);
}
