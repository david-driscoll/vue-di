import constants from '../constants';
import { ConstructorOf } from '../types';
export function Dependencies<T>(...rest: ConstructorParameters<ConstructorOf<T>>): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(constants.inject, rest, target);
    };
}
