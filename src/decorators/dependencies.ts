import {defineMetadata} from '../localReflect';
import constants from '../constants';
import { ConstructorOf } from '../types';
export function Dependencies<T>(...rest: ConstructorParameters<ConstructorOf<T>>): ClassDecorator {
    return (target: any) => {
        defineMetadata(constants.inject, rest, target);
    };
}
