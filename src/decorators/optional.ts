import { OptionalResolver } from '../resolvers/OptionalResolver';
import { decorateParameterOrProperty } from './decorateParameterOrProperty';


/**
 * Decorator: Specifies the dependency as optional.
 *
 * @export
 */
export function optional(checkParent = true) {
    const resolver = (x: any) => OptionalResolver.of(x, checkParent);

    return decorateParameterOrProperty(resolver, 'optional');
}
