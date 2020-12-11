import constants from '../constants';
import { _emptyParameters, clearInvalidParameters } from './validateParameters';
// tslint:disable: no-unsafe-any

export function getInjectDependencies(target: any) {
    if (Reflect.hasOwnMetadata(constants.inject, target)) {
        return Reflect.getOwnMetadata(constants.inject, target);
    }

    if (Reflect.hasMetadata(constants.inject, target)) {
        const metadata = Reflect.getMetadata(constants.inject, target);
        Reflect.defineMetadata(constants.inject, metadata.slice(), target);
    }

    if (target.inject) {
        if (typeof target.inject === 'function') {
            target.inject = target.inject();
        }

        const result = clearInvalidParameters(target, target.inject);
        delete target.inject;
        Reflect.defineMetadata(constants.inject, result, target);

        return result;
    }

    const dependencies = (
        Reflect.getMetadata(constants.paramTypes, target) || _emptyParameters
    ).slice();
    // TypeScript 3.0 metadata for "...rest" gives type "Object"
    // if last parameter is "Object", assume it's a ...rest and remove that metadata.
    if (dependencies.length > 0 && dependencies[dependencies.length - 1] === Object) {
        dependencies.pop();
    }

    const result = clearInvalidParameters(target, dependencies);
    Reflect.defineMetadata(constants.inject, result, target);
    return result;
}
