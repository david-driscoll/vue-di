import { AllResolver } from '../resolvers/AllResolver';
import { Key } from '../types';
import { decorateParameterOrProperty } from './decorateParameterOrProperty';

/**
 * Decorator: Specifies the dependency should load all instances of the given key.
 *
 * @export
 */
export function All(keyValue: Key<any>) {
    const resolver = AllResolver.of(keyValue);

    return decorateParameterOrProperty((x) => resolver, 'all');
}
