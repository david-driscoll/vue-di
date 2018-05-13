/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import 'reflect-metadata';
import constants from '../constants';
import { FactoryInvoker } from '../invokers/FactoryInvoker';

/**
 * Decorator: Specifies that the decorated item should be called as a factory function, rather than a constructor.
 */
export function InvokeAsFactory(potentialTarget?: any): any {
    const deco = (target: any) => {
        Reflect.defineMetadata(constants.invoker, FactoryInvoker.instance, target);
    };

    return potentialTarget ? deco(potentialTarget) : deco;
}
