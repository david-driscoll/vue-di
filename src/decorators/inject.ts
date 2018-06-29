/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import 'reflect-metadata';
import constants from '../constants';
import { clearInvalidParameters } from '../container/validateParameters';
import { getInjectDependencies } from '../container/getInjectDependencies';

/**
 * Decorator: Specifies the dependencies that should be injected by the DI Container
 *      into the decoratored class/function.
 */
export function Inject(...rest: any[]): any {
    return (target: any, key: string | symbol, descriptor: TypedPropertyDescriptor<any> | number) => {
        // handle when used as a parameter
        if (typeof descriptor === 'number' && rest.length === 1) {
            const params = getInjectDependencies(target);
            params[descriptor] = rest[0];
            return;
        }
        // if it's true then we injecting rest into function and not Class constructor
        if (descriptor) {
            const fn = (descriptor as any).value;
            Reflect.defineMetadata(constants.inject, rest, fn);
        } else {
            Reflect.defineMetadata(constants.inject, rest, target);
        }
    };
}
