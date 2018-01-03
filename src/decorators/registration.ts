/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import constants from '../constants';
import { Registration } from '../registration/Registration';

/**
 * Decorator: Specifies a custom registration strategy for the decorated class/function.
 */
export function registration(value: Registration): any {
    return (target: any) => {
        Reflect.defineMetadata(constants.registration, value, target);
    };
}
