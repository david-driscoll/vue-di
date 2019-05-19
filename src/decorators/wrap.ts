/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import 'reflect-metadata';
import constants from '../constants';
import { IWrappedResolver } from '../types';

/**
 * Decorator: Specifies a custom registration strategy for the decorated class/function.
 */
export function Wrap(wrap: IWrappedResolver<any>) {
    return (target: any) => {
        if (Reflect.hasOwnMetadata(constants.wrap, target)) {
            const exitingWrap: IWrappedResolver<any> = Reflect.getOwnMetadata(
                constants.wrap,
                target
            );
            Reflect.defineMetadata(
                constants.wrap,
                {
                    get(v, container, key) {
                        return wrap.get(exitingWrap.get(v, container, key), container, key);
                    },
                } as IWrappedResolver<any>,
                target
            );
        } else {
            Reflect.defineMetadata(constants.wrap, wrap, target);
        }
    };
}
