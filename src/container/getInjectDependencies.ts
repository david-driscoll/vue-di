import { hasOwnMetadata, getOwnMetadata, hasMetadata, defineMetadata, getMetadata } from '../localReflect'
import constants from '../constants';
import { _emptyParameters, clearInvalidParameters } from './validateParameters';
// tslint:disable: no-unsafe-any

export function getInjectDependencies(target: any) {
    if (hasOwnMetadata(constants.inject, target)) {
        return getOwnMetadata(constants.inject, target);
    }

    if (hasMetadata(constants.inject, target)) {
        const metadata = getMetadata(constants.inject, target);
        defineMetadata(constants.inject, metadata.slice(), target);
    }

    if (target.inject) {
        if (typeof target.inject === 'function') {
            target.inject = target.inject();
        }

        const result = clearInvalidParameters(target, target.inject);
        delete target.inject;
        defineMetadata(constants.inject, result, target);

        return result;
    }

    const dependencies = (
        getMetadata(constants.paramTypes, target) || _emptyParameters
    ).slice();
    // TypeScript 3.0 metadata for "...rest" gives type "Object"
    // if last parameter is "Object", assume it's a ...rest and remove that metadata.
    if (dependencies.length > 0 && dependencies[dependencies.length - 1] === Object) {
        dependencies.pop();
    }

    const result = clearInvalidParameters(target, dependencies);
    defineMetadata(constants.inject, result, target);
    return result;
}
