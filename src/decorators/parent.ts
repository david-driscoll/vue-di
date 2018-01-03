import { ParentResolver } from '../resolvers/ParentResolver';
import { decorateParameterOrProperty } from './decorateParameterOrProperty';


/**
 * Decorator: Specifies the dependency to look at the parent container for resolution.
 *
 * @export
 */
export function parent() {
    const resolver = (x: any) => ParentResolver.of(x);

    return decorateParameterOrProperty(resolver, 'parent');
}
