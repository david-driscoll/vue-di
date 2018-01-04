import { AllResolver } from '../resolvers/AllResolver';
import { decorateParameterOrProperty } from './decorateParameterOrProperty';
import { Key } from '../types';

/**
 * Decorator: Specifies the dependency should load all instances of the given key.
 *
 * @export
 */
export function all(keyValue: Key<any>) {
    const resolver = AllResolver.of(keyValue);

    return decorateParameterOrProperty(x => resolver, 'all');
}
