import { NewInstanceResolver } from '../resolvers/NewInstanceResolver';
import { Key } from '../types';
import { decorateParameterOrProperty } from './decorateParameterOrProperty';

/**
 * Decorator: Specifies the dependency as a new instance.
 *
 * @export
 */
export function NewInstance(target: Object, propertyKey: string | symbol): void;
export function NewInstance(
    asKey?: Key<any>,
    ...dynamicDeps: any[]
): (target: Object, propertyKey: string | symbol, parameterIndex?: number) => void;
export function NewInstance(targetOrAsKey?: Object | Key<any>, ...args: any[]) {
    const deco = (k?: Key<any>, ...dynamicDeps: any[]) => {
        const resolver = (x: any) => {
            const value = NewInstanceResolver.of(x, ...dynamicDeps);

            if (!!k) {
                value.as(k);
            }

            return value;
        };

        return decorateParameterOrProperty(resolver, 'newInstance');
    };

    if (args.length > 0 && typeof args[0] === 'string') {
        // tslint:disable-next-line:no-non-null-assertion
        return deco()(targetOrAsKey!, args[0], args[1]);
    }

    return deco(targetOrAsKey as any, ...args);
}
