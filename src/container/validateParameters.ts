import { Key } from '../types';

export const _emptyParameters = Object.freeze<any>([]);
const _invalidParameters = Object.freeze<any>([Function, Object, String, RegExp, Number, Boolean, Array, Promise]);
class Invalid {
    public constructor(public container: any, public key: any) {
        if (container instanceof Function) {
            this.container = container.name;
        }
        if (key instanceof Function) {
            this.key = key.name;
        }
    }
}
export function clearInvalidParameters(container: any, inject: any[]) {
    return inject.map(x => (_invalidParameters.some(z => z === x) ? new Invalid(container, x) : x));
}

export function validateKey(key: Key<any>) {
    if (key === null || key === undefined) {
        throw new Error(
            // tslint:disable-next-line:max-line-length
            "key/value cannot be null or undefined. Are you trying to inject/register something that doesn't exist with DI?"
        );
    }
    if (key instanceof Invalid) {
        throw new Error(
            `Invalid key found on ${key.container} looking for type ${
                key.key
            }.  Are you trying to inject/register something that doesn't exist with DI?`
        );
    }
}
