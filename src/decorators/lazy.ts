import { LazyResolver } from '../resolvers/LazyResolver';
import { decorateParameterOrProperty } from './decorateParameterOrProperty';

/**
 * Decorator: Specifies the dependency should be lazy loaded.
 *
 * @export
 */
export function lazy(keyValue: string | symbol | Function) {
    const resolver = LazyResolver.of(keyValue);

    return decorateParameterOrProperty(x => resolver, 'lazy');
}
