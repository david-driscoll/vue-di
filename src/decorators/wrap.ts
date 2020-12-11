/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import {hasOwnMetadata, defineMetadata, getOwnMetadata} from '../localReflect';
import constants from '../constants';
import { IWrappedResolver } from '../types';

/**
 * Decorator: Specifies a custom registration strategy for the decorated class/function.
 */
export function Wrap(wrap: IWrappedResolver<any>) {
    return (target: any) => {
        if (hasOwnMetadata(constants.wrap, target)) {
            const exitingWrap: IWrappedResolver<any> = getOwnMetadata(
                constants.wrap,
                target
            );
            defineMetadata(
                constants.wrap,
                {
                    get(v, container, key) {
                        return wrap.get(exitingWrap.get(v, container, key), container, key);
                    },
                } as IWrappedResolver<any>,
                target
            );
        } else {
            defineMetadata(constants.wrap, wrap, target);
        }
    };
}
