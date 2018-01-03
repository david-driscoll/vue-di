/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import constants from '../constants';
import { _emptyParameters } from '../container/Container';

/**
 * Decorator: Directs the TypeScript transpiler to write-out type metadata for the decorated class.
 */
export function autoinject(): void;
export function autoinject(potentialTarget: any): ClassDecorator;
export function autoinject(potentialTarget?: any): any {
    const deco = (target: any) => {
        //make a copy of target.inject to avoid changing parent inject
        const previousInject = target.inject ? target.inject.slice() : null;
        const autoInject: any =
            Reflect.getOwnMetadata(constants.paramTypes, target) || _emptyParameters;
        if (!previousInject) {
            target.inject = autoInject;
        } else {
            for (let i = 0; i < autoInject.length; i++) {
                //check if previously injected.
                if (previousInject[i] && previousInject[i] !== autoInject[i]) {
                    const prevIndex = previousInject.indexOf(autoInject[i]);
                    if (prevIndex > -1) {
                        previousInject.splice(prevIndex, 1);
                    }
                    previousInject.splice(
                        prevIndex > -1 && prevIndex < i ? i - 1 : i,
                        0,
                        autoInject[i]
                    );
                } else if (!previousInject[i]) {
                    //else add
                    previousInject[i] = autoInject[i];
                }
            }
            target.inject = previousInject;
        }
    };

    return potentialTarget ? deco(potentialTarget) : deco;
}
