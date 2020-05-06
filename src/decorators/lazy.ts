import { LazyResolver } from '../resolvers/LazyResolver';
import { Key } from '../types';
import { decorateParameterOrProperty } from './decorateParameterOrProperty';

/**
 * Decorator: Specifies the dependency should be lazy loaded.
 *
 * @export
 */
export function Lazy(keyValue: Key<any>) {
    const resolver = LazyResolver.of(keyValue);

    return decorateParameterOrProperty((x) => resolver, 'lazy');
}
