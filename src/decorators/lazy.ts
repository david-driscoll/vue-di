import { LazyResolver } from '../resolvers/LazyResolver';
import { decorateParameterOrProperty } from './decorateParameterOrProperty';
import { Key } from '../types';

/**
 * Decorator: Specifies the dependency should be lazy loaded.
 *
 * @export
 */
export function lazy(keyValue: Key<any>) {
    const resolver = LazyResolver.of(keyValue);

    return decorateParameterOrProperty(x => resolver, 'lazy');
}
