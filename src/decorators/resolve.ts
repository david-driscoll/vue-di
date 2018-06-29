import { Key } from '../types';
import { decorateParameterOrProperty } from './decorateParameterOrProperty';

/**
 * Decorator: Specifies the dependency to be resolved.
 *
 * @export
 */

export function Resolve(): (
    target: Object,
    propertyOrParameterName: string | symbol,
    index?: number
) => void;
export function Resolve(target: Object, propertyKey: string | symbol): void;
export function Resolve(
    key?: Key<any>
): (target: Object, propertyOrParameterName: string | symbol, index?: number | undefined) => void;
export function Resolve(
    targetOrKey?: Object | Key<any>,
    propertyKey?: string | symbol,
    index?: number
) {
    const deco = (k?: Key<any>) => decorateParameterOrProperty(x => k || x, 'resolve');
    if (propertyKey == null) {
        return deco(targetOrKey as any);
    }

    // tslint:disable-next-line:no-non-null-assertion
    return deco()(targetOrKey!, propertyKey, index);
}
