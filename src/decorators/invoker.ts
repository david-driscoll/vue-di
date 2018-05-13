/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import 'reflect-metadata';
import constants from '../constants';
import { Invoker } from '../invokers/Invoker';

/**
 * Decorator: Specifies a custom Invoker for the decorated item.
 */
export function Invoker(value: Invoker): any {
    return (target: any) => {
        Reflect.defineMetadata(constants.invoker, value, target);
    };
}
