/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import 'reflect-metadata';
import constants from '../constants';

/**
 * Decorator: Specifies the dependencies that should be injected by the DI Container
 *      into the decoratored class/function.
 */
export function Inject(...rest: any[]): any {
    return (target: any, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        // handle when used as a parameter
        if (typeof descriptor === 'number' && rest.length === 1) {
            let params = target.inject;
            if (typeof params === 'function') {
                throw new Error(
                    'Decorator inject cannot be used with "inject()".  Please use an array instead.'
                );
            }
            if (!params) {
                params = Reflect.getOwnMetadata(constants.paramTypes, target).slice();
                target.inject = params;
            }
            params[descriptor] = rest[0];

            return;
        }
        // if it's true then we injecting rest into function and not Class constructor
        if (descriptor) {
            const fn = descriptor.value;
            fn.inject = rest;
        } else {
            target.inject = rest;
        }
    };
}
