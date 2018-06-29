import constants from '../constants';
import { _emptyParameters, clearInvalidParameters } from './validateParameters';

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

    const dependencies = (Reflect.getMetadata(constants.paramTypes, target) || _emptyParameters).slice();
    const result = clearInvalidParameters(target, dependencies);
    Reflect.defineMetadata(constants.inject, result, target);
    return result;
}
