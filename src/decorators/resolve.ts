import { Key } from '../types';
import { decorateParameterOrProperty } from './decorateParameterOrProperty';

/**
 * Decorator: Specifies the dependency to be resolved.
 *
 * @export
 */
export function resolve(target: Object, propertyKey: string | symbol): void;
export function resolve(key?: Key<any>): PropertyDecorator;
export function resolve(targetOrKey?: Object | Key<any>, propertyKey?: string | symbol) {
    const deco = (k?: Key<any>) => decorateParameterOrProperty(x => k || x, 'resolve');
    if (propertyKey == null) {
        return deco(targetOrKey as any);
    }

    // tslint:disable-next-line:no-non-null-assertion
    return deco()(targetOrKey!, propertyKey);
}

export const inject = resolve;
