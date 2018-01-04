import { NewInstanceResolver } from '../resolvers/NewInstanceResolver';
import { decorateParameterOrProperty } from './decorateParameterOrProperty';
import { Key } from '../types';

/**
 * Decorator: Specifies the dependency as a new instance.
 *
 * @export
 */
export function newInstance(target: Object, propertyKey: string | symbol): void;
export function newInstance(asKey?: Key<any>, ...dynamicDeps: any[]): PropertyDecorator;
export function newInstance(targetOrAsKey?: Object | Key<any>, ...args: any[]) {
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

    if (typeof args[0] === 'string') {
        return deco()(targetOrAsKey!, args[0]);
    }

    return deco(targetOrAsKey as any, ...args);
}
